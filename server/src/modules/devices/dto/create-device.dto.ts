import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class CreateDeviceDto {
    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty({message: 'Phải chọn loại thiết bị'})
    type_id: number;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty({message: 'Phải chọn trạng thái thiết bị'})
    status_id: number;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty({message: 'Phải chọn khu vực lắp đặt'})
    area_id: number;
}
