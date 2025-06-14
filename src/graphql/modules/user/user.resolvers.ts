import { Op } from 'sequelize';
import { User } from '@models';
import { GraphQLError } from 'graphql';
import { SuccessResponse } from '@utils';
import { FilterUserArgs, UsersResponse } from './user.types';
import { userFilterSchema } from './user.schema';
import { withAuth } from '@/middlewares/withAuth';

export const userResolvers = {
    Query: {
        users: withAuth ( async (
            _: unknown,
            args: FilterUserArgs
        ): Promise<SuccessResponse<UsersResponse>> => {
            try {
               
                const input = userFilterSchema.parse(args);
                const { page, limit, search, sortBy, sortOrder } = input;
                const offset = (page - 1) * limit;

                const where = search
                    ? {
                        [Op.or]: [
                            { username: { [Op.like]: `%${search}%` } },
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

                return {
                    code: "200",
                    message: "Fetch users success",
                    data: {
                        total: count,
                        page,
                        limit,
                        data: rows,
                    }
                };

            } catch (error) {
                console.error('Error fetching users:', error);
                throw new GraphQLError('Failed to fetch users.');
            }
        }),
    },

    Mutation: {
        // login, register, etc...
    },
};
