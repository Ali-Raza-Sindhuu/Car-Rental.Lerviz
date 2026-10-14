import { z } from 'zod';
import { PAGINATION } from '../../config/constants';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION.defaultPage),
  limit: z.coerce.number().int().min(1).max(PAGINATION.maxLimit).default(PAGINATION.defaultLimit),
  sort: z.string().optional(),
});

export function pagination(input: { page: number; limit: number }) {
  return { skip: (input.page - 1) * input.limit, take: input.limit };
}
