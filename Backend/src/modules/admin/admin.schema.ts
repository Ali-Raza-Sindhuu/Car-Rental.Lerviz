import { z } from 'zod';

const range = z.object({ from: z.iso.datetime(), to: z.iso.datetime() })
  .refine(input => new Date(input.to).getTime() > new Date(input.from).getTime(), { path: ['to'], message: 'to must follow from' })
  .refine(input => new Date(input.to).getTime() - new Date(input.from).getTime() <= 366 * 86400000, { path: ['to'], message: 'Report range cannot exceed 366 days' });

export const revenueSchema = range.safeExtend({ groupBy: z.enum(['day', 'month']).default('day') });
export const utilizationSchema = range;
