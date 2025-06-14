import { mergeTypeDefs } from '@graphql-tools/merge';
import { helloTypeDefs } from './modules/hello/hello.typeDefs';
import { authTypeDefs } from './modules/auth/auth.typeDefs';
import { userTypeDefs } from './modules/user/user.typeDefs';

export const typeDefs = mergeTypeDefs([
    helloTypeDefs,
    authTypeDefs,
    userTypeDefs
]);
