import request from 'supertest';
import { createApp } from '../../../src/app';
import type { Application } from 'express';
import { authResolvers } from '../../../src/graphql/modules/auth/auth.resolvers'
import { AuthenticationError } from '../../../src/utils';
import { LoginArgs } from '../../../src/graphql/modules/auth/auth.types';
import { MyContext } from '../../../src/types/utils.types';
import { redisClient } from '../../../src/config/redis';

let app: Application;

beforeAll(async () => {
    app = await createApp();
});

jest.mock('../../../src/config/redis', () => {
    return {
        redisClient: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            incr: jest.fn(),
            expire: jest.fn(),
            ttl: jest.fn().mockResolvedValue(120),
        },
    };
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
                        email: "example123@email.com",
                        password: "this is passwords"
                    },
                },
            });

        // console.log("Log here: ", res.body)

        expect(res.status).toBe(401);
        expect(res.body.errors[0].code).toBe("UNAUTHENTICATED");
        expect(res.body.errors[0].message).toBe("Invalid email or password");
        expect(res.body.data).toBe(null);

    });

    it("it should failed login wrong password", async () => {

        (redisClient!.get as jest.Mock).mockResolvedValue(null);

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

describe('login rate limit', () => {
    it('should throw AuthenticationError if too many failed attempts', async () => {
        // Mock context with redis.get returning "5" (max failed attempts)
        const mockContext = {
            redis: {
                get: jest.fn().mockResolvedValue('5'),
                ttl: jest.fn().mockResolvedValue(120),
            },
        } as unknown as MyContext;

        const args: LoginArgs = {
            input: {
                email: 'test@example.com',
                password: 'wrongpassword',
            },
        };

        await expect(
            authResolvers.Mutation.login(null, args, mockContext)
        ).rejects.toThrow(AuthenticationError);

        expect(mockContext.redis!.get).toHaveBeenCalledWith('login_fail:test@example.com');
    });

    it('should set expiration if key has no TTL (-1)', async () => {
        const redisKey = 'login_fail:test@example.com';

        const mockContext = {
            redis: {
                get: jest.fn().mockResolvedValue('1'),
                ttl: jest.fn().mockResolvedValue(-1),  
                expire: jest.fn().mockResolvedValue(true),
                incr: jest.fn(),
            },
        } as unknown as MyContext;

        const args: LoginArgs = {
            input: {
                email: 'test@example.com',
                password: 'wrongpassword',
            },
        };

        await expect(
            authResolvers.Mutation.login(null, args, mockContext)
        ).rejects.toThrow(AuthenticationError);

        expect(mockContext.redis!.ttl).toHaveBeenCalledWith(redisKey);
        expect(mockContext.redis!.expire).toHaveBeenCalledWith(redisKey, expect.any(Number));
    });

});
