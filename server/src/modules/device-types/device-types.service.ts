import {Injectable, BadRequestException} from '@nestjs/common';
import {CreateDeviceTypeDto} from './dto/create-device-type.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {DeviceType} from "@/modules/device-types/entities/device-type.entity";
import {DataSource, DeleteResult, In, IsNull, Like, Repository} from "typeorm";
import {omitFields} from "@/utils/omitFields";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {TableMetaData} from "@/interfaces/table";
import {Device} from "@/modules/devices/entities/device.entity";
import {validateAndGetEntitiesByIds} from "@/utils/validateAndGetEntitiesByIds";
import {checkAllRelationsBeforeDelete} from "@/utils/checkAllRelationsBeforeDelete";

@Injectable()
export class DeviceTypesService {
    constructor(
        @InjectRepository(DeviceType)
        private readonly deviceTypeRepository: Repository<DeviceType>,
        @InjectRepository(Device)
        private readonly deviceRepository: Repository<Device>,
        private readonly dataSource: DataSource,
    ) {
    }

    async create(createDeviceTypeDto: CreateDeviceTypeDto) {
        const {type_name} = createDeviceTypeDto

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
    }

    async findAll() {
        const deviceTypes = await this.deviceTypeRepository.find();
        deviceTypes.forEach((type, index) => {
            deviceTypes[index] = omitFields(type, ['created_at', 'updated_at', 'deleted_at'])
        })

        return deviceTypes
    }

    async getDeviceTypesByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<DeviceType>> {
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
    }

    async deleteDeviceTypes(typeIds: string[]): Promise<DeleteResult> {
        await validateAndGetEntitiesByIds(this.deviceTypeRepository, typeIds);

        await checkAllRelationsBeforeDelete(
            this.dataSource,
            DeviceType,
            typeIds,
            {
                deviceType: 'Một hoặc nhiều loại thiết bị đang được liên kết với thiết bị.',
            },
        );

        return await this.deviceTypeRepository.delete(typeIds)
    }
}
