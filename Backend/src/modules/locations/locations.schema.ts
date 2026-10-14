import { z } from 'zod';
import { paginationSchema } from '../../common/utils/pagination';

export const locationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(100),
  address: z.string().trim().min(2).max(255),
  phone: z.string().trim().min(5).max(32),
  isActive: z.boolean().default(true),
});
export const locationUpdateSchema = locationSchema.partial();
export const locationListSchema = paginationSchema.extend({ city: z.string().optional(), sort: z.enum(['city', 'name', 'createdAt']).default('city') });
export const locationIdSchema = z.object({ id: z.uuid() });
