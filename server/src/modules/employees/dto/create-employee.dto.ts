import {IsNotEmpty, IsNumber, IsString, Length} from "class-validator";

export class CreateEmployeeDto {
    @IsString()
    @Length(8, 100, { message: 'Fullname phải từ 5 đến 100 ký tự' })
    @IsNotEmpty({ message: 'Fullname không được bỏ trống' })
    fullname: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Không được bỏ trống giới tính' })
    gender: number;

    @IsString()
    @Length(1, 11, { message: 'Số điện thoại phải từ 1 đến 11' })
    @IsNotEmpty({ message: 'Số điện thoại không được bỏ trống' })
    phone_number: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Phải chọn khu vực làm việc của nhân viên' })
    area_id: number;
}