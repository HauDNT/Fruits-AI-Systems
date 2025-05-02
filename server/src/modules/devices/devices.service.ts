import {Injectable, HttpException, BadRequestException, InternalServerErrorException} from '@nestjs/common';
import {CreateDeviceDto} from './dto/create-device.dto';
import {UpdateDeviceDto} from './dto/update-device.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Device} from "@/modules/devices/entities/device.entity";
import {Repository} from "typeorm";
import {DeviceStatus} from "@/modules/device-status/entities/device-status.entity";
import {DeviceType} from "@/modules/device-types/entities/device-type.entity";
import {Area} from "@/modules/areas/entities/area.entity";
import {generateUniqueCode} from "@/utils/generateUniqueCode";

@Injectable()
export class DevicesService {
    constructor(
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
        @InjectRepository(DeviceStatus)
        private deviceStatusRepository: Repository<DeviceStatus>,
        @InjectRepository(DeviceType)
        private deviceTypeRepository: Repository<DeviceType>,
        @InjectRepository(Area)
        private areaRepository: Repository<Area>,
    ) {
    }

    async create(createDeviceDto: CreateDeviceDto, image_url: string) {
        try {
            const { type_id, status_id, area_id } = createDeviceDto
            const areaBelong = await this.areaRepository.findOneBy({id: area_id})
            const deviceType = await this.deviceTypeRepository.findOneBy({id: type_id})
            const deviceStatus = await this.deviceStatusRepository.findOneBy({id: status_id})

            if (!areaBelong || !deviceType || !deviceStatus) {
                throw new BadRequestException('Khu phân loại, trạng thái thiết bị hoặc loại thiết bị không tồn tại')
            }

            let device_code: string
            let deviceCodeExist

            do {
                device_code = generateUniqueCode("Device", 6)
                deviceCodeExist = await this.deviceRepository.findOneBy({ device_code: device_code })
            } while (deviceCodeExist)

            const newDevice = await this.deviceRepository.create({
                device_code,
                image_url,
                deviceType,
                deviceStatus,
                areaBelong,
                created_at: new Date(),
                updated_at: new Date(),
            })

            await this.deviceRepository.save(newDevice)

            return {
                message: 'Tạo thiết bị mới thành công',
                data: newDevice,
            }
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo thiết bị mới');
        }
    }

    findAll() {
        return `This action returns all devices`;
    }

    findOne(id: number) {
        return `This action returns a #${id} device`;
    }

    update(id: number, updateDeviceDto: UpdateDeviceDto) {
        return `This action updates a #${id} device`;
    }

    remove(id: number) {
        return `This action removes a #${id} device`;
    }
}
