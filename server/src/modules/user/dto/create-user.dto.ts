import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(8, 50, { message: 'Username must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'Username is not empty' })
    username: string;

    @IsString()
    @Length(8, 50, { message: 'Password must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'Password is not empty' })
    password: string;
}
