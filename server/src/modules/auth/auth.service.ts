import {HttpException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {LoginDTO} from "@/modules/auth/dto/login.dto";
import {LoginResponse} from "@/interfaces";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@/modules/user/entities/user.entity";
import {Repository} from "typeorm";
import {comparePassword} from "@/utils/bcrypt";
import {JWTLoginPayload} from "@/authentication/jwt/jwt-payload.type";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {
    }

    async login(data: LoginDTO): Promise<LoginResponse>  {
        const account = await this.userRepository.findOne({
            where: {
                username: data.username,
            }
        })

        if (!account) {
            throw new UnauthorizedException('Tài khoản không tồn tại')
        }

        const isValidPassword: boolean = await comparePassword(
            data.password,
            account.password,
        )

        if (!isValidPassword) {
            throw new UnauthorizedException('Mật khẩu không trùng khớp')
        }

        const payload: JWTLoginPayload = {
            userId: account.id,
            username: account.username,
        }

        return {
            userId: account.id,
            username: account.username,
            accessToken: this.jwtService.sign(payload),
        }
    }
}
