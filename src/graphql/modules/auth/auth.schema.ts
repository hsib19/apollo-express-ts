import { z } from 'zod';

export const loginInputSchema = z.object({
    email: z.string().email({ message: 'Email is invalid' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
