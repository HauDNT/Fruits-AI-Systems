import {IsArray, IsNotEmpty, IsNumber, IsString, Length} from "class-validator";
import {FruitTypeIdsDto} from "@/modules/raspberry/dto/fruit-type-ids.dto";

export class RaspberryConfigDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    device_id: number;

    @IsString()
    @IsNotEmpty()
    device_code: string;

    @IsArray()
    @IsNotEmpty()
    labels: FruitTypeIdsDto[];
}