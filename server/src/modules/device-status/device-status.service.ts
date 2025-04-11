import { Injectable } from '@nestjs/common';
import { CreateDeviceStatusDto } from './dto/create-device-status.dto';
import { UpdateDeviceStatusDto } from './dto/update-device-status.dto';

@Injectable()
export class DeviceStatusService {
  create(createDeviceStatusDto: CreateDeviceStatusDto) {
    return 'This action adds a new deviceStatus';
  }

  findAll() {
    return `This action returns all deviceStatus`;
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
