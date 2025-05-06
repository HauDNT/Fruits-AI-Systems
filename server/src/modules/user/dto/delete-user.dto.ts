import {IsArray, IsNotEmpty} from "class-validator";

export class DeleteUserDto {
    @IsArray()
    @IsNotEmpty({ message: 'User list id is not empty' })
    userIds: string[];
}