import { z } from 'zod'

export const messageSchema = z.object({
    content: z
        .string()
        .min(5, { message: 'Content must be at least 5 characters.' })
        .max(1000, { message: 'Content must not be longer than 1000 characters.' }),
});
