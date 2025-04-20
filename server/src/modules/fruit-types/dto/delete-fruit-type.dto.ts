import {IsArray, IsNotEmpty} from "class-validator";

export class DeleteFruitTypeDto {
    @IsArray()
    @IsNotEmpty({ message: 'Fruit type list id is not empty' })
    fruitTypeIds: string[];
}