import { User } from '@models';
import { AuthenticationError, generateToken, ValidationError, verifyPassword, SuccessResponse } from '@utils';
import { loginInputSchema } from './auth.schema';
import { CreateUserArgs, LoginResponse } from './auth.types';

export const authResolvers = {
    Query: {
        
    },

    Mutation: {
        async login(_: unknown, args: CreateUserArgs): Promise<SuccessResponse<LoginResponse>> {

            const parsed = loginInputSchema.safeParse(args.input);
            if (!parsed.success) {
                throw ValidationError.fromZod(parsed.error);
            }

            const { email, password } = parsed.data;

            const user = await User.findOne({ where: { email } });
            if (!user) throw new AuthenticationError('Invalid email or password');

            const valid = await verifyPassword(password, user.password_hash);
            if (!valid) throw new AuthenticationError('Invalid email or password');

            const token = generateToken({ userId: user.id });

            return { 
                data: {
                    token,
                    user
                },
                code: "200",
                message: "Success"
             };
        },
    },
};
