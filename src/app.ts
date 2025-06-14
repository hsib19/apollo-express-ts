import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs, resolvers } from '@graphql';
import { initDb } from './models';
import { getAuthUser } from './middlewares/getAuthUser';

export async function createApp() {
    const app = express();

    // initialize sequelize
    await initDb();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (err) => {
            // Log error stack
            console.error(err);

            const code = err.extensions?.code || 'INTERNAL_SERVER_ERROR';
            const message = err.message || 'Unexpected error occurred';

            return {
                code,
                message,
                details: err.extensions?.details,
            };
        },
    });

    await server.start();

    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const user = getAuthUser(req);
                return { user };
            },
        })
    );

    return app;
}
