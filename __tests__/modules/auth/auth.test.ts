import request from 'supertest';
import { createApp } from '../../../src/app';
import type { Application } from 'express';

let app: Application;

beforeAll(async () => {
    app = await createApp();
});

describe("GraphQL: Auth Module - Integration Tests", () => {

    const mutation = `
    mutation($input: LoginInput!) {
      login(input: $input) {
        code,
        message,
        data {
        token,
        user {
            email,
            is_active,
            role
        }
        }
    }
    }
  `;

    it("it should failed login BAD_USER_INPUT", async () => {
        const res = await request(app)
            .post('/graphql')
            .send({
                query: mutation,
                variables: {
                    input: {
                        email: "invalid_email",
                        password: "this is passwords"
                    },
                },
            });

        expect(res.status).toBe(400);
        expect(res.body.errors[0].code).toBe("BAD_USER_INPUT");
        expect(res.body.errors[0].message).toBe("Validation failed");

    });

    it("it should failed login email or password not found", async () => {
        const res = await request(app)
            .post('/graphql')
            .send({
                query: mutation,
                variables: {
                    input: {
                        email: "example@email.com",
                        password: "this is passwords"
                    },
                },
            });

        expect(res.status).toBe(401);
        expect(res.body.errors[0].code).toBe("UNAUTHENTICATED");
        expect(res.body.errors[0].message).toBe("Invalid email or password");
        expect(res.body.data).toBe(null);

    });

    it("it should failed login wrong password", async () => {
        const res = await request(app)
            .post('/graphql')
            .send({
                query: mutation,
                variables: {
                    input: {
                        email: "hasibmuha@gmail.com",
                        password: "this is passwords"
                    },
                },
            });

        expect(res.status).toBe(401);
        expect(res.body.errors[0].code).toBe("UNAUTHENTICATED");
        expect(res.body.errors[0].message).toBe("Invalid email or password");
        expect(res.body.data).toBe(null);

    });

    it("it should login success", async () => {
        const res = await request(app)
            .post('/graphql')
            .send({
                query: mutation,
                variables: {
                    input: {
                        email: "hasibmuha@gmail.com",
                        password: "123hasib"
                    },
                },
            });

        expect(res.status).toBe(200);
        expect(res.body.data.login.code).toBe("200");
        expect(res.body.data.login.message).toBe("Success");
        expect(res.body.data.login.data).toHaveProperty("token");
        expect(res.body.data.login.data).toHaveProperty("user");

    });

});
