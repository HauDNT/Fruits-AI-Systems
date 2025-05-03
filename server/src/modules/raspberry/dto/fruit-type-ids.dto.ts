import {IsNotEmpty, IsNumber} from "class-validator";

export class FruitTypeIdsDto {
    @IsNumber()
    @IsNotEmpty()
    fruit_id: number;

    @IsNumber()
    @IsNotEmpty()
    type_id: number;
}