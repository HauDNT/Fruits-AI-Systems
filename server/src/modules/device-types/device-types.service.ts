import {HttpException, Injectable, BadRequestException, InternalServerErrorException} from '@nestjs/common';
import {CreateDeviceTypeDto} from './dto/create-device-type.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {DeviceType} from "@/modules/device-types/entities/device-type.entity";
import {DeleteResult, In, IsNull, Like, Repository} from "typeorm";
import {omitFields} from "@/utils/omitFields";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {TableMetaData} from "@/interfaces/table";
import {Device} from "@/modules/devices/entities/device.entity";

@Injectable()
export class DeviceTypesService {
    constructor(
        @InjectRepository(DeviceType)
        private deviceTypeRepository: Repository<DeviceType>,
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
    ) {
    }

    async create(createDeviceTypeDto: CreateDeviceTypeDto) {
        try {
            const { type_name } = createDeviceTypeDto

            const existType = await this.deviceTypeRepository
                .createQueryBuilder('checkType')
                .where('LOWER(checkType.type_name) = LOWER(:type_name)', {type_name: type_name})
                .getOne()

            if (existType) {
                throw new BadRequestException('Loại thiết bị đã tồn tại')
            }

            const newDeviceType = this.deviceTypeRepository.create({
                type_name: type_name,
                created_at: new Date(),
                updated_at: new Date(),
            })

            await this.deviceTypeRepository.save(newDeviceType)

            return {
                message: 'Tạo loại thiết bị thành công',
                data: newDeviceType,
            };
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo loại thiết bị');
        }
    }

    async findAll() {
        try {
            const deviceTypes = await this.deviceTypeRepository.find();
            deviceTypes.forEach((type, index) => {
                deviceTypes[index] = omitFields(type, ['created_at', 'updated_at', 'deleted_at'])
            })

            return deviceTypes
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy danh sách loại thiết bị');
        }
    }

    async getDeviceTypesByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<DeviceType>> {
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

            const [types, total] = await this.deviceTypeRepository.findAndCount({
                where: searchConditions.length > 0 ? searchConditions : where,
                select: ['id', 'type_name', 'created_at', 'updated_at'],
                skip,
                take,
            })

            const totalPages = Math.ceil(total / limit)

            return {
                "columns": [
                    {"key": "id", "displayName": "ID", "type": "number"},
                    {"key": "type_name", "displayName": "Loại thiết bị", "type": "string"},
                    {"key": "created_at", "displayName": "Ngày tạo", "type": "date"},
                    {"key": "updated_at", "displayName": "Ngày cập nhật", "type": "date"},
                ],
                "values": types,
                "meta": {
                    "totalItems": total,
                    "currentPage": page,
                    "totalPages": totalPages,
                    "limit": limit,
                },
            };
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy danh sách loại thiết bị');
        }
    }

    async deleteDeviceTypes(typeIds: string[]): Promise<DeleteResult> {
        try {
            if (!Array.isArray(typeIds) || typeIds.length === 0) {
                throw new BadRequestException('Danh sách id loại thiết bị không hợp lệ');
            }

            const types = await this.deviceTypeRepository.find({
                where: {id: In(typeIds)}
            })

            if (types.length !== typeIds.length) {
                throw new BadRequestException('Một hoặc nhiều loại thiết bị không tồn tại');
            }

            for (const type of types) {
                const checkDeviceLink = await this.deviceRepository.findOne({
                    where: { deviceType: { id: type.id } },
                })

                if (checkDeviceLink) {
                    throw new BadRequestException(`Loại thiết bị ${type.type_name} đang được liên kết với thiết bị. Vui lòng chuyển hoặc xoá thiết bị trước.`);
                }
            }

            return await this.deviceTypeRepository.delete(typeIds)
        } catch (e) {
            console.log('Error when delete device types: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình xoá loại thiết bị');
        }
    }
}
