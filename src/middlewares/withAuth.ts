import { AuthenticationError } from "@/utils";

export const withAuth = (resolver: Function) => {
    return async (parent: any, args: any, context: any, info: any) => {
        const { user } = context;

        if (!user) {
            throw new AuthenticationError("Invalid token")
        }

        return resolver(parent, args, context, info);
    };
};
