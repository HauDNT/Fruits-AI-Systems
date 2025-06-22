import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO } from '@/modules/auth/dto/login.dto';
import { LoginResponse } from '@/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() data: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<LoginResponse, 'accessToken'>> {
    const result = await this.authService.login(data);

    res.cookie('fruitsflow-authentication', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 * 3, // 3h
    });

    return {
      userId: result.userId,
      username: result.username,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.clearCookie('fruitsflow-authentication');
    res.clearCookie('fruitsflow-user-info');
    return { message: 'Đăng xuất thành công' };
  }
}
