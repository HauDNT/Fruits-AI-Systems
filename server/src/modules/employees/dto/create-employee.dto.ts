import {IsNotEmpty, IsNumber, IsString, Length} from "class-validator";

export class CreateEmployeeDto {
    @IsString()
    @Length(8, 50, { message: 'Fullname must be 8 to 50 characters' })
    @IsNotEmpty({ message: 'Fullname is not empty' })
    fullname: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Không được bỏ trống giới tính' })
    gender: number;

    @IsString()
    @Length(1, 11, { message: 'Phone number 1 to 11 characters' })
    @IsNotEmpty({ message: 'Phone number is not empty' })
    phone_number: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Area id is not empty' })
    areaId: number;
}