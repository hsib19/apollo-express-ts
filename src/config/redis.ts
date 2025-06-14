import Redis from 'ioredis';
import { env } from '@/config/env';

export const retryStrategy = (times: number) => Math.min(times * 50, 2000);
export const reconnectOnError = (err: Error) => err.message.includes('READONLY');

let redisClient: Redis | null = null;

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    redisClient = new Redis({
        host: env.redis.host,
        port: env.redis.port,
        password: env.redis.password,
        retryStrategy,
        reconnectOnError,
    });

    redisClient.on('connect', () => console.log('[Redis] Connected'));
    redisClient.on('error', (err) => console.error('[Redis] Error', err));
}

export { redisClient };
