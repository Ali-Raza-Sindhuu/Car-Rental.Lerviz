import { z } from 'zod';
import { paginationSchema } from '../../common/utils/pagination';

export const bookingInputSchema = z.object({
  vehicleId: z.uuid(), pickupLocationId: z.uuid(), dropoffLocationId: z.uuid(),
  startAt: z.iso.datetime(), endAt: z.iso.datetime(), couponCode: z.string().trim().max(40).optional(),
  notes: z.string().max(1000).optional(),
});
export const bookingIdSchema = z.object({ id: z.uuid() });
export const cancelSchema = z.object({ reason: z.string().trim().min(3).max(500) });
export const rejectSchema = cancelSchema;
export const returnSchema = z.object({ mileageKm: z.number().int().nonnegative(), actualReturnAt: z.iso.datetime().optional() });
export const bookingListSchema = paginationSchema.extend({ status: z.enum(['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED']).optional(), customerId: z.uuid().optional(), vehicleId: z.uuid().optional(), from: z.iso.datetime().optional(), to: z.iso.datetime().optional(), sort: z.enum(['createdAt', 'startAt']).default('createdAt') });
