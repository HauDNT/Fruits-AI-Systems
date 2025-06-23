import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTStrategy } from '@/authentication/jwt/jwt-strategy';
import { JWTRefreshStrategy } from '@/authentication/jwt-refresh/jwt-refresh.strategy';
import { RefreshToken } from '@/modules/refresh-token/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret_key'),
        signOptions: {
          expiresIn: configService.get<string>('jwt_expire'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, JWTRefreshStrategy],
})
export class AuthModule {}
