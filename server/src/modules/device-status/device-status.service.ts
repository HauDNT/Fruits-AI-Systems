import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateDeviceStatusDto} from './dto/create-device-status.dto';
import {UpdateDeviceStatusDto} from './dto/update-device-status.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {DeviceStatus} from "@/modules/device-status/entities/device-status.entity";
import {Repository} from "typeorm";
import {omitFields} from "@/utils/omitFields";

@Injectable()
export class DeviceStatusService {
    constructor(
        @InjectRepository(DeviceStatus)
        private deviceStatusRepository: Repository<DeviceStatus>
    ) {
    }

    async create(createDeviceStatusDto: CreateDeviceStatusDto) {
        try {
            const { status_name } = createDeviceStatusDto
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

    findOne(id: number) {
        return `This action returns a #${id} deviceStatus`;
    }

    update(id: number, updateDeviceStatusDto: UpdateDeviceStatusDto) {
        return `This action updates a #${id} deviceStatus`;
    }

    remove(id: number) {
        return `This action removes a #${id} deviceStatus`;
    }
}
