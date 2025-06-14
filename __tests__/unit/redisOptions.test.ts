import { retryStrategy, reconnectOnError } from '../../src/config/redis';

describe('Redis Config Functions', () => {
    describe('retryStrategy', () => {
        it('should return 50ms for 1 attempt', () => {
            expect(retryStrategy(1)).toBe(50);
        });

        it('should return 1000ms for 20 attempts', () => {
            expect(retryStrategy(20)).toBe(1000);
        });

        it('should not exceed 2000ms even for high attempts', () => {
            expect(retryStrategy(100)).toBe(2000);
        });
    });

    describe('reconnectOnError', () => {
        it('should return true if error contains READONLY', () => {
            const err = new Error('READONLY You can’t write');
            expect(reconnectOnError(err)).toBe(true);
        });

        it('should return false if error does not contain READONLY', () => {
            const err = new Error('Some other error');
            expect(reconnectOnError(err)).toBe(false);
        });
    });
});
