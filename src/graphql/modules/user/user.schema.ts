import { z } from 'zod';

export const userFilterSchema = z.object({
    page: z
        .number()
        .int()
        .positive()
        .optional()
        .default(1),

    limit: z
        .number()
        .int()
        .positive()
        .max(100)
        .optional()
        .default(10),

    search: z.string().max(100).optional(),

    sortBy: z
        .enum(['id', 'username', 'email', 'created_at', 'updated_at'])
        .optional()
        .default('created_at'),

    sortOrder: z
        .enum(['asc', 'desc'])
        .optional()
        .default('desc'),
});

export type UserFilterInput = z.infer<typeof userFilterSchema>;
