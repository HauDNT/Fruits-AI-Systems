import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTLoginPayload } from '../jwt/jwt-payload.type';

@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt_refresh_key'),
    });
  }

  async validate(payload: JWTLoginPayload) {
    return {
      id: payload.userId,
      username: payload.username,
    };
  }
}
