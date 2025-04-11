import { Injectable } from '@nestjs/common';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';

@Injectable()
export class DeviceTypesService {
  create(createDeviceTypeDto: CreateDeviceTypeDto) {
    return 'This action adds a new deviceType';
  }

  findAll() {
    return `This action returns all deviceTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deviceType`;
  }

  update(id: number, updateDeviceTypeDto: UpdateDeviceTypeDto) {
    return `This action updates a #${id} deviceType`;
  }

  remove(id: number) {
    return `This action removes a #${id} deviceType`;
  }
}
