import * as bcrypt from 'bcryptjs';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from '@/modules/auth/dto/login.dto';
import { LoginResponse } from '@/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { comparePassword } from '@/utils/bcrypt';
import { JWTLoginPayload } from '@/authentication/jwt/jwt-payload.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '@/modules/refresh-token/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAuthTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JWTLoginPayload = { userId: user.id, username: user.username };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt_secret_key'),
      expiresIn: this.configService.get<string>('jwt_expire'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt_refresh_key'),
      expiresIn: this.configService.get<string>('jwt_refresh_expire'),
    });

    const refreshTokenHashed = await bcrypt.hash(refreshToken, 10);

    const refreshTokenEntity = this.refreshTokenRepository.create({
      user,
      token: refreshTokenHashed,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt_refresh_key'),
      });

      const user = await this.userRepository.findOneBy({ id: payload.sub });
      const storedTokens = await this.refreshTokenRepository.find({
        where: { user },
      });

      const match = storedTokens.find(
        async (refreshTokenEntity) => await bcrypt.compare(refreshToken, refreshTokenEntity.token),
      );
      if (!match) throw new UnauthorizedException('Token không hợp lệ!');

      const newAccessToken = this.jwtService.sign(
        { sub: user.id, username: user.username },
        {
          secret: this.configService.get('jwt_secret_key'),
          expiresIn: this.configService.get('jwt_expire'),
        },
      );

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new UnauthorizedException('Token không hợp lệ!');
    }
  }

  async deleteRefreshToken(refreshToken: string, userId: number) {
    const userTokens = await this.refreshTokenRepository.find({ where: { user: { id: userId } } });

    for (const refreshTokenEntity of userTokens) {
      const match = await bcrypt.compare(refreshToken, refreshTokenEntity.token);
      if (match) {
        await this.refreshTokenRepository.remove(refreshTokenEntity);
        return true;
      }
    }

    throw new NotFoundException('Không tìm thấy token');
  }

  async login(data: LoginDTO): Promise<{
    userId: number;
    username: string;
    accessToken: string;
    refreshToken: string;
  }> {
    const account = await this.userRepository.findOne({
      where: {
        username: data.username,
      },
    });

    if (!account) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    const isValidPassword: boolean = await comparePassword(data.password, account.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Mật khẩu không trùng khớp');
    }

    const { accessToken, refreshToken } = await this.generateAuthTokens(account);

    return {
      userId: account.id,
      username: account.username,
      accessToken,
      refreshToken,
    };
  }
}
