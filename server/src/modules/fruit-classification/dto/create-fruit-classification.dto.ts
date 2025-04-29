import {IsNumber} from "class-validator";

export class CreateFruitClassificationDto {
    @IsNumber()
    confidence_level: number;

    @IsNumber()
    fruitId: number;

    @IsNumber()
    typeId: number;

    @IsNumber()
    areaId: number;

    @IsNumber()
    batchId: number;
}
