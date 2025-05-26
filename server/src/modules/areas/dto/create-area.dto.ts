import {IsNotEmpty, IsString, Length} from "class-validator";
import {Transform} from 'class-transformer';

export class CreateAreaDto {
    @IsString({message: 'Area description must be string'})
    @IsNotEmpty({message: 'Area description is not empty'})
    @Length(8, 50, {message: 'Area description must be 8 to 50 characters'})
    @Transform(({value}) => String(value))
    area_desc: string;
}
