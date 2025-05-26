import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(1, 50, { message: 'Username phải từ 1 đến 50 ký tự' })
    @IsNotEmpty({ message: 'Username không được bỏ trống' })
    username: string;

    @IsString()
    @Length(1, 50, { message: 'Mật khẩu phải từ 1 đến 50 ký tự' })
    @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
    password: string;
}
