import {IsArray, IsNotEmpty} from "class-validator";

export class DeleteDeviceStatusDto {
    @IsArray()
    @IsNotEmpty({ message: 'Status list id is not empty' })
    statusIds: string[];
}