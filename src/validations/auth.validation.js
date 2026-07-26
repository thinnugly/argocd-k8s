import { email, z } from 'zod'

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters.'),
    email: z
        .string()
        .trim()
        .email('Invalid email address.'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters.')
})

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email('Invalid email address.'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters.')
    
})