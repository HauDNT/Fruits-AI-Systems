import {IsNotEmpty, IsNumber, IsString, Length} from "class-validator";
import {Transform} from 'class-transformer';

export class CreateEmployeeDto {
    @IsString()
    @Length(8, 100, { message: 'Fullname phải từ 5 đến 100 ký tự' })
    @IsNotEmpty({ message: 'Fullname không được bỏ trống' })
    @Transform(({value}) => String(value))
    fullname: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Không được bỏ trống giới tính' })
    @Transform(({value}) => parseInt(value))
    gender: number;

    @IsString()
    @Length(1, 11, { message: 'Số điện thoại phải từ 1 đến 11' })
    @IsNotEmpty({ message: 'Số điện thoại không được bỏ trống' })
    @Transform(({value}) => String(value))
    phone_number: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Phải chọn khu vực làm việc của nhân viên' })
    @Transform(({value}) => parseInt(value))
    area_id: number;
}