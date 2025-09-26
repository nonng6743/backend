import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(email: string, password: string, name: string | undefined, req: Request): Promise<{
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
    }>;
    login(email: string, password: string, req: Request): Promise<{
        id: string;
        email: string;
        name: string | null;
    }>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    me(req: Request): Promise<{
        user: null;
        userId?: undefined;
    } | {
        userId: string;
        user?: undefined;
    }>;
}
