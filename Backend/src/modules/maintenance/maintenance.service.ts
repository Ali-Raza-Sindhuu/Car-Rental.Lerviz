import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../common/errors/app-error';
import { pagination } from '../../common/utils/pagination';
import { maintenanceListSchema, maintenanceSchema, maintenanceUpdateSchema } from './maintenance.schema';

type Db = Prisma.TransactionClient;

export class MaintenanceService {
  constructor(private readonly db: PrismaClient = prisma) {}
  private async checkBookings(tx: Db, vehicleId: string, start: Date, end: Date | null) {
    const count = await tx.booking.count({ where: { vehicleId, status: { in: ['CONFIRMED', 'ACTIVE'] }, endAt: { gt: start }, startAt: { lt: end ?? new Date('9999-12-31') } } });
    if (count) throw new AppError(409, 'MAINTENANCE_BOOKING_CONFLICT', 'Confirmed bookings overlap this maintenance window');
  }
  private async syncStatus(tx: Db, vehicleId: string) {
    const open = await tx.maintenanceLog.count({ where: { vehicleId, status: 'OPEN' } });
    const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
    if (vehicle && vehicle.status !== 'RETIRED') await tx.vehicle.update({ where: { id: vehicleId }, data: { status: open ? 'MAINTENANCE' : 'AVAILABLE' } });
  }
  async list(query: z.infer<typeof maintenanceListSchema>) {
    const where = { ...(query.vehicleId && { vehicleId: query.vehicleId }), ...(query.status && { status: query.status }) };
    const [data, total] = await this.db.$transaction([
      this.db.maintenanceLog.findMany({ where, ...pagination(query), orderBy: { [query.sort]: 'desc' }, include: { vehicle: { select: { make: true, model: true, plateNo: true } } } }),
      this.db.maintenanceLog.count({ where }),
    ]);
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }
  async get(id: string) {
    const log = await this.db.maintenanceLog.findUnique({ where: { id }, include: { vehicle: true } });
    if (!log) throw new AppError(404, 'MAINTENANCE_NOT_FOUND', 'Maintenance log not found');
    return log;
  }
  /** Records an open service window and moves the vehicle out of the bookable fleet. */
  async create(input: z.infer<typeof maintenanceSchema>) {
    return this.db.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM vehicles WHERE id = ${input.vehicleId}::uuid FOR UPDATE`;
      const vehicle = await tx.vehicle.findFirst({ where: { id: input.vehicleId, deletedAt: null } });
      if (!vehicle || vehicle.status === 'RETIRED') throw new AppError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found');
      const start = new Date(input.startDate), end = input.endDate ? new Date(input.endDate) : null;
      if (input.status === 'OPEN') await this.checkBookings(tx, input.vehicleId, start, end);
      const log = await tx.maintenanceLog.create({ data: { ...input, startDate: start, endDate: end } });
      await this.syncStatus(tx, input.vehicleId);
      return log;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
  async update(id: string, input: z.infer<typeof maintenanceUpdateSchema>) {
    return this.db.$transaction(async tx => {
      const current = await tx.maintenanceLog.findUnique({ where: { id } });
      if (!current) throw new AppError(404, 'MAINTENANCE_NOT_FOUND', 'Maintenance log not found');
      await tx.$queryRaw`SELECT id FROM vehicles WHERE id = ${current.vehicleId}::uuid FOR UPDATE`;
      const end = input.endDate === undefined ? (input.status === 'CLOSED' && !current.endDate ? new Date() : current.endDate) : input.endDate ? new Date(input.endDate) : null;
      if (end && end <= current.startDate) throw new AppError(422, 'INVALID_DATES', 'End must follow start');
      if ((input.status ?? current.status) === 'OPEN') await this.checkBookings(tx, current.vehicleId, current.startDate, end);
      const log = await tx.maintenanceLog.update({ where: { id }, data: { ...input, ...(input.endDate !== undefined || input.status === 'CLOSED' ? { endDate: end } : {}) } });
      await this.syncStatus(tx, current.vehicleId);
      return log;
    });
  }
  async remove(id: string) {
    return this.db.$transaction(async tx => {
      const current = await tx.maintenanceLog.findUnique({ where: { id } });
      if (!current) throw new AppError(404, 'MAINTENANCE_NOT_FOUND', 'Maintenance log not found');
      await tx.maintenanceLog.delete({ where: { id } });
      await this.syncStatus(tx, current.vehicleId);
    });
  }
}
