import { z } from "zod";


export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Current password is required" })
      .min(1, "Current password is required"),

    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/\d/, "Password must contain a number")
      .regex(/[@$!%*?&]/, "Password must contain a special character"),

    confirmNewPassword: z
      .string({ required_error: "Please confirm your new password" })
      .min(1, "Please confirm your new password"),
  })
  .refine(
    (data) => data.newPassword === data.confirmNewPassword,
    {
      message: "New password and confirm password do not match",
      path: ["confirmNewPassword"],
    }
  );

export const updateNameSchema = z.object({
  fullName: z.string().min(2).trim(),
});
