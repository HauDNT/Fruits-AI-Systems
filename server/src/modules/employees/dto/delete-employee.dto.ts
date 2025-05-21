import {IsArray, IsNotEmpty} from "class-validator";

export class DeleteEmployeeDto {
    @IsArray()
    @IsNotEmpty({ message: 'Employee list id is not empty' })
    employeeIds: string[];
}