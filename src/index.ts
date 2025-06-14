// server.ts

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import { json } from 'body-parser';
import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello from Apollo + Express 5!',
    },
};

async function startServer() {
    const app = express();

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    app.use(
        '/graphql',
        cors(),
        json(),
        expressMiddleware(server, {
            context: async ({ req }) => ({
                token: req.headers.authorization || null,
            }),
        })
    );

    app.listen(4000, () => {
        console.log('🚀 Server ready at http://localhost:4000/graphql');
    });
}

startServer();
