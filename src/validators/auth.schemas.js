import { z } from "zod";

const strongPassword = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
  .min(6, "Password must be at least 6 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/\d/, "Password must contain a number")
  .regex(/[@$!%*?&]/, "Password must contain a special character");

export const registerSchema = z.object({
  fullName: z
    .string({
      required_error: "Full name is required",
      invalid_type_error: "Full name must be a string",
    })
    .min(1, "Full name is required")
    .trim(),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: strongPassword,
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required"),
});
