import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateAreaDto {
    @IsString()
    @Length(8, 50, { message: 'Fruit description must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'Fruit description is not empty' })
    area_desc: string;
}
