import { User } from "../user/user.types";

export type LoginArgs = {
    input: {
        email: string;
        password: string;
    };
};

export interface LoginResponse {
    token: string;
    user: User;
}
