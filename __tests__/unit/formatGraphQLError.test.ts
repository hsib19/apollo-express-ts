import { GraphQLError } from 'graphql';
import { formatGraphQLError } from '../../src/utils/formatGraphQLError';

describe('formatGraphQLError', () => {
    it('should return code and message from extensions', () => {
        const error = new GraphQLError('Some error occurred', {
            extensions: {
                code: 'BAD_USER_INPUT',
                details: { something: 'extra' },
            },
        });

        const result = formatGraphQLError(error);

        expect(result.code).toBe('BAD_USER_INPUT');
        expect(result.message).toBe('Some error occurred');
        expect(result.details).toEqual({ something: 'extra' });
    });

    it('should return default code and message when not provided', () => {
        const error = new GraphQLError('');

        const result = formatGraphQLError(error);

        expect(result.code).toBe('INTERNAL_SERVER_ERROR');
        expect(result.message).toBe('Unexpected error occurred');
        expect(result.details).toBeUndefined();
    });
});
