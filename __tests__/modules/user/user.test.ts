import request from 'supertest';
import { createApp } from '../../../src/app';
import { User } from '../../../src/models';
import type { Application } from 'express';
import { ForbiddenError, GraphQLCustomError, NotFoundError } from '../../../src/utils';

let app: Application;

const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0OTkyMzA4OCwiZXhwIjoxNzUwMDA5NDg4fQ.1-BiVM0PjHc57c1T0Xiho7VeMX-lVO7NHbVCUOwPj_I";
const invalidToken = "expired-token";

beforeAll(async () => {
  app = await createApp();
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

    expect(res.status).toBe(200);
    expect(res.body.data.users.code).toBe('200');
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
            page: 'not_a_number', // ⛔️ intentionally wrong
            limit: 10,
            search: '',
            sortBy: 'email',
            sortOrder: 'asc',
          },
        },
      });

    expect(res.status).toBe(200); // GraphQL parse error: should fail here
    expect(res.body.errors?.[0]?.message).toContain('Int cannot represent non-integer value');
  });

  it('should filter users by search keyword (email)', async () => {
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
});

describe('GraphQL: User Module - Error Handling', () => {
  const query = `
    query($input: FilterInput!) {
      users(input: $input) {
        code
        message
        data {
          page
          total
          data {
            id
            email
          }
        }
      }
    }
  `;

  it('should return GraphQLError when DB fails', async () => {
    const originalFn = User.findAndCountAll;
    User.findAndCountAll = jest.fn().mockRejectedValue(new Error('DB failure'));

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

    expect(res.status).toBe(200);
    expect(res.body.errors?.[0]?.message).toBe('Failed to fetch users.');
    expect(res.body.errors?.[0]?.code).toBe('INTERNAL_SERVER_ERROR');

    User.findAndCountAll = originalFn;
  });



});
