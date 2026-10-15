import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { revenueSchema, utilizationSchema } from './admin.schema';

const occupied = ['ACTIVE', 'COMPLETED'] as const;
const day = 86400000;

export class AdminService {
  constructor(private readonly db: PrismaClient = prisma) {}

  /** Counts current fleet activity and recognizes rental and late-fee payments net of refunds. */
  async dashboard() {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const fleetWhere = { deletedAt: null };
    const [totalVehicles, availableNow, activeRentals, pendingBookings, customers, payments, topGroups] = await Promise.all([
      this.db.vehicle.count({ where: fleetWhere }),
      this.db.vehicle.count({ where: { ...fleetWhere, status: 'AVAILABLE', bookings: { none: { status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] }, startAt: { lte: now }, endAt: { gt: now } } } } }),
      this.db.booking.count({ where: { status: 'ACTIVE' } }),
      this.db.booking.count({ where: { status: 'PENDING' } }),
      this.db.user.count({ where: { role: 'CUSTOMER', deletedAt: null } }),
      this.db.payment.findMany({ where: { paidAt: { gte: month }, OR: [{ status: 'PAID', type: { in: ['RENTAL', 'LATE_FEE'] } }, { status: 'REFUNDED', type: 'REFUND' }] }, select: { type: true, amount: true, paidAt: true } }),
      this.db.booking.groupBy({ by: ['vehicleId'], where: { status: { in: [...occupied] } }, _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 5 }),
    ]);
    const topVehicles = await this.db.vehicle.findMany({ where: { id: { in: topGroups.map(group => group.vehicleId) } }, select: { id: true, make: true, model: true, plateNo: true } });
    const totals = payments.reduce((sum, payment) => {
      const signed = payment.type === 'REFUND' ? payment.amount.neg() : payment.amount;
      sum.month = sum.month.add(signed);
      if (payment.paidAt && payment.paidAt >= today) sum.today = sum.today.add(signed);
      return sum;
    }, { today: new Prisma.Decimal(0), month: new Prisma.Decimal(0) });
    return {
      totalVehicles, availableNow, activeRentals, pendingBookings, customers,
      revenue: totals,
      topVehicles: topGroups.map(group => ({ ...topVehicles.find(vehicle => vehicle.id === group.vehicleId), rentals: group._count.id })),
      fleetUtilizationPercent: totalVehicles ? Math.round(activeRentals / totalVehicles * 10000) / 100 : 0,
    };
  }

  /** Groups settled revenue by UTC day or month, excluding refundable deposits. */
  async revenue(query: z.infer<typeof revenueSchema>) {
    const from = new Date(query.from), to = new Date(query.to);
    const grain = query.groupBy === 'month' ? 'month' : 'day';
    const rows = await this.db.$queryRaw<{ period: Date; revenue: Prisma.Decimal }[]>`
      SELECT date_trunc(${grain}, paid_at AT TIME ZONE 'UTC') AS period,
        COALESCE(SUM(CASE WHEN type = 'REFUND' THEN -amount ELSE amount END), 0) AS revenue
      FROM payments
      WHERE paid_at >= ${from} AND paid_at < ${to}
        AND ((status = 'PAID' AND type IN ('RENTAL', 'LATE_FEE')) OR (status = 'REFUNDED' AND type = 'REFUND'))
      GROUP BY 1 ORDER BY 1`;
    return rows;
  }

  /** Computes booked time inside a requested window per vehicle and category. */
  async utilization(query: z.infer<typeof utilizationSchema>) {
    const from = new Date(query.from), to = new Date(query.to);
    const vehicles = await this.db.vehicle.findMany({ where: { deletedAt: null }, select: { id: true, make: true, model: true, categoryId: true, category: { select: { name: true } } } });
    const bookings = await this.db.booking.findMany({ where: { status: { in: [...occupied] }, startAt: { lt: to }, endAt: { gt: from }, vehicle: { deletedAt: null } }, select: { vehicleId: true, startAt: true, endAt: true, actualReturnAt: true } });
    const periodMs = to.getTime() - from.getTime();
    const perVehicle = vehicles.map(vehicle => {
      const usedMs = bookings.filter(booking => booking.vehicleId === vehicle.id).reduce((sum, booking) => {
        const end = booking.actualReturnAt ?? booking.endAt;
        return sum + Math.max(0, Math.min(end.getTime(), to.getTime()) - Math.max(booking.startAt.getTime(), from.getTime()));
      }, 0);
      return { vehicleId: vehicle.id, make: vehicle.make, model: vehicle.model, categoryId: vehicle.categoryId, category: vehicle.category.name, bookedDays: Math.round(usedMs / day * 100) / 100, utilizationPercent: Math.min(100, Math.round(usedMs / periodMs * 10000) / 100) };
    });
    const byCategory = [...new Set(perVehicle.map(vehicle => vehicle.categoryId))].map(categoryId => {
      const members = perVehicle.filter(vehicle => vehicle.categoryId === categoryId);
      return { categoryId, category: members[0].category, vehicles: members.length, bookedDays: Math.round(members.reduce((sum, vehicle) => sum + vehicle.bookedDays, 0) * 100) / 100, utilizationPercent: Math.round(members.reduce((sum, vehicle) => sum + vehicle.utilizationPercent, 0) / members.length * 100) / 100 };
    });
    return { from, to, perVehicle, byCategory };
  }
}
