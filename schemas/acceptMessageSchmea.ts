import {z} from 'zod'

export const MessageAcceptSchema = z.object({
    acceptMessages: z.boolean(),
})