import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string | undefined,
    @Req() req: Request,
  ) {
    const user = await this.auth.register(email, password, name);
    (req as any).session.userId = user.id;
    return user;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
  ) {
    const user = await this.auth.login(email, password);
    (req as any).session.userId = user.id;
    return user;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await new Promise<void>((resolve) => (req as any).session.destroy(() => resolve()));
    res.clearCookie('sid');
    return res.json({ ok: true });
  }

  @Get('me')
  async me(@Req() req: Request) {
    const userId = ((req as any).session as any)?.userId as string | undefined;
    if (!userId) return { user: null };
    return { userId };
  }
}
