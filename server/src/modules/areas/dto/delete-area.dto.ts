import {IsArray, IsNotEmpty} from "class-validator";

export class DeleteAreaDto {
    @IsArray()
    @IsNotEmpty({ message: 'Danh sách khu vực cần xoá không được rỗng' })
    areaIds: string[];
}