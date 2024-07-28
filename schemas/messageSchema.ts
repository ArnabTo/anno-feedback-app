import {z} from 'zod'

export const messageSchema = z.object({
    content: z
    .string()
    .min(2, {message: 'Message must be at least of 2 characters'}),
})