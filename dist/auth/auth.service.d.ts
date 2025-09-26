import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    register(email: string, password: string, name?: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
    }>;
    login(email: string, password: string): Promise<{
        id: string;
        email: string;
        name: string | null;
    }>;
}
