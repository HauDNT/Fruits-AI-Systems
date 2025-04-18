import {IsNotEmpty, IsString} from 'class-validator';

export class LogoutDTO {
    @IsString()
    @IsNotEmpty()
    userIdentifier: string | null;      // username
}