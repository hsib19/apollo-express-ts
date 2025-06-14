import { GraphQLError } from 'graphql';
import type { ZodError } from 'zod';

export class GraphQLCustomError extends GraphQLError {
    constructor(message: string, code: string, statusCode: number, extra?: Record<string, unknown>) {
        super(message, {
            extensions: {
                code,
                http: { status: statusCode },
                ...extra,
            },
        });
    }
}

// Shortcut helpers (optional)

export class AuthenticationError extends GraphQLCustomError {
    constructor(message = 'Unauthenticated') {
        super(message, 'UNAUTHENTICATED', 401);
    }
}

export class ForbiddenError extends GraphQLCustomError {
    constructor(message = 'Forbidden') {
        super(message, 'FORBIDDEN', 403);
    }
}

export class ValidationError extends GraphQLCustomError {
    constructor(message = 'Validation failed', fieldErrors?: Record<string, string[]>) {
        super(message, 'BAD_USER_INPUT', 400, fieldErrors ? { fieldErrors } : undefined);
    }

    static fromZod(error: ZodError) {
        return new ValidationError('Validation failed', error.flatten().fieldErrors);
    }
}

export class NotFoundError extends GraphQLCustomError {
    constructor(message = 'Not found') {
        super(message, 'NOT_FOUND', 404);
    }
}
