import {IsArray, IsNotEmpty} from "class-validator";

export class DeleteDeviceStatusDto {
    @IsArray()
    @IsNotEmpty({ message: 'Danh sách trạng thái thiết bị cần xoá không được rỗng' })
    statusIds: string[];
}