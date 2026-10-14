import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../common/errors/app-error';
import { pagination } from '../../common/utils/pagination';
import { vehicleImageSchema, vehicleSchema, vehicleSearchSchema, vehicleUpdateSchema } from './vehicles.schema';

const include = { category: true, location: true, images: true } as const;
type Search = z.infer<typeof vehicleSearchSchema>;

export class VehiclesService {
  constructor(private readonly db: PrismaClient = prisma) {}

  /** Searches the public fleet, excluding bookings and maintenance that overlap the requested dates. */
  async search(query: Search, admin = false) {
    const where: Prisma.VehicleWhereInput = {
      deletedAt: null, ...(!admin && { status: 'AVAILABLE', location: { isActive: true } }),
      ...(query.category && { categoryId: query.category }), ...(query.location && { locationId: query.location }),
      ...(query.transmission && { transmission: query.transmission }), ...(query.fuel && { fuelType: query.fuel }),
      ...(query.seats && { seats: { gte: query.seats } }),
      dailyRate: { ...(query.minPrice !== undefined && { gte: query.minPrice }), ...(query.maxPrice !== undefined && { lte: query.maxPrice }) },
    };
    if (query.startDate && query.endDate) {
      const start = new Date(query.startDate), end = new Date(query.endDate);
      if (end <= start) throw new AppError(422, 'INVALID_DATES', 'End date must follow start date');
      where.bookings = { none: { status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] }, startAt: { lt: end }, endAt: { gt: start } } };
      where.maintenanceLogs = { none: { startDate: { lt: end }, OR: [{ endDate: null }, { endDate: { gt: start } }] } };
    }
    const orderBy: Prisma.VehicleOrderByWithRelationInput = query.sort.startsWith('price') ? { dailyRate: query.sort.endsWith('asc') ? 'asc' : 'desc' } : { year: query.sort.endsWith('asc') ? 'asc' : 'desc' };
    const [data, total] = await this.db.$transaction([
      this.db.vehicle.findMany({ where, include, ...pagination(query), orderBy: [orderBy, { id: 'asc' }] }),
      this.db.vehicle.count({ where }),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }

  async get(id: string, admin = false) {
    const vehicle = await this.db.vehicle.findFirst({ where: { id, deletedAt: null, ...(!admin && { status: 'AVAILABLE' }) }, include: { ...include, reviews: { select: { rating: true } } } });
    if (!vehicle) throw new AppError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found');
    const { reviews, ...details } = vehicle;
    return { ...details, averageRating: reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : null };
  }

  async availability(id: string) {
    await this.get(id);
    return this.db.booking.findMany({ where: { vehicleId: id, status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] }, endAt: { gt: new Date() } }, select: { startAt: true, endAt: true }, orderBy: { startAt: 'asc' } });
  }

  async create(input: z.infer<typeof vehicleSchema>) { return this.db.vehicle.create({ data: input, include }); }
  async update(id: string, input: z.infer<typeof vehicleUpdateSchema>) { await this.get(id, true); return this.db.vehicle.update({ where: { id }, data: input, include }); }
  async remove(id: string) {
    await this.get(id, true);
    if (await this.db.booking.count({ where: { vehicleId: id, status: { in: ['CONFIRMED', 'ACTIVE'] } } })) throw new AppError(409, 'VEHICLE_IN_USE', 'Vehicle has confirmed or active bookings');
    await this.db.vehicle.update({ where: { id }, data: { deletedAt: new Date(), status: 'RETIRED' } });
  }
  async addImage(id: string, input: z.infer<typeof vehicleImageSchema>) {
    await this.get(id, true);
    return this.db.$transaction(async tx => {
      if (input.isPrimary) await tx.vehicleImage.updateMany({ where: { vehicleId: id }, data: { isPrimary: false } });
      return tx.vehicleImage.create({ data: { vehicleId: id, ...input } });
    });
  }
}
