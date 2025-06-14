import {
    AuthenticationError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
    GraphQLCustomError,
} from '../../src/utils/errors';
import { ZodError, z } from 'zod';

describe('GraphQLCustomError', () => {
    it('should create a custom GraphQL error with extensions', () => {
        const error = new GraphQLCustomError('Custom error', 'CUSTOM_CODE', 418, {
            something: 'extra',
        });

        expect(error.message).toBe('Custom error');
        expect(error.extensions.code).toBe('CUSTOM_CODE');
        expect((error.extensions.http as { status: number }).status).toBe(418);
        expect(error.extensions.something).toBe('extra');
    });
});

describe('AuthenticationError', () => {
    it('should have default message and 401 status', () => {
        const error = new AuthenticationError();
        expect(error.message).toBe('Unauthenticated');
        expect(error.extensions.code).toBe('UNAUTHENTICATED');
        expect((error.extensions.http as { status: number }).status).toBe(401);
    });
});

describe('ForbiddenError', () => {
    it('should have default message and 403 status', () => {
        const error = new ForbiddenError();
        expect(error.message).toBe('Forbidden');
        expect(error.extensions.code).toBe('FORBIDDEN');
        expect((error.extensions.http as { status: number }).status).toBe(403);
    });
});

describe('NotFoundError', () => {
    it('should have default message and 404 status', () => {
        const error = new NotFoundError();
        expect(error.message).toBe('Not found');
        expect(error.extensions.code).toBe('NOT_FOUND');
        expect((error.extensions.http as { status: number }).status).toBe(404);
    });
});

describe('ValidationError', () => {
    it('should contain validationErrors in extensions', () => {
        const fieldErrors = {
            email: ['Invalid email'],
            password: ['Too short'],
        };
        const error = new ValidationError('Invalid data', fieldErrors);

        expect(error.message).toBe('Invalid data');
        expect(error.extensions.code).toBe('BAD_USER_INPUT');
        expect((error.extensions.http as { status: number }).status).toBe(400);
        expect(error.extensions.validationErrors).toEqual(fieldErrors);
    });

    it('should use default message if none is provided', () => {
        const error = new ValidationError(undefined, {
            username: ['Required'],
        });

        expect(error.message).toBe('Validation failed');
        expect(error.extensions.code).toBe('BAD_USER_INPUT');
        expect((error.extensions.http as { status: number }).status).toBe(400);
        expect(error.extensions.validationErrors).toHaveProperty('username');
    });


    it('fromZod should create ValidationError from zod error', () => {
        const schema = z.object({
            email: z.string().email(),
        });

        const result = schema.safeParse({ email: 'not-an-email' });

        if (!result.success) {
            const error = ValidationError.fromZod(result.error);
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.extensions.validationErrors).toHaveProperty('email');
        }
    });
});
