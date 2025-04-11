import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeviceStatusService } from './device-status.service';
import { CreateDeviceStatusDto } from './dto/create-device-status.dto';
import { UpdateDeviceStatusDto } from './dto/update-device-status.dto';

@Controller('device-status')
export class DeviceStatusController {
  constructor(private readonly deviceStatusService: DeviceStatusService) {}

  @Post()
  create(@Body() createDeviceStatusDto: CreateDeviceStatusDto) {
    return this.deviceStatusService.create(createDeviceStatusDto);
  }

  @Get()
  findAll() {
    return this.deviceStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceStatusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceStatusDto: UpdateDeviceStatusDto) {
    return this.deviceStatusService.update(+id, updateDeviceStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceStatusService.remove(+id);
  }
}
