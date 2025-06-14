import request from 'supertest';
import { createApp } from '../../../src/app';
import type { Application } from 'express';
import { FilterUserArgs } from '../../../src/graphql/modules/user/user.types';

jest.mock('../../../src/config/redis', () => {
  return {
    redisClient: {
      get: jest.fn(),
      set: jest.fn(),
      ping: jest.fn().mockResolvedValue('PONG'),
      flushall: jest.fn(),
    },
  };
});

import { redisClient } from '../../../src/config/redis';
import { User } from '../../../src/models/user.model';

let app: Application;

const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0OTkyMzA4OCwiZXhwIjoxNzUwMDA5NDg4fQ.1-BiVM0PjHc57c1T0Xiho7VeMX-lVO7NHbVCUOwPj_I";
const invalidToken = "expired-token";

beforeAll(async () => {
  app = await createApp();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GraphQL: User Module - Integration Tests', () => {
  const query = `
    query($input: FilterInput!) {
      users(input: $input) {
        code
        message
        data {
          limit
          page
          total
          data {
            id
            email
            role
          }
        }
      }
    }
  `;

  it('should return 401 when unauthorized', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({
        query,
        variables: {
          input: {
            page: 1,
            limit: 10,
            search: 'admin',
            sortBy: 'email',
            sortOrder: 'asc',
          },
        },
      });

    expect(res.status).toBe(401);
    expect(res.body.errors?.[0]?.code).toBe('UNAUTHENTICATED');
    expect(res.body.errors?.[0]?.message).toBe('Invalid token');
  });

  it('should return paginated users successfully', async () => {
    (redisClient!.get as jest.Mock).mockResolvedValue(null); // Simulasi cache kosong

    const variables: FilterUserArgs = {
      input: {
        page: 1,
        limit: 10,
        search: '',
        sortBy: 'email',
        sortOrder: 'asc',
      },
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        query,
        variables,
      });

    // console.log("Here console:", JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(200);
    expect(res.body.data?.users?.code).toBe('200');
    expect(Array.isArray(res.body.data.users.data.data)).toBe(true);
    expect(typeof res.body.data.users.data.total).toBe('number');
  });

  it('should return BAD_USER_INPUT when input is invalid', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        query,
        variables: {
          input: {
            page: 'not_a_number', // error by design
            limit: 10,
            search: '',
            sortBy: 'email',
            sortOrder: 'asc',
          },
        },
      });

    expect(res.status).toBe(200); // Masih 200 karena error format GraphQL
    expect(res.body.errors?.[0]?.message).toContain('Int cannot represent non-integer value');
  });

  it('should filter users by search keyword (email)', async () => {
    (redisClient!.get as jest.Mock).mockResolvedValue(null); // Force ambil dari DB

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        query,
        variables: {
          input: {
            page: 1,
            limit: 10,
            search: 'user',
            sortBy: 'email',
            sortOrder: 'asc',
          },
        },
      });

    expect(res.status).toBe(200);
    const users = res.body.data.users.data.data;
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);

    for (const user of users) {
      expect(user.email.toLowerCase()).toContain('user');
    }
  });

  it('should return GraphQLError when DB fails', async () => {
    // Mock error dari database
    jest.spyOn(User, 'findAndCountAll').mockRejectedValue(new Error('Simulated DB error'));

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        query: `
        query($input: FilterInput!) {
          users(input: $input) {
            code
            message
            data {
              data {
                id
              }
            }
          }
        }
      `,
        variables: {
          input: {
            page: 1,
            limit: 10,
            search: '',
            sortBy: 'email',
            sortOrder: 'asc',
          },
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toBe('Failed to fetch users.');
  });


});

describe('GraphQL: User Module - Cache Handling', () => {
  const query = `
    query($input: FilterInput!) {
      users(input: $input) {
        code
        message
        data {
          limit
          page
          total
          data {
            id
            email
            role
          }
        }
      }
    }
  `;

  it('should return cached data if exists in redis', async () => {
    const cachedData = {
      total: 1,
      page: 1,
      limit: 10,
      data: [
        { id: "1", email: 'user@example.com', role: 'user' }
      ]
    };

    (redisClient!.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedData));

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        query,
        variables: {
          input: {
            page: 1,
            limit: 10,
            search: '',
            sortBy: 'email',
            sortOrder: 'asc',
          },
        },
      });

    // console.log("Cached response:", JSON.stringify(res.body, null, 2));

    expect(redisClient!.get).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.data.users.code).toBe('200');
    expect(res.body.data.users.message).toContain('from cache');
    expect(res.body.data.users.data).toEqual(cachedData);
  });
});
