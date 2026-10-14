import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../common/errors/app-error';
import { pagination } from '../../common/utils/pagination';
import { assertTransition } from './booking.state';
import { bookingListSchema } from './bookings.schema';
import { lateFee } from './pricing.service';

type List = z.infer<typeof bookingListSchema>;

export class BookingAdminService {
  constructor(private readonly db: PrismaClient = prisma) {}

  async list(query: List) {
    const where: Prisma.BookingWhereInput = {
      ...(query.status && { status: query.status }), ...(query.customerId && { customerId: query.customerId }),
      ...(query.vehicleId && { vehicleId: query.vehicleId }),
      ...(query.from && { startAt: { gte: new Date(query.from) } }), ...(query.to && { endAt: { lte: new Date(query.to) } }),
    };
    const [data, total] = await this.db.$transaction([
      this.db.booking.findMany({ where, ...pagination(query), orderBy: { [query.sort]: 'desc' }, include: { customer: { select: { id: true, fullName: true, email: true } }, vehicle: { select: { id: true, make: true, model: true } } } }),
      this.db.booking.count({ where }),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }

  private async transition(id: string, to: 'CONFIRMED' | 'ACTIVE') {
    return this.db.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM bookings WHERE id = ${id}::uuid FOR UPDATE`;
      const booking = await tx.booking.findUnique({ where: { id } });
      if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
      assertTransition(booking.status, to);
      return tx.booking.update({ where: { id }, data: { status: to } });
    });
  }
  /** Confirms a pending reservation. */
  confirm(id: string) { return this.transition(id, 'CONFIRMED'); }
  /** Marks a confirmed vehicle as collected. */
  pickup(id: string) { return this.transition(id, 'ACTIVE'); }

  async reject(id: string, reason: string) {
    return this.db.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM bookings WHERE id = ${id}::uuid FOR UPDATE`;
      const booking = await tx.booking.findUnique({ where: { id } });
      if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
      assertTransition(booking.status, 'REJECTED');
      if (booking.couponId) await tx.coupon.update({ where: { id: booking.couponId }, data: { usedCount: { decrement: 1 } } });
      return tx.booking.update({ where: { id }, data: { status: 'REJECTED', cancelReason: reason } });
    });
  }

  /** Completes a rental, records any late fee, and returns a paid deposit. */
  async returnVehicle(id: string, mileageKm: number, actual = new Date()) {
    return this.db.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM bookings WHERE id = ${id}::uuid FOR UPDATE`;
      const booking = await tx.booking.findUnique({ where: { id }, include: { vehicle: true, payments: true } });
      if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
      assertTransition(booking.status, 'COMPLETED');
      if (actual < booking.startAt || mileageKm < booking.vehicle.mileageKm) throw new AppError(422, 'INVALID_RETURN', 'Return date or mileage is invalid');
      const fee = lateFee(booking.endAt, actual, booking.dailyRateSnapshot);
      if (fee.gt(0)) await tx.payment.create({ data: { bookingId: id, type: 'LATE_FEE', amount: fee, method: 'ONLINE', status: 'PENDING' } });
      const depositPaid = booking.payments.filter(payment => payment.type === 'DEPOSIT' && payment.status === 'PAID').reduce((sum, payment) => sum.add(payment.amount), new Prisma.Decimal(0));
      if (depositPaid.gt(0)) await tx.payment.create({ data: { bookingId: id, type: 'REFUND', amount: depositPaid, method: 'ONLINE', status: 'REFUNDED', paidAt: actual, transactionRef: `MOCK-DEPOSIT-${booking.bookingNo}` } });
      await tx.vehicle.update({ where: { id: booking.vehicleId }, data: { mileageKm } });
      return tx.booking.update({ where: { id }, data: { status: 'COMPLETED', actualReturnAt: actual, lateFee: fee, totalAmount: booking.totalAmount.add(fee) } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
}
