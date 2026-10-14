import { z } from 'zod';
import { paginationSchema } from '../../common/utils/pagination';

export const maintenanceSchema = z.object({
  vehicleId: z.uuid(), type: z.enum(['SERVICE', 'REPAIR', 'INSPECTION']),
  description: z.string().trim().min(5).max(2000), cost: z.coerce.number().nonnegative(),
  startDate: z.iso.datetime(), endDate: z.iso.datetime().nullable().optional(),
  status: z.enum(['OPEN', 'CLOSED']).default('OPEN'),
}).refine(input => (!input.endDate || input.endDate > input.startDate) && (input.status !== 'CLOSED' || Boolean(input.endDate)), { message: 'Closed maintenance needs an end date after start' });
export const maintenanceUpdateSchema = z.object({
  type: z.enum(['SERVICE', 'REPAIR', 'INSPECTION']).optional(), description: z.string().trim().min(5).max(2000).optional(),
  cost: z.coerce.number().nonnegative().optional(), endDate: z.iso.datetime().nullable().optional(),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
});
export const maintenanceListSchema = paginationSchema.extend({ vehicleId: z.uuid().optional(), status: z.enum(['OPEN', 'CLOSED']).optional(), sort: z.enum(['createdAt', 'startDate']).default('createdAt') });
export const maintenanceIdSchema = z.object({ id: z.uuid() });
