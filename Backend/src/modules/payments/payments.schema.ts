import { z } from 'zod';
import { paginationSchema } from '../../common/utils/pagination';

export const paymentSchema = z.object({ method: z.enum(['CARD', 'CASH', 'ONLINE']) });
export const paymentListSchema = paginationSchema.extend({ status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(), from: z.iso.datetime().optional(), to: z.iso.datetime().optional(), sort: z.enum(['createdAt', 'amount']).default('createdAt') });
export const paymentBookingIdSchema = z.object({ id: z.uuid() });
