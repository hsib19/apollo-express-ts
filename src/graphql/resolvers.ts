import { mergeResolvers } from '@graphql-tools/merge';
import { helloResolvers } from './modules/hello/hello.resolvers';

export const resolvers = mergeResolvers([
    helloResolvers,
]);
