import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../common/errors/app-error';
import { pagination } from '../../common/utils/pagination';
import { customerSearchSchema, profileSchema } from './customers.schema';

const publicUser = { id: true, email: true, fullName: true, phone: true, role: true, isActive: true, createdAt: true } as const;

export class CustomersService {
  constructor(private readonly db: PrismaClient = prisma) {}
  async profile(id: string) {
    const user = await this.db.user.findUnique({ where: { id }, select: { ...publicUser, profile: true } });
    if (!user) throw new AppError(404, 'CUSTOMER_NOT_FOUND', 'Customer not found');
    return user;
  }
  /** Completes or replaces the customer's rental eligibility profile. */
  async updateProfile(id: string, input: z.infer<typeof profileSchema>) {
    return this.db.customerProfile.upsert({ where: { userId: id }, create: { userId: id, ...input, dateOfBirth: new Date(input.dateOfBirth), licenseExpiry: new Date(input.licenseExpiry) }, update: { ...input, dateOfBirth: new Date(input.dateOfBirth), licenseExpiry: new Date(input.licenseExpiry) } });
  }
  async list(query: z.infer<typeof customerSearchSchema>) {
    const where = { role: 'CUSTOMER' as const, deletedAt: null, ...(query.search && { OR: [{ fullName: { contains: query.search, mode: 'insensitive' as const } }, { email: { contains: query.search, mode: 'insensitive' as const } }] }) };
    const [data, total] = await this.db.$transaction([
      this.db.user.findMany({ where, select: publicUser, ...pagination(query), orderBy: { [query.sort]: query.sort === 'createdAt' ? 'desc' : 'asc' } }),
      this.db.user.count({ where }),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }
  async detail(id: string) {
    const user = await this.db.user.findFirst({ where: { id, role: 'CUSTOMER', deletedAt: null }, select: { ...publicUser, profile: true, bookings: { orderBy: { createdAt: 'desc' }, include: { vehicle: { select: { make: true, model: true } } } } } });
    if (!user) throw new AppError(404, 'CUSTOMER_NOT_FOUND', 'Customer not found');
    return user;
  }
  async status(id: string, isActive: boolean) {
    await this.detail(id);
    const user = await this.db.user.update({ where: { id }, data: { isActive }, select: publicUser });
    if (!isActive) await this.db.refreshToken.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
    return user;
  }
}
