import {IsArray, IsNotEmpty} from "class-validator";

export class DeleteAreaDto {
    @IsArray()
    @IsNotEmpty({ message: 'Area list id is not empty' })
    areaIds: string[];
}