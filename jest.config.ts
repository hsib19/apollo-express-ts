import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
    // Match all test file
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],

    // Transform file TypeScript
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },

    // Alias import support
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@graphql$': '<rootDir>/src/graphql/index.ts',
        '^@db(.*)$': '<rootDir>/src/db/$1',
        '^@config(.*)$': '<rootDir>/src/config/$1',
        '^@models$': '<rootDir>/src/models/index.ts',
        '^@utils$': '<rootDir>/src/utils/index.ts',
    },

    moduleFileExtensions: ['ts', 'js', 'json', 'node'],

    // Coverage
    collectCoverage: false,
    collectCoverageFrom: ['src/**/*.{ts,js}', '!**/node_modules/**'],
    coverageReporters: ['text', 'lcov'],
    // coverageThreshold: {
    //     global: {
    //         branches: 50,
    //         functions: 50,
    //         lines: 50,
    //         statements: 50,
    //     },
    // },
};

export default config;
