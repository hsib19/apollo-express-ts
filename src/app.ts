import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs, resolvers } from '@graphql';
import { initDb } from './models';
import { getAuthUser } from './middlewares/getAuthUser';
import { MyContext } from './types/utils.types';
import { formatGraphQLError } from './utils/formatGraphQLError';
import { redisClient } from './config/redis';

export async function createApp() {
    const app = express();

    // initialize sequelize
    await initDb();

    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'test' && redisClient) {
        try {
            await redisClient.ping();
            console.log('[Redis] Ping successful');
        } catch (err) {
            console.error('[Redis] Ping failed:', err);
            throw err;
        }
    }

    const server = new ApolloServer<MyContext>({
        typeDefs,
        resolvers,
        formatError: formatGraphQLError
    });

    await server.start();

    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const user = getAuthUser(req);
                return { user, redis: redisClient };
            },
        })
    );

    return app;
}
