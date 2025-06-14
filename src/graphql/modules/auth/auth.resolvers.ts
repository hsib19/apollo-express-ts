import { User } from '@models';
import {
    AuthenticationError,
    generateToken,
    ValidationError,
    verifyPassword,
    SuccessResponse
} from '@utils';
import { loginInputSchema } from './auth.schema';
import { LoginArgs, LoginResponse } from './auth.types';
import { MyContext } from '@/types/utils.types';

// Maximum allowed failed login attempts
const MAX_FAILED_ATTEMPTS = 5;

// Block duration in seconds (10 minutes)
const BLOCK_DURATION = 60 * 10;

export const authResolvers = {
    Query: {},

    Mutation: {
        async login(
            _: unknown,
            args: LoginArgs,
            context: MyContext
        ): Promise<SuccessResponse<LoginResponse>> {
            // Validate input using Zod schema
            const parsed = loginInputSchema.safeParse(args.input);
            if (!parsed.success) {
                throw ValidationError.fromZod(parsed.error);
            }

            const { email, password } = parsed.data;
            const redisKey = `login_fail:${email}`; // Redis key for tracking failed logins per email

            // Check if the user has exceeded the allowed number of failed attempts
            const failedAttempts = await context.redis.get(redisKey);
            if (failedAttempts && Number(failedAttempts) >= MAX_FAILED_ATTEMPTS) {
                throw new AuthenticationError(
                    `Too many failed attempts. Please try again later.`
                );
            }

            // Find the user by email
            const user = await User.findOne({ where: { email } });

            // Add a small artificial delay to deter brute-force attacks
            await new Promise((r) => setTimeout(r, 200));

            // If user not found or password does not match
            if (!user || !(await verifyPassword(password, user.password_hash))) {
                // Increment the failed login counter in Redis
                await context.redis.incr(redisKey);

                // Set expiration on the key if it's not already set
                const ttl = await context.redis.ttl(redisKey);
                if (ttl === -1) {
                    await context.redis.expire(redisKey, BLOCK_DURATION);
                }

                // Throw an error indicating login failure
                throw new AuthenticationError('Invalid email or password');
            }

            // If login is successful, remove the failed attempts key from Redis
            await context.redis.del(redisKey);

            // Generate a JWT token for the authenticated user
            const token = generateToken({ userId: user.id });

            // Return a success response with token and user data
            return {
                data: {
                    token,
                    user
                },
                code: '200',
                message: 'Success'
            };
        }
    }
};
