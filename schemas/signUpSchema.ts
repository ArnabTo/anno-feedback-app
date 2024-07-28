import { z } from 'zod';

export const userNameValidation = z.string()
    .min(2, 'Username must be atleast 2 character')
    .max(20, 'Username must be no more than 20')
    .regex(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/, "Username must not contain special character")

export const signUpSchema = z.object({
    username: userNameValidation,
    email: z.string().email({ message: 'Invalid email address!' }),
    password: z.string().min(6, { message: 'Password must have to be at least 6 character' })
})