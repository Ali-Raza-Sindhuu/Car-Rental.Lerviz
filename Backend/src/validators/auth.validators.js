import { z } from "zod";

const email = z.string().trim().email().max(254).transform((value) => value.toLowerCase());
const password = z.string().min(8).regex(/[A-Za-z]/, "Password must contain a letter").regex(/[0-9]/, "Password must contain a number");
const name = z.string().trim().min(2).max(120);

export const signupSchema = z.object({
  fullName: name.optional(),
  name: name.optional(),
  email,
  password,
  confirmPassword: z.string().optional(),
}).superRefine((value, context) => {
  if (!value.fullName && !value.name) {
    context.addIssue({ code: "custom", path: ["fullName"], message: "Name is required" });
  }
  if (value.confirmPassword !== undefined && value.confirmPassword !== value.password) {
    context.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords do not match" });
  }
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1),
});

export const googleLoginSchema = z.object({
  credential: z.string().min(1),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: name.optional(),
  currentPassword: z.string().optional(),
  newPassword: password.optional(),
}).superRefine((value, context) => {
  if (!value.name && !value.newPassword) {
    context.addIssue({ code: "custom", path: ["name"], message: "Provide a profile update" });
  }
  if (value.newPassword && !value.currentPassword) {
    context.addIssue({ code: "custom", path: ["currentPassword"], message: "Current password is required to change password" });
  }
});
