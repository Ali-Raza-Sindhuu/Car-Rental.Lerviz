import { z } from 'zod';
import { paginationSchema } from '../../common/utils/pagination';

export const reviewSchema = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().trim().min(5).max(2000) });
export const reviewIdSchema = z.object({ id: z.uuid() });
export const reviewListSchema = paginationSchema.extend({ sort: z.enum(['createdAt', 'rating']).default('createdAt') });
