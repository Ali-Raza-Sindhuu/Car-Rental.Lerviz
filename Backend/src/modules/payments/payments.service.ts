import { PaymentMethod, Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../common/errors/app-error';
import { pagination } from '../../common/utils/pagination';
import { assertTransition } from '../bookings/booking.state';
import { mockGateway } from './gateways/mock.gateway';
import { paymentListSchema } from './payments.schema';

export class PaymentsService {
  constructor(private readonly db: PrismaClient = prisma) {}
  /** Pays outstanding rental/deposit or a late fee through the replaceable mock gateway. */
  async pay(customerId: string, bookingId: string, method: PaymentMethod) {
    return this.db.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM bookings WHERE id = ${bookingId}::uuid FOR UPDATE`;
      const booking = await tx.booking.findFirst({ where: { id: bookingId, customerId }, include: { payments: true } });
      if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
      if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') throw new AppError(409, 'PAYMENT_CLOSED', 'Booking cannot be paid');
      const rentalPaid = booking.payments.some(payment => payment.type === 'RENTAL' && payment.status === 'PAID');
      if (!rentalPaid) {
        if (!['PENDING', 'CONFIRMED', 'ACTIVE'].includes(booking.status)) throw new AppError(409, 'PAYMENT_CLOSED', 'Rental payment is not open');
        const rental = await mockGateway.charge(booking.totalAmount);
        const payments = [await tx.payment.create({ data: { bookingId, type: 'RENTAL', amount: booking.totalAmount, method, status: 'PAID', ...rental } })];
        if (booking.depositAmount.gt(0)) {
          const deposit = await mockGateway.charge(booking.depositAmount);
          payments.push(await tx.payment.create({ data: { bookingId, type: 'DEPOSIT', amount: booking.depositAmount, method, status: 'PAID', ...deposit } }));
        }
        if (booking.status === 'PENDING') {
          assertTransition(booking.status, 'CONFIRMED');
          await tx.booking.update({ where: { id: bookingId }, data: { status: 'CONFIRMED' } });
        }
        return payments;
      }
      const late = booking.payments.find(payment => payment.type === 'LATE_FEE' && payment.status === 'PENDING');
      if (!late) throw new AppError(409, 'ALREADY_PAID', 'No outstanding payment');
      const paid = await mockGateway.charge(late.amount);
      return [await tx.payment.update({ where: { id: late.id }, data: { method, status: 'PAID', ...paid } })];
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async mine(customerId: string, bookingId: string) {
    const booking = await this.db.booking.findFirst({ where: { id: bookingId, customerId }, select: { id: true } });
    if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
    return this.db.payment.findMany({ where: { bookingId }, orderBy: { createdAt: 'desc' } });
  }

  async list(query: z.infer<typeof paymentListSchema>) {
    const where: Prisma.PaymentWhereInput = {
      ...(query.status && { status: query.status }),
      ...((query.from || query.to) && { createdAt: { ...(query.from && { gte: new Date(query.from) }), ...(query.to && { lte: new Date(query.to) }) } }),
    };
    const [data, total] = await this.db.$transaction([
      this.db.payment.findMany({ where, ...pagination(query), orderBy: { [query.sort]: 'desc' }, include: { booking: { select: { bookingNo: true, customer: { select: { fullName: true, email: true } } } } } }),
      this.db.payment.count({ where }),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }
}
