import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateDeviceStatusDto} from './dto/create-device-status.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {DeviceStatus} from "@/modules/device-status/entities/device-status.entity";
import {DeleteResult, In, IsNull, Like, Repository} from "typeorm";
import {omitFields} from "@/utils/omitFields";
import {Device} from "@/modules/devices/entities/device.entity";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {TableMetaData} from "@/interfaces/table";
import {validateAndGetEntitiesByIds} from "@/utils/validateAndGetEntitiesByIds";

@Injectable()
export class DeviceStatusService {
    constructor(
        @InjectRepository(DeviceStatus)
        private deviceStatusRepository: Repository<DeviceStatus>,
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
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

        const [statuses, total] = await this.deviceStatusRepository.findAndCount({
            where: searchConditions.length > 0 ? searchConditions : where,
            select: ['id', 'status_name', 'created_at', 'updated_at'],
            skip,
            take,
        })

        const totalPages = Math.ceil(total / limit)

        return {
            "columns": [
                {"key": "id", "displayName": "ID", "type": "number"},
                {"key": "status_name", "displayName": "Trạng thái", "type": "string"},
                {"key": "created_at", "displayName": "Ngày tạo", "type": "date"},
                {"key": "updated_at", "displayName": "Ngày cập nhật", "type": "date"},
            ],
            "values": statuses,
            "meta": {
                "totalItems": total,
                "currentPage": page,
                "totalPages": totalPages,
                "limit": limit,
            },
        }
    }

    async deleteDevicesStatuses(statusIds: string[]): Promise<DeleteResult> {
        await validateAndGetEntitiesByIds(this.deviceStatusRepository, statusIds);
        const checkDeviceLink = await this.deviceRepository.find({
            where: {
                deviceStatus: {
                    id: In(statusIds),
                },
            },
            select: ['id'],
            relations: ['deviceStatus']
        })

        if (checkDeviceLink.length > 0) {
            throw new BadRequestException('Một hoặc nhiều trạng thái đang được liên kết với thiết bị. Vui lòng chuyển hoặc xoá thiết bị trước.');
        }

        return await this.deviceStatusRepository.delete(statusIds)
    }
}
