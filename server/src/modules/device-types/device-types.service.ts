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
import {getDataWithQueryAndPaginate} from "@/utils/paginateAndSearch";

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
        return getDataWithQueryAndPaginate({
            repository: this.deviceTypeRepository,
            page: data.page,
            limit: data.limit,
            queryString: data.queryString,
            searchFields: data.searchFields?.split(','),
            selectFields: ['id', 'type_name', 'created_at', 'updated_at'],
            columnsMeta: [
                {"key": "id", "displayName": "ID", "type": "number"},
                {"key": "type_name", "displayName": "Loại thiết bị", "type": "string"},
                {"key": "created_at", "displayName": "Ngày tạo", "type": "date"},
                {"key": "updated_at", "displayName": "Ngày cập nhật", "type": "date"},
            ],
        });
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
