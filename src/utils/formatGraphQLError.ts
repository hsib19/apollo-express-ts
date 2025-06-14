import { GraphQLError } from 'graphql';

export function formatGraphQLError(err: GraphQLError) {
    const code = err.extensions?.code || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'Unexpected error occurred';

    return {
        code,
        message,
        details: err.extensions?.details,
    };
}
