import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../common/errors/app-error';
import { pagination } from '../../common/utils/pagination';
import { couponListSchema, couponSchema, couponUpdateSchema } from './coupons.schema';

type Input = z.infer<typeof couponSchema>;

export class CouponsService {
  constructor(private readonly db: PrismaClient = prisma) {}

  /** Lists discount codes for administrators. */
  async list(query: z.infer<typeof couponListSchema>) {
    const where = { ...(query.isActive !== undefined && { isActive: query.isActive }) };
    const [data, total] = await this.db.$transaction([
      this.db.coupon.findMany({ where, ...pagination(query), orderBy: { [query.sort]: 'asc' } }),
      this.db.coupon.count({ where }),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }

  async get(id: string) {
    const coupon = await this.db.coupon.findUnique({ where: { id } });
    if (!coupon) throw new AppError(404, 'COUPON_NOT_FOUND', 'Coupon not found');
    return coupon;
  }

  /** Creates a code; the database unique constraint prevents duplicates. */
  async create(input: Input) {
    return this.db.coupon.create({ data: { ...input, validFrom: new Date(input.validFrom), validTo: new Date(input.validTo) } });
  }

  async update(id: string, input: z.infer<typeof couponUpdateSchema>) {
    const current = await this.get(id);
    const merged = couponSchema.parse({
      code: current.code, discountType: current.discountType, value: current.value.toNumber(),
      minDays: current.minDays, validFrom: current.validFrom.toISOString(), validTo: current.validTo.toISOString(),
      maxUses: current.maxUses, isActive: current.isActive, ...input,
    });
    if (merged.maxUses < current.usedCount) throw new AppError(409, 'COUPON_IN_USE', 'Usage limit cannot be lower than the number of redemptions');
    return this.db.coupon.update({ where: { id }, data: { ...merged, validFrom: new Date(merged.validFrom), validTo: new Date(merged.validTo) } });
  }

  async remove(id: string) {
    await this.get(id);
    if (await this.db.booking.count({ where: { couponId: id } })) throw new AppError(409, 'COUPON_IN_USE', 'Coupon has booking history; deactivate it instead');
    await this.db.coupon.delete({ where: { id } });
  }
}
