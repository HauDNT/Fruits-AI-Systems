import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateFruitClassificationDto {
    @IsNumber()
    @IsNotEmpty()
    confidence_level: number;

    @IsString()
    @IsNotEmpty()
    result: string;

    @IsNumber()
    @IsNotEmpty()
    areaId: number;
}
