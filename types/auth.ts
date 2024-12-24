import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email is not valid"),
    password: z.string().min(1, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Email is not valid"),
    password: z.string().min(1, "Password must be at least 6 characters"),
})

export type RegisterSchema = z.output<typeof registerSchema>
export type LoginSchema = z.output<typeof loginSchema>