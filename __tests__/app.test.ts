import request from 'supertest';
import { createApp } from '../src/app';

let app;

beforeAll(async () => {
    app = await createApp();
});

describe('GraphQL /graphql endpoint', () => {
    it('returns hello world', async () => {
        const response = await request(app)
            .post('/graphql')
            .send({
                query: `
          query {
            hello
          }
        `
            });

        expect(response.status).toBe(200);
        expect(response.body.data.hello).toBe('Hello from modular GraphQL!');
    });
});
