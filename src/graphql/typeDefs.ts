import { mergeTypeDefs } from '@graphql-tools/merge';
import { helloTypeDefs } from './modules/hello/hello.typeDefs';

export const typeDefs = mergeTypeDefs([
    helloTypeDefs,
]);
