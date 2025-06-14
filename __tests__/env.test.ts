jest.mock('dotenv', () => ({
    config: jest.fn(),
}));

describe('env config', () => {
    const ORIGINAL_ENV = process.env;

    beforeEach(() => {
        jest.resetModules(); // Clear cache
        process.env = { ...ORIGINAL_ENV }; // Reset env to original state
    });

    afterEach(() => {
        process.env = ORIGINAL_ENV; // Restore after test
    });

    it('should use default values when env variables are not set', () => {
        delete process.env.DB_HOST;
        delete process.env.DB_USER;
        delete process.env.DB_PASS;
        delete process.env.DB_NAME;
        delete process.env.DB_PORT;
        delete process.env.PORT;
        delete process.env.JWT_SECRET;
        delete process.env.JWT_EXPIRES_IN;

        const { env } = require('../src/config/env');

        expect(env.db.host).toBe('localhost');
        expect(env.db.user).toBe('root');
        expect(env.db.pass).toBe('');
        expect(env.db.name).toBe('');
        expect(env.db.port).toBe(3306);
        expect(env.app.port).toBe(4000);
        expect(env.auth.jwtSecret).toBe('your-default-jwt-secret');
        expect(env.auth.jwtExpiresIn).toBe('1d');
    });

    it('should use provided env variables', () => {
        process.env.DB_HOST = 'custom-host';
        process.env.DB_USER = 'custom-user';
        process.env.DB_PASS = 'custom-pass';
        process.env.DB_NAME = 'custom-name';
        process.env.DB_PORT = '9999';
        process.env.PORT = '1234';
        process.env.JWT_SECRET = 'super-secret';
        process.env.JWT_EXPIRES_IN = '7d';

        const { env } = require('../src/config/env');

        expect(env.db.host).toBe('custom-host');
        expect(env.db.user).toBe('custom-user');
        expect(env.db.pass).toBe('custom-pass');
        expect(env.db.name).toBe('custom-name');
        expect(env.db.port).toBe(9999);
        expect(env.app.port).toBe(1234);
        expect(env.auth.jwtSecret).toBe('super-secret');
        expect(env.auth.jwtExpiresIn).toBe('7d');
    });
});
