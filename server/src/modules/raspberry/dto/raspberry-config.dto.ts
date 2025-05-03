import {IsArray, IsNotEmpty, IsNumber, IsString, Length} from "class-validator";
import {FruitTypeIdsDto} from "@/modules/raspberry/dto/fruit-type-ids.dto";

export class RaspberryConfigDto {
    @IsNumber()
    @IsNotEmpty()
    deviceId: number;

    @IsString()
    @IsNotEmpty()
    deviceCode: string;

    @IsArray()
    @IsNotEmpty()
    labels: FruitTypeIdsDto[];
}