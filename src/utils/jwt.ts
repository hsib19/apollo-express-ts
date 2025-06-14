import jwt from 'jsonwebtoken';
import { env } from '@config/env';
import { JwtPayload } from '@/types/utils.types';

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.auth.jwtSecret, {
        expiresIn: env.auth.jwtExpiresIn,
    });
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.auth.jwtSecret) as JwtPayload;
};
