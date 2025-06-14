import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Employee} from "@/modules/employees/entities/employee.entity";
import {DeleteResult, Repository} from "typeorm";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {TableMetaData} from "@/interfaces/table";
import {CreateEmployeeDto} from "@/modules/employees/dto/create-employee.dto";
import {generateUniqueCode} from "@/utils/generateUniqueCode";
import {Area} from "@/modules/areas/entities/area.entity";
import * as path from 'path';
import {UpdateEmployeeDto} from "@/modules/employees/dto/update-employee.dto";
import {deleteFile, deleteFilesInParallel} from "@/utils/handleFiles";
import {validateAndGetEntitiesByIds} from "@/utils/validateAndGetEntitiesByIds";
import {getDataWithQueryAndPaginate} from "@/utils/paginateAndSearch";

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
        let isCreateSuccess = false;
        const {fullname, gender, phone_number, area_id} = createEmployeeDto

        try {
            const checkEmployeeExist = await this.employeeRepository
                .createQueryBuilder('existEmployee')
                .where('LOWER(existEmployee.fullname) = LOWER(:fullname)', {fullname: fullname})
                .orWhere('existEmployee.phone_number = :phone_number', {phone_number: phone_number})
                .getOne()

            if (checkEmployeeExist) {
                throw new BadRequestException('Đã tồn tại thông tin của nhân viên này')
            }

            const area = await this.areaRepository.findOneBy({id: area_id})

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
            });

            const saveEmployee = await this.employeeRepository.save(newEmployee);
            isCreateSuccess = true;

            return {
                message: 'Tạo nhân viên mới thành công',
                data: saveEmployee,
            }
        } finally {
            if (!isCreateSuccess && imageUrl) {
                await deleteFile(imageUrl);
            }
        }
    }

    async getEmployeesByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<Employee>> {
        return getDataWithQueryAndPaginate({
            repository: this.employeeRepository,
            page: data.page,
            limit: data.limit,
            queryString: data.queryString,
            searchFields: data.searchFields?.split(','),
            selectFields: [
                'id',
                'employee_code',
                'fullname',
                'avatar_url',
                'gender',
                'phone_number',
                'created_at',
                'updated_at',
                'area_id'
            ],
            columnsMeta: [
                {key: "id", displayName: "ID", type: "number"},
                {key: "employee_code", displayName: "Mã nhân viên", type: "string"},
                {key: "fullname", displayName: "Họ và tên", type: "string"},
                {key: "gender", displayName: "Giới tính", type: "gender"},
                {key: "phone_number", displayName: "Số điện thoại", type: "string"},
                {key: "created_at", displayName: "Ngày tạo", type: "date"},
                {key: "updated_at", displayName: "Ngày cập nhật", type: "date"},
            ],
        })
    }

    async updateEmployeeProfile(data: UpdateEmployeeDto, imageUrl?: string): Promise<Employee> {
        const { employee_code, fullname, gender, phone_number, area_id } = data;
        
        const employee = await this.employeeRepository.findOneBy({
            employee_code
        });

        if (!employee) {
            throw new BadRequestException(`Không tìm thấy nhân viên có mã số ${employee_code}`)
        };

        employee.fullname = fullname;
        employee.gender = +gender;
        employee.phone_number = phone_number;
        employee.area_id = +area_id;
        employee.updated_at = new Date();

        if (imageUrl) {
            await deleteFile(employee.avatar_url);
            employee.avatar_url = imageUrl;
        };

        return await this.employeeRepository.save(employee);
    }

    async deleteEmployees(employeeIds: string[]): Promise<DeleteResult> {
        const employees = await validateAndGetEntitiesByIds(this.employeeRepository, employeeIds);
        const deleteEmployeesResult =  await this.employeeRepository.delete(employeeIds);
        const employeeAvatarPaths = employees.map(employee => path.join(process.cwd(), employee.avatar_url));
        await deleteFilesInParallel(employeeAvatarPaths);

        return deleteEmployeesResult;
    }
}