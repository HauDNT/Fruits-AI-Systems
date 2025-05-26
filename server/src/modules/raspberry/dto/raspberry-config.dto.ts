import {IsArray, IsNotEmpty, IsNumber, IsString,} from "class-validator";
import {FruitTypeIdsDto} from "@/modules/raspberry/dto/fruit-type-ids.dto";

export class RaspberryConfigDto {
    @IsNumber()
    @IsNotEmpty({message: 'Mã thiết bị không được bỏ trống'})
    device_id: number;

    @IsString()
    @IsNotEmpty({message: 'Mã định danh thiết bị không được bỏ trống'})
    device_code: string;

    @IsArray()
    @IsNotEmpty({message: 'Danh sách nhãn học máy phân loại không được bỏ trống'})
    labels: FruitTypeIdsDto[];
}