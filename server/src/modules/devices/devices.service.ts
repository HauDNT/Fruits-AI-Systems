import * as path from 'path';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '@/modules/devices/entities/device.entity';
import { DeviceStatus } from '@/modules/device-status/entities/device-status.entity';
import { DeviceType } from '@/modules/device-types/entities/device-type.entity';
import { Area } from '@/modules/areas/entities/area.entity';
import { generateUniqueCode } from '@/utils/generateUniqueCode';
import { DeviceEnum } from '@/database/enums/DeviceEnum';
import { omitFields } from '@/utils/omitFields';
import { GetDataWithQueryParamsDTO } from '@/modules/dtoCommons';
import { DeviceClassificationFlat } from '@/interfaces';
import { TableMetaData } from '@/interfaces/table';
import { deleteFile, deleteFilesInParallel } from '@/utils/handleFiles';
import { UpdateDeviceDto } from '@/modules/devices/dto/update-device.dto';
import { validateAndGetEntitiesByIds } from '@/utils/validateAndGetEntitiesByIds';

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
  ) {}

  formatDevice(device: Device): DeviceClassificationFlat {
    return {
      id: device.id,
      device_code: device.device_code,
      image_url: device.image_url,
      deviceType: device.deviceType.type_name,
      deviceStatus: device.deviceStatus.status_name,
      area: device.areaBelong.area_desc,
      created_at: device.created_at,
      updated_at: device.updated_at,
    };
  }

  async getDevicesByQuery(
    data: GetDataWithQueryParamsDTO,
  ): Promise<TableMetaData<DeviceClassificationFlat>> {
    const { page, limit, queryString, searchFields } = data;

    const skip = (page - 1) * limit;
    const take = limit;

    const query = this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.deviceType', 'deviceType')
      .leftJoinAndSelect('device.deviceStatus', 'deviceStatus')
      .leftJoinAndSelect('device.areaBelong', 'areaBelong')
      .where('device.deleted_at IS NULL');

    if (queryString && searchFields) {
      const fields = searchFields.split(',').map((f) => f.trim());

      const conditions = fields
        .map((field) => {
          if (field === 'device_code') return 'device.device_code LIKE :query';
          if (field === 'deviceType') return 'deviceType.type_name LIKE :query';
          if (field === 'deviceStatus') return 'deviceStatus.status_name LIKE :query';
          if (field === 'areaBelong') {
            return '(areaBelong.area_code LIKE :query OR areaBelong.area_desc LIKE :query)';
          }
          if (field === 'areaDesc') return 'areaBelong.area_desc LIKE :query';
          return `device.${field} LIKE :query`;
        })
        .join(' OR ');

      query.andWhere(`(${conditions})`, { query: `%${queryString}%` });
    }

    const [results, total] = await query.skip(skip).take(take).getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    const formatResult: DeviceClassificationFlat[] = results.map((device) =>
      this.formatDevice(device),
    );

    return {
      columns: [
        { key: 'id', displayName: 'ID', type: 'number' },
        { key: 'device_code', displayName: 'Mã thiết bị', type: 'string' },
        { key: 'deviceType', displayName: 'Loại thiết bị', type: 'string' },
        { key: 'deviceStatus', displayName: 'Trạng thái', type: 'string' },
        { key: 'area', displayName: 'Khu vực', type: 'string' },
        { key: 'created_at', displayName: 'Thời điểm lắp đặt', type: 'date' },
        { key: 'updated_at', displayName: 'Thời điểm cập nhật', type: 'date' },
      ],
      values: formatResult,
      meta: {
        totalItems: total,
        currentPage: page,
        totalPages,
        limit,
      },
    };
  }

  async findAllRaspberry() {
    const raspType = await this.deviceTypeRepository
      .createQueryBuilder('raspberry')
      .where('LOWER(raspberry.type_name) LIKE LOWER(:type_name)', {
        type_name: `%${DeviceEnum[DeviceEnum.Raspberry]}%`,
      })
      .getOne();

    const raspberries = await this.deviceRepository.find({
      where: {
        deviceType: raspType,
      },
    });

    raspberries.forEach((rasp, index) => {
      raspberries[index] = omitFields(rasp, [
        'image_url',
        'created_at',
        'updated_at',
        'deleted_at',
      ]);
    });

    return raspberries;
  }

  async create(createDeviceDto: CreateDeviceDto, image_url: string) {
    let isCreateSuccess = false;
    const allowedDuplicateDevices = ['VL53L0X', 'Webcam'];
    const { type_id, status_id, area_id } = createDeviceDto;
    const areaBelong = await this.areaRepository.findOneBy({ id: area_id });
    const deviceType = await this.deviceTypeRepository.findOneBy({ id: type_id });
    const deviceStatus = await this.deviceStatusRepository.findOneBy({ id: status_id });

    try {
      if (!areaBelong || !deviceType || !deviceStatus) {
        throw new BadRequestException(
          'Khu phân loại, trạng thái thiết bị hoặc loại thiết bị không tồn tại',
        );
      }

      const existDevice = await this.deviceRepository.findOne({
        where: {
          deviceType: { id: deviceType.id },
          areaBelong: { id: areaBelong.id },
        },
      });

      if (existDevice && !allowedDuplicateDevices.includes(deviceType.type_name)) {
        throw new BadRequestException('Thiết bị đã tồn tại');
      }

      let device_code: string;
      let deviceCodeExist;

      do {
        device_code = generateUniqueCode('Device', 6);
        deviceCodeExist = await this.deviceRepository.findOneBy({ device_code: device_code });
      } while (deviceCodeExist);

      const newDevice = await this.deviceRepository.create({
        device_code,
        image_url,
        deviceType,
        deviceStatus,
        areaBelong,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await this.deviceRepository.save(newDevice);
      isCreateSuccess = true;

      return {
        message: 'Tạo thiết bị mới thành công',
        data: this.formatDevice(newDevice),
      };
    } finally {
      if (!isCreateSuccess && image_url) {
        await deleteFile(image_url);
      }
    }
  }

  async updateDevice(device_id: number, data: UpdateDeviceDto, imageUrl?: string): Promise<any> {
    try {
      const { area: areaId, deviceStatus: statusId } = data;
      const device = await this.deviceRepository.findOne({
        where: { id: device_id },
        relations: {
          areaBelong: true,
          deviceStatus: true,
          deviceType: true,
        },
      });

      if (!device) {
        throw new NotFoundException('Không tìm thấy thiết bị');
      }

      const area = await this.areaRepository.findOneBy({ id: +areaId });
      const status = await this.deviceStatusRepository.findOneBy({ id: +statusId });

      if (!area || !status) {
        throw new BadRequestException('Khu vực hoặc trạng thái không hợp lệ');
      }

      device.areaBelong = area;
      device.deviceStatus = status;

      if (imageUrl) {
        await deleteFile(device.image_url);
        device.image_url = imageUrl;
      }

      await this.deviceRepository.save(device);
      return this.formatDevice(device);
    } catch (e) {
      if (imageUrl) {
        await deleteFile(imageUrl);
      }
      throw e;
    }
  }

  async deleteDevices(deviceIds: string[]): Promise<DeleteResult | any> {
    const devices = await validateAndGetEntitiesByIds(this.deviceRepository, deviceIds);

    const saveDelete = await this.deviceRepository.delete(deviceIds);
    const imageDevices = devices.map((device) => path.join(process.cwd(), device.image_url));
    await deleteFilesInParallel(imageDevices);

    return saveDelete;
  }
}
