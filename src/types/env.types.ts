export interface EnvConfig {
    db: {
        host: string;
        user: string;
        pass: string;
        name: string;
        port: number;
    },
    app: {
        port: number;
    },
    auth: {
        jwtSecret: string;
        jwtExpiresIn: string;
    },
    redis: {
        host: string | '127.0.0.1';
        port: number | 6379;
        password: string | undefined;
    }
}
