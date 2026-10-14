import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(10).max(128),
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().max(32).optional(),
});
export const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });
export const refreshSchema = z.object({ refreshToken: z.string().min(32) });
export const changePasswordSchema = z.object({ currentPassword: z.string(), newPassword: z.string().min(10).max(128) });
