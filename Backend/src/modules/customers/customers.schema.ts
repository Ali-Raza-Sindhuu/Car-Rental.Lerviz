import { z } from 'zod';
import { paginationSchema } from '../../common/utils/pagination';

export const profileSchema = z.object({
  dateOfBirth: z.iso.date(), drivingLicenseNo: z.string().trim().min(5).max(80),
  licenseExpiry: z.iso.date(), address: z.string().trim().min(5).max(255),
  city: z.string().trim().min(2).max(100), country: z.string().trim().min(2).max(100),
});
export const customerSearchSchema = paginationSchema.extend({ search: z.string().max(100).optional(), sort: z.enum(['createdAt', 'fullName']).default('createdAt') });
export const customerStatusSchema = z.object({ isActive: z.boolean() });
export const customerIdSchema = z.object({ id: z.uuid() });
