import {IsNotEmpty, IsString, Length } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateAreaDto {
    @IsString()
    @IsNotEmpty()
    @Length(8, 50, { message: 'Fruit description must be 8 to 50 characters' })
    @Transform(({ value }) => String(value))
    area_desc: string;
}
