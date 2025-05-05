import {IsArray, IsNotEmpty} from "class-validator";

export class DeleteDeviceTypeDto {
    @IsArray()
    @IsNotEmpty({ message: 'Type list id is not empty' })
    typeIds: string[];
}