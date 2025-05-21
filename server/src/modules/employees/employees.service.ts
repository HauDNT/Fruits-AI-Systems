import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Employee} from "@/modules/employees/entities/employee.entity";
import {DeleteResult, In, IsNull, Like, Repository} from "typeorm";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {TableMetaData} from "@/interfaces/table";
import {CreateEmployeeDto} from "@/modules/employees/dto/create-employee.dto";
import {generateUniqueCode} from "@/utils/generateUniqueCode";
import {Area} from "@/modules/areas/entities/area.entity";
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
        @InjectRepository(Area)
        private areaRepository: Repository<Area>,
    ) {
    }

    async create(createEmployeeDto: CreateEmployeeDto, imageUrl: string) {
        try {
            const {fullname, gender, phone_number, areaId} = createEmployeeDto
            const checkEmployeeExist = await this.employeeRepository
                .createQueryBuilder('existEmployee')
                .where('LOWER(existEmployee.fullname) = LOWER(:fullname)', {fullname: fullname})
                .orWhere('existEmployee.phone_number = :phone_number', {phone_number: phone_number})
                .getOne()

            if (checkEmployeeExist) {
                throw new BadRequestException('Đã tồn tại thông tin của nhân viên này')
            }

            const area = await this.areaRepository.findOneBy({id: areaId})

            let employeeCode: string
            let employeeCodeExist
            do {
                employeeCode = generateUniqueCode("Employee", 6)
                employeeCodeExist = await this.employeeRepository.findOneBy({
                    employee_code: employeeCode,
                })
            } while (employeeCodeExist)

            const newEmployee = this.employeeRepository.create({
                employee_code: employeeCode,
                fullname,
                gender,
                phone_number,
                avatar_url: imageUrl,
                areaWorkAt: area,
                created_at: new Date(),
                updated_at: new Date(),
            })

            const saveEmployee = await this.employeeRepository.save(newEmployee)

            return {
                message: 'Tạo nhân viên mới thành công',
                data: saveEmployee,
            }
        } catch (e) {
            console.log('Lỗi: ', e.message)

            const fileEmployeeImgPath = path.join(process.cwd(), imageUrl)
            await fs.unlink(fileEmployeeImgPath)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo nhân viên mới');
        }
    }

    async getEmployeesByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<Employee>> {
        try {
            const {
                page,
                limit,
                queryString,
                searchFields,
            } = data;

            const skip = (page - 1) * limit;
            const take = limit;

            const where: any = {};
            where.deleted_at = IsNull();

            let searchConditions: any[] = [];
            if (queryString && searchFields) {
                const fields = searchFields.split(',').map((field) => field.trim());
                searchConditions = fields.map((field) => ({
                    ...where,
                    [field]: Like(`%${queryString}%`),
                }));
            }

            const [employees, total] = await this.employeeRepository.findAndCount({
                where: searchConditions.length > 0 ? searchConditions : where,
                select: ['id', 'employee_code', 'fullname', 'gender', 'phone_number', 'created_at', 'updated_at'],
                skip,
                take,
            })

            const totalPages = Math.ceil(total / limit);

            return {
                columns: [
                    {key: "id", displayName: "ID", type: "number"},
                    {key: "employee_code", displayName: "Mã nhân viên", type: "string"},
                    {key: "fullname", displayName: "Họ và tên", type: "string"},
                    {key: "gender", displayName: "Giới tính", type: "gender"},
                    {key: "phone_number", displayName: "Số điện thoại", type: "string"},
                    {key: "created_at", displayName: "Ngày tạo", type: "date"},
                    {key: "updated_at", displayName: "Ngày cập nhật", type: "date"},
                ],
                values: employees,
                meta: {
                    totalItems: total,
                    currentPage: page,
                    totalPages: totalPages,
                    limit: limit,
                }
            };

        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy danh sách nhân viên');
        }
    }

    async deleteEmployees(employeeIds: string[]): Promise<DeleteResult> {
        try {
            const employees = await this.employeeRepository.find({ where: {id: In(employeeIds)}})
            if (employees.length !== employeeIds.length) {
                throw new BadRequestException('Một hoặc nhiều thông tin nhân viên không tồn tại')
            }

            for (const employee of employees) {
                const fileEmployeeImgPath = path.join(process.cwd(), employee.avatar_url)
                try {
                    await fs.unlink(fileEmployeeImgPath)
                } catch (error) {
                    console.error(`Error deleting file ${fileEmployeeImgPath}: `, error.message);
                }
            }

            return await this.employeeRepository.delete(employeeIds)
        } catch (e) {
            console.log('Error when delete users: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình xoá tài khoản người dùng');
        }
    }
}