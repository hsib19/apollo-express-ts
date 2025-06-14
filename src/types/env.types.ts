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
    }
}
