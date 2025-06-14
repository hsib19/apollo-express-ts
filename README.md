# Apollo GraphQL Server with TypeScript

A scalable and modular GraphQL API built with Apollo Server v4, Express v5, TypeScript, Sequelize (MySQL), Redis, and Zod for validation.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Apollo Server](https://img.shields.io/badge/Apollo_Server-v4.x-311C87.svg)
![Express](https://img.shields.io/badge/Express-v5.x-black.svg)
![Test](https://img.shields.io/badge/tests-100%25-success)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)


## Features

- Apollo Server v4 with Express v5
- MySQL database using Sequelize ORM
- Redis caching with ioredis
- JWT authentication
- Input validation using Zod
- Modular GraphQL schema and resolvers
- Testing with Jest and Supertest
- Code linting with ESLint
- Git hooks using Husky

## Installation

```bash
git clone https://github.com/hsib19/apollo-express-ts.git
cd apollo-express-ts
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following values:

```env
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=db_name

# Application
PORT=4000

# JWT Authentication
JWT_SECRET=yout-jwt-secret
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Scripts

| Script                  | Description                                 |
|-------------------------|---------------------------------------------|
| `npm run dev`           | Start the development server with ts-node   |
| `npm run start`         | Compile and run the production server       |
| `npm run lint`          | Run ESLint to check code quality            |
| `npm run test`          | Run all tests with Jest                     |
| `npm run test:coverage` | Run tests and generate coverage report      |

## Git Hooks (Husky)

This project uses [Husky](https://typicode.github.io/husky) to automate pre-commit tasks:

- Automatically runs `npm run lint` and `npm run test` before each commit
- Prevents bad code from being committed

### Setup Husky

```bash
npx husky install
```

Example `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run test
```

## Project Structure

```
src/
├── config/              # Application configuration
├── db/                  # Database connection setup
├── graphql/
│   ├── modules/
│   │   ├── auth/        # Auth-related GraphQL resolvers & schema
│   │   ├── hello/       # Example/health check GraphQL module
│   │   └── user/        # User-related resolvers & schema
│   ├── index.ts         # Main GraphQL schema and resolver combiner
│   ├── resolvers.ts     # Entry point for all resolvers
│   └── typeDefs.ts      # Entry point for all type definitions
├── middlewares/         # Express middlewares (e.g., auth, error handling)
├── models/              # Sequelize models
├── types/               # Custom TypeScript types and interfaces
├── utils/               # Utility/helper functions
├── app.ts               # Express app configuration
└── server.ts            # Entry point to start the server

.husky/                  # Git hooks (e.g. pre-commit lint/test)
__tests__/               # Test files
.vscode/                 # VSCode workspace settings
coverage/                # Code coverage output (generated)
```

## Example GraphQL Query

```graphql
query {
  users {
    id
    email
    createdAt
  }
}
```

## Testing

Run all tests:

```bash
npm run test
```

Generate test coverage report:

```bash
npm run test:coverage
```

## Tech Stack

- Apollo Server
- Express v5
- MySQL (via Sequelize)
- Redis (ioredis)
- Zod
- TypeScript
- Jest
- Supertest
- ESLint
- Husky
