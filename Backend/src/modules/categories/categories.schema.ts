import { z } from 'zod';
import { paginationSchema } from '../../common/utils/pagination';

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(2).max(2000),
  baseDailyRate: z.coerce.number().positive(),
  depositAmount: z.coerce.number().nonnegative(),
});
export const categoryUpdateSchema = categorySchema.partial();
export const categoryListSchema = paginationSchema.extend({ sort: z.enum(['name', 'createdAt']).default('name') });
export const categoryIdSchema = z.object({ id: z.uuid() });
