import { z } from 'zod';
import { paginationSchema } from '../../common/utils/pagination';

export const vehicleSchema = z.object({
  categoryId: z.uuid(), locationId: z.uuid(), make: z.string().trim().min(2).max(80),
  model: z.string().trim().min(1).max(80), year: z.number().int().min(1950).max(2100),
  plateNo: z.string().trim().min(2).max(32), vin: z.string().length(17),
  transmission: z.enum(['AUTOMATIC', 'MANUAL']), fuelType: z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC']),
  seats: z.number().int().min(1).max(20), doors: z.number().int().min(2).max(8),
  color: z.string().trim().min(2).max(50), mileageKm: z.number().int().nonnegative(),
  dailyRate: z.coerce.number().positive(), status: z.enum(['AVAILABLE', 'MAINTENANCE', 'RETIRED']).default('AVAILABLE'),
});
export const vehicleUpdateSchema = vehicleSchema.partial();
export const vehicleImageSchema = z.object({ url: z.url().max(512), isPrimary: z.boolean().default(false) });
export const vehicleIdSchema = z.object({ id: z.uuid() });
export const vehicleSearchSchema = paginationSchema.extend({
  category: z.uuid().optional(), location: z.uuid().optional(), transmission: z.enum(['AUTOMATIC', 'MANUAL']).optional(),
  fuel: z.enum(['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC']).optional(), seats: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().nonnegative().optional(), maxPrice: z.coerce.number().nonnegative().optional(),
  startDate: z.iso.datetime().optional(), endDate: z.iso.datetime().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'year_asc', 'year_desc']).default('price_asc'),
}).refine(input => Boolean(input.startDate) === Boolean(input.endDate), { message: 'startDate and endDate must be provided together' });
