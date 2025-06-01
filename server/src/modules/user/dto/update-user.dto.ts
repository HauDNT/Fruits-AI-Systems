import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {IsNotEmpty, IsString, Length} from "class-validator";
import {Match} from "@/decorate/Match.decorator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @Length(1, 50, { message: 'Mật khẩu phải từ 1 đến 50 ký tự' })
    @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
    @Match('password', { message: 'Mật khẩu không trùng khớp'})
    re_password: string;
}
