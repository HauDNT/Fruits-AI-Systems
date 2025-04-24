import {IsArray, IsNotEmpty, IsString, Length} from "class-validator";

export class CreateFruitDto {
    @IsString()
    @Length(8, 50, { message: 'Fruit name must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'Fruit name is not empty' })
    fruit_name: string;

    @IsString()
    @Length(8, 50, { message: 'Fruit description must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'Fruit description is not empty' })
    fruit_desc: string;

    @IsArray()
    fruit_types: number[];
}
