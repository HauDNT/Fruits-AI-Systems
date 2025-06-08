import {Injectable, BadRequestException} from '@nestjs/common';
import {Repository} from "typeorm";
import {CreateDeviceDto} from './dto/create-device.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Device} from "@/modules/devices/entities/device.entity";
import {DeviceStatus} from "@/modules/device-status/entities/device-status.entity";
import {DeviceType} from "@/modules/device-types/entities/device-type.entity";
import {Area} from "@/modules/areas/entities/area.entity";
import {generateUniqueCode} from "@/utils/generateUniqueCode";
import {DeviceEnum} from "@/database/enums/DeviceEnum";
import {omitFields} from "@/utils/omitFields";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {DeviceClassificationFlat} from "@/interfaces";
import {TableMetaData} from "@/interfaces/table";
import {getDataWithQueryAndPaginate} from "@/utils/paginateAndSearch";

@Injectable()
export class DevicesService {
    constructor(
        @InjectRepository(Device)
        private readonly deviceRepository: Repository<Device>,
        @InjectRepository(DeviceStatus)
        private readonly deviceStatusRepository: Repository<DeviceStatus>,
        @InjectRepository(DeviceType)
        private readonly deviceTypeRepository: Repository<DeviceType>,
        @InjectRepository(Area)
        private readonly areaRepository: Repository<Area>,
    ) {
    }

    formatDevice(device: Device): DeviceClassificationFlat {
        return {
            id: device.id,
            device_code: device.device_code,
            image_url: device.image_url,
            deviceType: device.deviceType.type_name,
            deviceStatus: device.deviceStatus.status_name,
            area: `${device.areaBelong.area_code} - ${device.areaBelong.area_desc}`,
            created_at: new Date(),
        }
    }

    async create(createDeviceDto: CreateDeviceDto, image_url: string) {
        const allowedDuplicateDevices = ['VL53L0X', 'Webcam']
        const {type_id, status_id, area_id} = createDeviceDto
        const areaBelong = await this.areaRepository.findOneBy({id: area_id})
        const deviceType = await this.deviceTypeRepository.findOneBy({id: type_id})
        const deviceStatus = await this.deviceStatusRepository.findOneBy({id: status_id})

        if (!areaBelong || !deviceType || !deviceStatus) {
            throw new BadRequestException('Khu phân loại, trạng thái thiết bị hoặc loại thiết bị không tồn tại')
        }

        const existDevice = await this.deviceRepository.findOne({
            where: {
                deviceType: {id: deviceType.id},
                areaBelong: {id: areaBelong.id},
            },
        });

        if (existDevice && !allowedDuplicateDevices.includes(deviceType.type_name)) {
            throw new BadRequestException('Thiết bị đã tồn tại')
        }

        let device_code: string
        let deviceCodeExist

        do {
            device_code = generateUniqueCode("Device", 6)
            deviceCodeExist = await this.deviceRepository.findOneBy({device_code: device_code})
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
            data: this.formatDevice(newDevice),
        }
    }

    async getDevicesByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<DeviceClassificationFlat>> {
        return getDataWithQueryAndPaginate({
            repository: this.deviceRepository,
            page: data.page,
            limit: data.limit,
            queryString: data.queryString,
            searchFields: data.searchFields?.split(','),
            columnsMeta: [
                { key: 'id', displayName: 'ID', type: 'number' },
                { key: 'device_code', displayName: 'Mã thiết bị', type: 'string' },
                { key: 'deviceType', displayName: 'Loại thiết bị', type: 'string' },
                { key: 'deviceStatus', displayName: 'Trạng thái', type: 'string' },
                { key: 'area', displayName: 'Khu vực', type: 'string' },
                { key: 'created_at', displayName: 'Thời điểm lắp đặt', type: 'date' },
            ],
        });
    }

    async findAllRaspberry() {
        const raspType = await this.deviceTypeRepository
            .createQueryBuilder('raspberry')
            .where('LOWER(raspberry.type_name) LIKE LOWER(:type_name)', {type_name: `%${DeviceEnum[DeviceEnum.Raspberry]}%`})
            .getOne()

        const raspberries = await this.deviceRepository.find({
            where: {
                deviceType: raspType
            }
        })

        raspberries.forEach((rasp, index) => {
            raspberries[index] = omitFields(rasp, ['image_url', 'created_at', 'updated_at', 'deleted_at'])
        })

        return raspberries
    }
}
