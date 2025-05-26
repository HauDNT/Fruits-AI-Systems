import {IsArray, IsNotEmpty} from "class-validator";

export class DeleteEmployeeDto {
    @IsArray()
    @IsNotEmpty({ message: 'Danh sách nhân viên cần xoá không được bỏ trống' })
    employeeIds: string[];
}