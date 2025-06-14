import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,

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
    },

    moduleFileExtensions: ['ts', 'js', 'json', 'node'],

    // Coverage
    collectCoverage: false,
    collectCoverageFrom: ['src/**/*.{ts,js}', '!**/node_modules/**'],
};

export default config;
