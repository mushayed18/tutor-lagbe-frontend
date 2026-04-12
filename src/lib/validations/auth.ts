import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["TUTOR", "PARENT"], {
    message: "Role must be TUTOR or PARENT",
  }),
});

export const verifyEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;