import {z} from 'zod';

export const registerSchema = z.object({
    name:z.string().min(3,"Name must contain atleast 3 characters!"),
    email:z.email("Invalid email format"),
    password:z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_$])[A-Za-z\d@_$]{8,}$/,"Password must be at least 8 characters, include uppercase, lowercase, number and special characters"),
})

export const loginSchema  =z.object({
    email:z.email(),
    password:z.string().min(8),
})