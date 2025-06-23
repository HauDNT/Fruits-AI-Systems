import { Controller, Get, Post, Body, Delete, Query, UseGuards } from '@nestjs/common';
import { DeviceStatusService } from './device-status.service';
import { CreateDeviceStatusDto } from './dto/create-device-status.dto';
import { DeviceStatus } from '@/modules/device-status/entities/device-status.entity';
import { DeleteResult } from 'typeorm';
import { DeleteDeviceStatusDto } from '@/modules/device-status/dto/delete-device-status.dto';
import { TableMetaData } from '@/interfaces/table';
import { JWTGuard } from '@/authentication/jwt/jwt-guard';

@Controller('device-status')
@UseGuards(JWTGuard)
export class DeviceStatusController {
  constructor(private readonly deviceStatusService: DeviceStatusService) {}

  @Post('/create')
  async create(@Body() createDeviceStatusDto: CreateDeviceStatusDto) {
    return await this.deviceStatusService.create(createDeviceStatusDto);
  }

  @Get('/all')
  async findAll(): Promise<DeviceStatus[]> {
    return await this.deviceStatusService.findAll();
  }

  @Get()
  async getDeviceStatusesByQuery(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
    @Query('searchFields') searchFields: string,
  ): Promise<TableMetaData<DeviceStatus>> {
    return await this.deviceStatusService.getDeviceStatusesByQuery({
      page,
      limit,
      queryString,
      searchFields,
    });
  }

  @Delete('/delete')
  async deleteDevicesStatuses(@Body() data: DeleteDeviceStatusDto): Promise<DeleteResult> {
    const { statusIds } = data;
    return await this.deviceStatusService.deleteDevicesStatuses(statusIds);
  }
}
