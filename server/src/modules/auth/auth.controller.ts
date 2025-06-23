import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO } from '@/modules/auth/dto/login.dto';
// import { LoginResponse } from '@/interfaces';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWTGuard } from '@/authentication/jwt/jwt-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() data: LoginDTO, @Res({ passthrough: true }) res: Response) {
    const { userId, username, accessToken, refreshToken } = await this.authService.login(data);

    res.cookie('fruitsflow-refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 * 24 * 7, // 7 days
    });

    res.cookie('fruitsflow-authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 * 24 * 1, // 1 days
    });

    return {
      userId,
      username,
      accessToken,
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.cookies['fruitsflow-refresh'];
      const userInfo = req.cookies['fruitsflow-user-info'];

      if (!refreshToken || !userInfo) {
        return res
          .status(400)
          .json({ message: 'Thông tin tài khoản hoặc refresh token không hợp lệ!' });
      }

      const { userId } = JSON.parse(userInfo);

      const deleteRfTokenResult = await this.authService.deleteRefreshToken(refreshToken, userId);

      if (deleteRfTokenResult) {
        res.clearCookie('fruitsflow-refresh');
        res.clearCookie('fruitsflow-authentication');
        res.clearCookie('fruitsflow-user-info');

        return res.status(200).json({ message: 'Đăng xuất thành công' });
      }

      throw new UnauthorizedException('Không xoá được refresh token');
    } catch (error) {
      console.error('Error when logout: ', error);
      return res.status(500).json({ message: 'Đăng xuất thất bại!' });
    }
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['fruitsflow-refresh'];

    if (!refreshToken) {
      return res.status(401).json({ message: 'Không tìm thấy refresh token' });
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt_refresh_key'),
      });

      const newAccessToken = this.jwtService.sign(
        { userId: payload.userId, username: payload.username },
        {
          secret: this.configService.get<string>('jwt_secret_key'),
          expiresIn: this.configService.get<string>('jwt_expire'),
        },
      );

      res.cookie('fruitsflow-authentication', newAccessToken, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000 * 24 * 1,
      });

      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      return res.status(401).json({ message: 'Refresh token thất bại' });
    }
  }
}
