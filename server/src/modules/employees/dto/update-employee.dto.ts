import { IsNotEmpty, IsString, Length } from "class-validator";
import { Transform } from 'class-transformer';

export class UpdateEmployeeDto {
    @IsString({ message: 'Mã khu vực phải là chuỗi' })
    @IsNotEmpty({ message: 'Mã khu vực không được bỏ trống' })
    @Length(8, 50, { message: 'Mã khu vực phải từ 8 đến 50 ký tự' })
    @Transform(({ value }) => String(value))
    employee_code: string;

    @IsString()
    @Length(8, 100, { message: 'Fullname phải từ 5 đến 100 ký tự' })
    @IsNotEmpty({ message: 'Fullname không được bỏ trống' })
    @Transform(({ value }) => String(value))
    fullname: string;

    @IsString()
    @IsNotEmpty({ message: 'Không được bỏ trống giới tính' })
    @Transform(({ value }) => String(value))
    gender: string;

    @IsString()
    @Length(1, 11, { message: 'Số điện thoại phải từ 1 đến 11' })
    @IsNotEmpty({ message: 'Số điện thoại không được bỏ trống' })
    @Transform(({ value }) => String(value))
    phone_number: string;

    @IsString()
    @IsNotEmpty({ message: 'Phải chọn khu vực làm việc của nhân viên' })
    @Transform(({ value }) => String(value))
    area_id: string;
}