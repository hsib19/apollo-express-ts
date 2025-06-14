import { Op } from 'sequelize';
import { User } from '@models';
import { GraphQLError } from 'graphql';
import { SuccessResponse } from '@utils';
import { FilterUserArgs, UsersResponse } from './user.types';
import { userFilterSchema } from './user.schema';
import { withAuth } from '@/middlewares/withAuth';
import { MyContext } from '@/types/utils.types';

export const userResolvers = {
    Query: {
        users: withAuth ( async (
            _: unknown,
            args: FilterUserArgs,
            context: MyContext
        ): Promise<SuccessResponse<UsersResponse>> => {
            try {
               
                const input = userFilterSchema.parse(args.input);
                const { page, limit, search, sortBy, sortOrder } = input;
                const offset = (page - 1) * limit;

                const cacheKey = `users:${search || 'all'}:${page}:${limit}`;
                const cached = await context.redis.get(cacheKey);

                if (cached) {
                    
                    const parsed = JSON.parse(cached);
                    return {
                        code: "200",
                        message: "Fetch users success (from cache)",
                        data: parsed
                    };
                }

                const where = search
                    ? {
                        [Op.or]: [
                            { email: { [Op.like]: `%${search}%` } },
                        ],
                    }
                    : {};

                const { rows, count } = await User.findAndCountAll({
                    where,
                    offset,
                    limit,
                    order: [[sortBy, sortOrder]],
                    attributes: ["id", 'email', 'is_active', 'role'],
                });

                const result: UsersResponse = {
                    total: count,
                    page,
                    limit,
                    data: rows,
                };

                await context.redis.set(cacheKey, JSON.stringify(result), 'EX', 60); // cache 60 detik

                return {
                    code: "200",
                    message: "Fetch users success",
                    data: result
                };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                throw new GraphQLError('Failed to fetch users.');
            }
        }),
    },

    Mutation: {
        // login, register, etc...
    },
};
