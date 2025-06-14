import Redis from "ioredis";

export interface JwtPayload {
    userId: number;
    email?: string;
    role?: string;
    [key: string]: string | number | boolean | undefined;
}

export type MyContext = {
    user?: {
        id: string;
        email: string;
        role: string;
    };
    redis?: Redis;
};
