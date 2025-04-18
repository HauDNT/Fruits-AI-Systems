import {Body, Controller, Post, Res} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDTO} from "@/modules/auth/dto/login.dto";
import {LoginResponse} from "@/interfaces";
import {LogoutDTO} from "@/modules/auth/dto/logout.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    async login(
        @Body() data: LoginDTO,
    ): Promise<LoginResponse> {
        return await this.authService.login(data)
    }

    @Post('logout')
    async logout(
        @Body() body: LogoutDTO,
        @Res() res,
    ): Promise<{ message: string }> {
        // Tạm thời chưa xử lý chức năng đăng xuất kỹ
        // const logoutResult = await this.authService.logout(body);
        const logoutResult = true;

        if (logoutResult) {
            res.clearCookie('fruitflow-authentication');
            return res.status(200).json({message: 'Đăng xuất thành công'});
        } else {
            return res.status(400).json({message: 'Không tìm thấy phiên để đăng xuất'});
        }
    }
}
