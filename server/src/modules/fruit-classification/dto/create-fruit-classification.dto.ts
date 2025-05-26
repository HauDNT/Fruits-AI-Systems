import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateFruitClassificationDto {
    @IsNumber()
    @IsNotEmpty({message: 'Độ tin cậy từ kết quả không hợp lệ'})
    confidence_level: number;

    @IsString()
    @IsNotEmpty({message: 'Nhãn từ kết quả không hợp lệ'})
    result: string;

    @IsNumber()
    @IsNotEmpty({message: 'Khu vực phân loại của kết quả không hợp lệ'})
    areaId: number;
}
