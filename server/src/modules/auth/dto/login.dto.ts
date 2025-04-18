import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDTO {
    @IsString()
    @Length(8, 50, { message: 'username must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'username is not empty' })
    username: string;

    @IsString()
    @Length(8, 50, { message: 'password must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'password is not empty!' })
    password: string;
}