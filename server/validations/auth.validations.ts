import {z} from 'zod';

export const registerSchema = z.object({
    name:z.string().min(3,"Name must contain atleast 3 characters!"),
    email:z.email("Invalid email format"),
    password:z.string().min(8,"Create a password of minimum 8 characters!"),
})

export const loginSchema  =z.object({
    email:z.email(),
    password:z.string().min(8),
})