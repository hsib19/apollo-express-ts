import { mergeResolvers } from '@graphql-tools/merge';
import { helloResolvers } from './modules/hello/hello.resolvers';
import { authResolvers } from './modules/auth/auth.resolvers';
import { userResolvers } from './modules/user/user.resolvers';

export const resolvers = mergeResolvers([
    helloResolvers,
    authResolvers,
    userResolvers
]);
