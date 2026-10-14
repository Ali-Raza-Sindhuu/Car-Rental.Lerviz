import { Prisma, VehicleStatus } from '@prisma/client';
import { AppError } from '../../common/errors/app-error';

type Db = Prisma.TransactionClient;

/** Checks overlapping reservations and service windows using half-open date ranges. */
export async function assertAvailable(db: Db, vehicleId: string, start: Date, end: Date) {
  const vehicle = await db.vehicle.findFirst({ where: { id: vehicleId, deletedAt: null }, select: { status: true } });
  if (!vehicle || vehicle.status !== VehicleStatus.AVAILABLE) throw new AppError(409, 'VEHICLE_UNAVAILABLE', 'Vehicle is not available');
  const overlap = await db.booking.findFirst({ where: { vehicleId, status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] }, startAt: { lt: end }, endAt: { gt: start } }, select: { id: true } });
  if (overlap) throw new AppError(409, 'BOOKING_OVERLAP', 'Vehicle is not available for the selected dates');
  const maintenance = await db.maintenanceLog.findFirst({ where: { vehicleId, startDate: { lt: end }, OR: [{ endDate: null }, { endDate: { gt: start } }] }, select: { id: true } });
  if (maintenance) throw new AppError(409, 'MAINTENANCE_OVERLAP', 'Vehicle is in maintenance for the selected dates');
}
