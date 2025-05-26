import {IsNotEmpty, IsString, Length} from "class-validator";
import {Transform} from 'class-transformer';

export class CreateAreaDto {
    @IsString({message: 'Mô tả khu vực phải là chuỗi'})
    @IsNotEmpty({message: 'Mô tả khu vực không được bỏ trống'})
    @Length(8, 50, {message: 'Mô tả khu vực phải từ 8 đến 50 ký tự'})
    @Transform(({value}) => String(value))
    area_desc: string;
}
