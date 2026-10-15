import { z } from 'zod';
import { paginationSchema } from '../../common/utils/pagination';

const fields = z.object({
  code: z.string().trim().min(3).max(40).regex(/^[A-Za-z0-9_-]+$/).transform(value => value.toUpperCase()),
  discountType: z.enum(['PERCENT', 'FIXED']),
  value: z.coerce.number().positive(),
  minDays: z.number().int().min(1).max(30).default(1),
  validFrom: z.iso.datetime(),
  validTo: z.iso.datetime(),
  maxUses: z.number().int().positive(),
  isActive: z.boolean().default(true),
});

export const couponSchema = fields.refine(input => input.validTo > input.validFrom, { message: 'validTo must follow validFrom', path: ['validTo'] })
  .refine(input => input.discountType !== 'PERCENT' || input.value <= 100, { message: 'Percent discount cannot exceed 100', path: ['value'] });
export const couponUpdateSchema = fields.partial().refine(input => Object.keys(input).length > 0, { message: 'Provide at least one field' });
export const couponIdSchema = z.object({ id: z.uuid() });
export const couponListSchema = paginationSchema.extend({
  isActive: z.enum(['true', 'false']).transform(value => value === 'true').optional(),
  sort: z.enum(['createdAt', 'code', 'validTo']).default('createdAt'),
});
