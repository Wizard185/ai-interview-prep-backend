import { z } from "zod";

const strongPassword = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/\d/, "Password must contain a number")
  .regex(/[@$!%*?&]/, "Password must contain a special character");

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: strongPassword,
});

export const updateFullNameSchema = z.object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .trim(),
  });