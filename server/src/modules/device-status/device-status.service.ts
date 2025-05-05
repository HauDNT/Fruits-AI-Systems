import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateDeviceStatusDto} from './dto/create-device-status.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {DeviceStatus} from "@/modules/device-status/entities/device-status.entity";
import {DeleteResult, In, IsNull, Like, Repository} from "typeorm";
import {omitFields} from "@/utils/omitFields";
import {Device} from "@/modules/devices/entities/device.entity";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {TableMetaData} from "@/interfaces/table";

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
        try {
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
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo trạng thái thiết bị');
        }
    }

    async findAll(): Promise<DeviceStatus[]> {
        try {
            const deviceStatuses = await this.deviceStatusRepository.find();

            deviceStatuses.forEach((status, index) => {
                deviceStatuses[index] = omitFields(status, ['created_at', 'updated_at', 'deleted_at'])
            })

            return deviceStatuses
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy danh sách trạng thái thiết bị');
        }
    }

    async getDeviceStatusesByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<DeviceStatus>> {
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
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy danh sách trạng thái thiết bị');
        }
    }

    async deleteDevicesStatuses(statusIds: string[]): Promise<DeleteResult> {
        try {
            if (!Array.isArray(statusIds) || statusIds.length === 0) {
                throw new BadRequestException('Danh sách id trạng thái thiết bị không hợp lệ');
            }

            const statuses = await this.deviceStatusRepository.find({
                where: {id: In(statusIds)}
            })

            if (statuses.length !== statusIds.length) {
                throw new BadRequestException('Một hoặc nhiều trạng thái thiết bị không tồn tại');
            }

            for (const status of statuses) {
                const checkDeviceLink = await this.deviceRepository.findOne({
                    where: {deviceStatus: {id: status.id}}
                })

                if (checkDeviceLink) {
                    throw new BadRequestException('Trạng thái đang được liên kết với thiết bị. Vui lòng chuyển hoặc xoá thiết bị trước.');
                }
            }

            return await this.deviceStatusRepository.delete(statusIds)
        } catch (e) {
            console.log('Error when delete device statuses: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình xoá trạng thái thiết bị');
        }
    }
}
