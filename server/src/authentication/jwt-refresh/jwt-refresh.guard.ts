import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JWTRefreshGuard extends AuthGuard('jwt-refresh') {}
