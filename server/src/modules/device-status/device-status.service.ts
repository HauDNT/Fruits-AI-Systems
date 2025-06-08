import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateDeviceStatusDto} from './dto/create-device-status.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {DeviceStatus} from "@/modules/device-status/entities/device-status.entity";
import {DataSource, DeleteResult, In, IsNull, Like, Repository} from "typeorm";
import {omitFields} from "@/utils/omitFields";
import {Device} from "@/modules/devices/entities/device.entity";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {TableMetaData} from "@/interfaces/table";
import {validateAndGetEntitiesByIds} from "@/utils/validateAndGetEntitiesByIds";
import {checkAllRelationsBeforeDelete} from "@/utils/checkAllRelationsBeforeDelete";
import {getDataWithQueryAndPaginate} from "@/utils/paginateAndSearch";

@Injectable()
export class DeviceStatusService {
    constructor(
        @InjectRepository(DeviceStatus)
        private readonly deviceStatusRepository: Repository<DeviceStatus>,
        @InjectRepository(Device)
        private readonly deviceRepository: Repository<Device>,
        private readonly dataSource: DataSource,
    ) {
    }

    async create(createDeviceStatusDto: CreateDeviceStatusDto) {
        const {status_name} = createDeviceStatusDto
        const existStatus = await this.deviceStatusRepository
            .createQueryBuilder('existStatus')
            .where('LOWER(existStatus.status_name) = LOWER(:status_name)', {status_name: status_name})
            .getOne()

        if (existStatus) {
            throw new BadRequestException('Trạng thái thiết bị đã tồn tại')
        }

        const newDeviceStatus = this.deviceStatusRepository.create({
            status_name,
            created_at: new Date(),
            updated_at: new Date(),
        })

        await this.deviceStatusRepository.save(newDeviceStatus)

        return {
            message: 'Tạo trạng thái thiết bị thành công',
            data: newDeviceStatus,
        };
    }

    async findAll(): Promise<DeviceStatus[]> {
        const deviceStatuses = await this.deviceStatusRepository.find();

        deviceStatuses.forEach((status, index) => {
            deviceStatuses[index] = omitFields(status, ['created_at', 'updated_at', 'deleted_at'])
        })

        return deviceStatuses
    }

    async getDeviceStatusesByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<DeviceStatus>> {
        return getDataWithQueryAndPaginate({
            repository: this.deviceStatusRepository,
            page: data.page,
            limit: data.limit,
            queryString: data.queryString,
            searchFields: data.searchFields?.split(','),
            selectFields: ['id', 'status_name', 'created_at', 'updated_at'],
            columnsMeta: [
                {"key": "id", "displayName": "ID", "type": "number"},
                {"key": "status_name", "displayName": "Trạng thái", "type": "string"},
                {"key": "created_at", "displayName": "Ngày tạo", "type": "date"},
                {"key": "updated_at", "displayName": "Ngày cập nhật", "type": "date"},
            ],
        });
    }

    async deleteDevicesStatuses(statusIds: string[]): Promise<DeleteResult> {
        await validateAndGetEntitiesByIds(this.deviceStatusRepository, statusIds);

        await checkAllRelationsBeforeDelete(
            this.dataSource,
            DeviceStatus,
            statusIds,
            {
                deviceStatus: 'Một hoặc nhiều trạng thái đang được liên kết với thiết bị.'
            }
        )

        return await this.deviceStatusRepository.delete(statusIds)
    }
}
