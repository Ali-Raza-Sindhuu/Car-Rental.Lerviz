import { PrismaClient } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { pagination } from '../../common/utils/pagination';
import { AppError } from '../../common/errors/app-error';
import { z } from 'zod';
import { locationListSchema, locationSchema, locationUpdateSchema } from './locations.schema';

export class LocationsService {
  constructor(private readonly db: PrismaClient = prisma) {}
  /** Lists active public branches or every branch for an administrator. */
  async list(query: z.infer<typeof locationListSchema>, admin = false) {
    const where = { ...(!admin && { isActive: true }), ...(query.city && { city: { contains: query.city, mode: 'insensitive' as const } }) };
    const [data, total] = await this.db.$transaction([
      this.db.location.findMany({ where, ...pagination(query), orderBy: { [query.sort]: 'asc' } }),
      this.db.location.count({ where }),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }
  async get(id: string) {
    const location = await this.db.location.findUnique({ where: { id } });
    if (!location) throw new AppError(404, 'LOCATION_NOT_FOUND', 'Location not found');
    return location;
  }
  async create(input: z.infer<typeof locationSchema>) { return this.db.location.create({ data: input }); }
  async update(id: string, input: z.infer<typeof locationUpdateSchema>) { await this.get(id); return this.db.location.update({ where: { id }, data: input }); }
  async remove(id: string) {
    await this.get(id);
    if (await this.db.vehicle.count({ where: { locationId: id } }) || await this.db.booking.count({ where: { OR: [{ pickupLocationId: id }, { dropoffLocationId: id }] } })) throw new AppError(409, 'LOCATION_IN_USE', 'Location has vehicles or bookings');
    await this.db.location.delete({ where: { id } });
  }
}
