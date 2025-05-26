import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateDeviceTypeDto {
    @IsString()
    @Length(3, 50, { message: 'Loại thiết bị phải từ 3 đến 50 ký tự' })
    @IsNotEmpty({ message: 'Loại thiết bị không được rỗng' })
    type_name: string;
}
