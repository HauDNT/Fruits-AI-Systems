import {IsNumber} from "class-validator";

export class CreateDeviceDto {
    @IsNumber()
    type_id: number;

    @IsNumber()
    status_id: number;

    @IsNumber()
    area_id: number;
}
