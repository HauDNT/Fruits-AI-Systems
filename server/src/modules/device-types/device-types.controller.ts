import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { DeviceTypesService } from './device-types.service';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { TableMetaData } from '@/interfaces/table';
import { DeviceType } from '@/modules/device-types/entities/device-type.entity';
import { DeleteResult } from 'typeorm';
import { DeleteDeviceTypeDto } from '@/modules/device-types/dto/delete-device-type.dto';

@Controller('device-types')
export class DeviceTypesController {
  constructor(private readonly deviceTypesService: DeviceTypesService) {}

  @Post('/create')
  async create(@Body() createDeviceTypeDto: CreateDeviceTypeDto) {
    return await this.deviceTypesService.create(createDeviceTypeDto);
  }

  @Get('/all')
  async findAll() {
    return await this.deviceTypesService.findAll();
  }

  @Get()
  async getDeviceTypesByQuery(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
    @Query('searchFields') searchFields: string,
  ): Promise<TableMetaData<DeviceType>> {
    return await this.deviceTypesService.getDeviceTypesByQuery({
      page,
      limit,
      queryString,
      searchFields,
    });
  }

  @Delete('/delete')
  async deleteDeviceTypes(@Body() data: DeleteDeviceTypeDto): Promise<DeleteResult> {
    const { typeIds } = data;
    return await this.deviceTypesService.deleteDeviceTypes(typeIds);
  }
}
