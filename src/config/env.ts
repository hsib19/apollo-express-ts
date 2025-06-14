import dotenv from 'dotenv';

dotenv.config();
import { EnvConfig } from "@/types/env.types";

export const env: EnvConfig = {
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        pass: process.env.DB_PASS || '',
        name: process.env.DB_NAME || '',
        port: Number(process.env.DB_PORT || 3306),
    },
    app: {
        port: Number(process.env.PORT || 4000),
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
};
