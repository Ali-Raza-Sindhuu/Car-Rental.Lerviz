import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { RENTAL } from '../../config/constants';
import { AppError } from '../../common/errors/app-error';
import { bookingNumber } from '../../common/utils/booking-number';
import { pagination } from '../../common/utils/pagination';
import { assertAvailable } from './availability.service';
import { assertTransition } from './booking.state';
import { bookingInputSchema, bookingListSchema } from './bookings.schema';
import { priceRental, refundFraction, validateRentalDates } from './pricing.service';
import { mockGateway } from '../payments/gateways/mock.gateway';

type Input = z.infer<typeof bookingInputSchema>;
type List = z.infer<typeof bookingListSchema>;
type Db = Prisma.TransactionClient;

function ageAt(birth: Date, at: Date) {
  let age = at.getUTCFullYear() - birth.getUTCFullYear();
  if (at.getUTCMonth() < birth.getUTCMonth() || (at.getUTCMonth() === birth.getUTCMonth() && at.getUTCDate() < birth.getUTCDate())) age--;
  return age;
}

export class BookingsService {
  constructor(private readonly db: PrismaClient = prisma) {}

  private async coupon(db: Db, code: string | undefined, days: number) {
    if (!code) return undefined;
    const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
    const now = new Date();
    if (!coupon || !coupon.isActive || coupon.validFrom > now || coupon.validTo < now || coupon.minDays > days || coupon.usedCount >= coupon.maxUses) throw new AppError(422, 'INVALID_COUPON', 'Coupon is invalid or expired');
    return coupon;
  }

  private async vehicleAndLocations(db: Db, input: Input) {
    const vehicle = await db.vehicle.findFirst({ where: { id: input.vehicleId, deletedAt: null }, include: { category: true } });
    if (!vehicle) throw new AppError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found');
    const locations = await db.location.findMany({ where: { id: { in: [input.pickupLocationId, input.dropoffLocationId] }, isActive: true } });
    if (locations.length !== new Set([input.pickupLocationId, input.dropoffLocationId]).size || vehicle.locationId !== input.pickupLocationId) throw new AppError(422, 'INVALID_LOCATION', 'Pickup must match the vehicle branch and both branches must be active');
    return vehicle;
  }

  /** Previews a rental price without reserving a vehicle or consuming a coupon. */
  async quote(input: Input) {
    const start = new Date(input.startAt), end = new Date(input.endAt);
    validateRentalDates(start, end);
    return this.db.$transaction(async tx => {
      const vehicle = await this.vehicleAndLocations(tx, input);
      await assertAvailable(tx, vehicle.id, start, end);
      const days = Math.ceil((end.getTime() - start.getTime()) / 86400000);
      const coupon = await this.coupon(tx, input.couponCode, days);
      return priceRental(start, end, vehicle.dailyRate, vehicle.category.depositAmount, coupon);
    });
  }

  /** Locks the vehicle row and creates the reservation in a serializable transaction. */
  async create(customerId: string, input: Input) {
    const start = new Date(input.startAt), end = new Date(input.endAt);
    validateRentalDates(start, end);
    return this.db.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM vehicles WHERE id = ${input.vehicleId}::uuid FOR UPDATE`;
      const profile = await tx.customerProfile.findUnique({ where: { userId: customerId } });
      const expiryEnd = profile && new Date(profile.licenseExpiry.getTime() + 86400000);
      if (!profile || ageAt(profile.dateOfBirth, start) < RENTAL.minAge || !expiryEnd || expiryEnd <= end) throw new AppError(422, 'CUSTOMER_INELIGIBLE', 'Complete your profile, meet the minimum age, and hold a license valid through return');
      const vehicle = await this.vehicleAndLocations(tx, input);
      await assertAvailable(tx, vehicle.id, start, end);
      const days = Math.ceil((end.getTime() - start.getTime()) / 86400000);
      const coupon = await this.coupon(tx, input.couponCode, days);
      const price = priceRental(start, end, vehicle.dailyRate, vehicle.category.depositAmount, coupon);
      if (coupon) {
        const claimed = await tx.coupon.updateMany({ where: { id: coupon.id, isActive: true, usedCount: { lt: coupon.maxUses } }, data: { usedCount: { increment: 1 } } });
        if (!claimed.count) throw new AppError(409, 'COUPON_EXHAUSTED', 'Coupon usage limit reached');
      }
      return tx.booking.create({ data: {
        bookingNo: bookingNumber(), customerId, vehicleId: vehicle.id,
        pickupLocationId: input.pickupLocationId, dropoffLocationId: input.dropoffLocationId,
        startAt: start, endAt: end, notes: input.notes, couponId: coupon?.id, ...price,
      }, include: { vehicle: { select: { make: true, model: true } } } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 10000 });
  }

  async mine(customerId: string, query: List) {
    const where = { customerId, ...(query.status && { status: query.status }) };
    const [data, total] = await this.db.$transaction([
      this.db.booking.findMany({ where, ...pagination(query), orderBy: { [query.sort]: 'desc' }, include: { vehicle: { select: { make: true, model: true, images: true } } } }),
      this.db.booking.count({ where }),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }

  async detail(customerId: string, id: string) {
    const booking = await this.db.booking.findFirst({ where: { id, customerId }, include: { vehicle: true, pickupLocation: true, dropoffLocation: true, payments: true, review: true } });
    if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
    return booking;
  }

  /** Cancels a future booking and records the policy-based refund atomically. */
  async cancel(customerId: string, id: string, reason: string) {
    return this.db.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM bookings WHERE id = ${id}::uuid FOR UPDATE`;
      const booking = await tx.booking.findFirst({ where: { id, customerId }, include: { payments: true } });
      if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
      assertTransition(booking.status, 'CANCELLED');
      if (booking.startAt <= new Date()) throw new AppError(409, 'CANCELLATION_CLOSED', 'Pickup time has passed');
      const rentalPaid = booking.payments.filter(payment => payment.type === 'RENTAL' && payment.status === 'PAID').reduce((sum, payment) => sum.add(payment.amount), new Prisma.Decimal(0));
      const depositPaid = booking.payments.filter(payment => payment.type === 'DEPOSIT' && payment.status === 'PAID').reduce((sum, payment) => sum.add(payment.amount), new Prisma.Decimal(0));
      const refund = rentalPaid.mul(refundFraction(booking.startAt, new Date())).add(depositPaid).toDecimalPlaces(2);
      if (refund.gt(0)) {
        const gateway = await mockGateway.refund(refund);
        await tx.payment.create({ data: { bookingId: id, type: 'REFUND', amount: refund, method: 'ONLINE', status: 'REFUNDED', ...gateway } });
      }
      if (booking.couponId) await tx.coupon.update({ where: { id: booking.couponId }, data: { usedCount: { decrement: 1 } } });
      return tx.booking.update({ where: { id }, data: { status: 'CANCELLED', cancelReason: reason } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
}
