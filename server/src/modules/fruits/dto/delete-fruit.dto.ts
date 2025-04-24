import {IsArray, IsNotEmpty} from "class-validator";

export class DeleteFruitDto {
    @IsArray()
    @IsNotEmpty({ message: 'Fruit list id is not empty' })
    fruitIds: string[];
}