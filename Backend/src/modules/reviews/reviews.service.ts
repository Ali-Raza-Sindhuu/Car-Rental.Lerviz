import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../common/errors/app-error';
import { pagination } from '../../common/utils/pagination';
import { reviewListSchema, reviewSchema } from './reviews.schema';

export class ReviewsService {
  constructor(private readonly db: PrismaClient = prisma) {}
  /** A customer may review their own completed rental once. */
  async create(customerId: string, bookingId: string, input: z.infer<typeof reviewSchema>) {
    const booking = await this.db.booking.findFirst({ where: { id: bookingId, customerId } });
    if (!booking) throw new AppError(404, 'BOOKING_NOT_FOUND', 'Booking not found');
    if (booking.status !== 'COMPLETED') throw new AppError(409, 'REVIEW_NOT_ALLOWED', 'Complete the rental before reviewing');
    if (await this.db.review.findUnique({ where: { bookingId } })) throw new AppError(409, 'REVIEW_EXISTS', 'Booking already has a review');
    return this.db.review.create({ data: { bookingId, customerId, vehicleId: booking.vehicleId, ...input } });
  }
  async vehicleReviews(vehicleId: string, query: z.infer<typeof reviewListSchema>) {
    const where = { vehicleId };
    const [data, total] = await this.db.$transaction([
      this.db.review.findMany({ where, ...pagination(query), orderBy: { [query.sort]: 'desc' }, include: { customer: { select: { fullName: true } } } }),
      this.db.review.count({ where }),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }
  async list(query: z.infer<typeof reviewListSchema>) {
    const [data, total] = await this.db.$transaction([
      this.db.review.findMany({ ...pagination(query), orderBy: { [query.sort]: 'desc' }, include: { customer: { select: { fullName: true } }, vehicle: { select: { make: true, model: true } } } }),
      this.db.review.count(),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }
  async remove(id: string) {
    const exists = await this.db.review.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new AppError(404, 'REVIEW_NOT_FOUND', 'Review not found');
    await this.db.review.delete({ where: { id } });
  }
}
