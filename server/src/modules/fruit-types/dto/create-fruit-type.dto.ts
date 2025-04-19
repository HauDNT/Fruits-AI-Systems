import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateFruitTypeDto {
    @IsString()
    @Length(8, 50, { message: 'Fruit type must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'Fruit type is not empty' })
    type_name: string;

    @IsString()
    @Length(8, 50, { message: 'Fruit description must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'Fruit description is not empty' })
    type_desc: string;
}
