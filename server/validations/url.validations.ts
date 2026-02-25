import { z } from 'zod';

export const urlSchema = z.object({
    originalUrl: z.string().url('invalid url format')
})