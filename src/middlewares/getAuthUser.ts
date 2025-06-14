import { Request } from 'express';
import { verifyToken } from '@/utils';

export const getAuthUser = (req: Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    try {
        return verifyToken(token)
    } catch {
        return null;
    }
};
