import { Type, Transform } from 'class-transformer';
import {IsArray, IsNotEmpty, IsNumber, IsString, ArrayNotEmpty, IsInt} from "class-validator";
import {FruitTypeIdsDto} from "@/modules/raspberry/dto/fruit-type-ids.dto";

export class RaspberryConfigDto {
    @IsNumber()
    @IsNotEmpty({message: 'Mã thiết bị không được bỏ trống'})
    @Type(() => Number)
    device_id: number;

    @IsString()
    @IsNotEmpty({message: 'Mã định danh thiết bị không được bỏ trống'})
    device_code: string;

    @IsNotEmpty({message: 'Các nhãn được chọn phải nằm trong một mảng'})
    @Type(() => FruitTypeIdsDto, { keepDiscriminatorProperty: true })
    labels: FruitTypeIdsDto[];
}