export interface JwtPayload {
    userId: number;
    [key: string]: any;
}

export type MyContext = {
    userId: string;
};
