import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDTO {
    @IsString()
    @Length(8, 50, { message: 'username phải từ 8 đến 50 ký tự' })
    @IsNotEmpty({ message: 'username không được bỏ trống' })
    username: string;

    @IsString()
    @Length(8, 50, { message: 'password phải từ 8 đến 50 ký tự' })
    @IsNotEmpty({ message: 'password không được bỏ trống' })
    password: string;
}