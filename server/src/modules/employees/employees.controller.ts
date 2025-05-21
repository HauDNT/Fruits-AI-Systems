import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseInterceptors,
    UploadedFile,
    BadRequestException, InternalServerErrorException
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';
import {plainToInstance} from 'class-transformer';
import * as fs from 'fs/promises';
import {EmployeesService} from './employees.service';
import {TableMetaData} from "@/interfaces/table";
import {Employee} from "@/modules/employees/entities/employee.entity";
import {CreateEmployeeDto} from "@/modules/employees/dto/create-employee.dto";
import {DeleteResult} from "typeorm";
import {DeleteEmployeeDto} from "@/modules/employees/dto/delete-employee.dto";

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) {
    }

    @Post('create-employee')
    @UseInterceptors(FileInterceptor('employee_image', {
        storage: diskStorage({
            destination: async (req, file, callback) => {
                const uploadPath = './uploads/images/employees';
                try {
                    await fs.mkdir(uploadPath, { recursive: true });
                    callback(null, uploadPath);
                } catch (error) {
                    callback(new Error('Không thể tạo thư mục lưu trữ ảnh nhân viên'), null);
                }
            },
            filename(req, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    }))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any
    ) {
        try {
            if (!file) {
                throw new BadRequestException('Vui lòng gửi file ảnh')
            }

            if (!body.fullname || !body.gender || !body.phone_number || !body.areaId) {
                throw new BadRequestException('Thiếu thông tin bắt buộc: họ tên, giới tính, số điện thoại, khu làm việc')
            }

            const createEmployeeDto = plainToInstance(CreateEmployeeDto, {
                fullname: body.fullname,
                gender: body.gender,
                phone_number: body.phone_number,
                areaId: body.areaId,
            })
            const imageUrl = `/uploads/images/employees/${file.filename}`;
            
            return await this.employeesService.create(createEmployeeDto, imageUrl);
        } catch (error) {
            console.log('-> Error: ', error.message)

            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Lỗi khi thêm nhân viên mới: ' + error.message);
        }
    }

    @Get()
    async getEmployeesByQuery(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('queryString') queryString: string,
        @Query('searchFields') searchFields: string,
    ): Promise<TableMetaData<Employee>> {
        return await this.employeesService.getEmployeesByQuery({
            page,
            limit,
            queryString,
            searchFields,
        })
    }

    @Delete('/delete-employees')
    async deleteEmployees(
        @Body() data: DeleteEmployeeDto
    ): Promise<DeleteResult> {
        const { employeeIds } = data;
        return await this.employeesService.deleteEmployees(employeeIds)
    }
}
