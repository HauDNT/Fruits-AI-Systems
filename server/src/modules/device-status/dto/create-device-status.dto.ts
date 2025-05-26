import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateDeviceStatusDto {
    @IsString()
    @Length(3, 50, { message: 'Trạng thái thiết bị phải từ 3 đến 50 ký tự' })
    @IsNotEmpty({ message: 'Trạng thái thiết bị không được bỏ trống' })
    status_name: string;
}
