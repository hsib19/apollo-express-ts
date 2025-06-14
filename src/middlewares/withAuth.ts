import { GraphQLResolveInfo } from 'graphql';
import { AuthenticationError } from '@/utils';
import { MyContext } from '@/types/utils.types';

export const withAuth = <
    Parent = unknown,
    Args = Record<string, unknown>,
    Result = unknown
>(
    resolver: (
        parent: Parent,
        args: Args,
        context: MyContext,
        info: GraphQLResolveInfo
    ) => Promise<Result> | Result
) => {
    return async (
        parent: Parent,
        args: Args,
        context: MyContext,
        info: GraphQLResolveInfo
    ): Promise<Result> => {
        if (!context.user) {
            throw new AuthenticationError('Invalid token');
        }

        return resolver(parent, args, context, info);
    };
};
