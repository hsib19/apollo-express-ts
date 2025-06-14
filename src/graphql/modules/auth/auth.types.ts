import { User } from "../user/user.types";

export type CreateUserArgs = {
    input: {
        name: string;
        email: string;
    };
};

export interface LoginResponse {
    token: string;
    user: User;
}
