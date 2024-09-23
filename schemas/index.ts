import * as z from "zod";
import { UserRole } from "@prisma/client"; 

// Helper function to sanitize strings
const sanitizeString = (str: string) => str.replace(/['";]/g, '');

export const SettingsSchema = z.object({
  name: z.optional(z.string().transform(sanitizeString)),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email().transform(sanitizeString)),
  password: z.optional(z.string().min(6).transform(sanitizeString)),
  newPassword: z.optional(z.string().min(6).transform(sanitizeString)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  })

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }).transform(sanitizeString),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }).transform(sanitizeString),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }).transform(sanitizeString),
  password: z.string().min(1, {
    message: "Password is required",
  }).transform(sanitizeString),
  code: z.optional(z.string().transform(sanitizeString)),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }).transform(sanitizeString),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }).transform(sanitizeString),
  name: z.string().min(1, {
    message: "Name is required",
  }).transform(sanitizeString),
}); 

