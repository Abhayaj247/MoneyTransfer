import { z } from "zod"

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must be at most 20 characters long" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string(),
    firstName: z.string().min(5, { message: "First name is required" }).max(50, { message: "First name is too long" }),
    lastName: z.string().min(5, { message: "Last name is required" }).max(50, { message: "Last name is too long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export const signinSchema = z.object({
  username: z.string().trim().nonempty({ message: "Username is required" }),
  password: z.string().nonempty({ message: "Password is required" }),
})

export const updateUserSchema = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})
