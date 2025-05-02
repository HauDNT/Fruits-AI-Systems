import {IsNotEmpty, IsNumber, IsString, Length} from "class-validator";

export class RaspberryConfigDto {
    @IsNumber()
    @IsNotEmpty()
    deviceId: number;

    @IsString()
    @IsNotEmpty()
    deviceCode: string;

    @IsString()
    @IsNotEmpty()
    labels: string;
}