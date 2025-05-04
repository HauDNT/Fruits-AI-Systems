import {Controller, Get, Post, Body, Param, Query, HttpException, HttpStatus} from '@nestjs/common';
import {RaspberryService} from './raspberry.service';
import {RaspberryConfigDto} from "@/modules/raspberry/dto/raspberry-config.dto";
@Controller('raspberry')
export class RaspberryController {
    constructor(private readonly raspberryService: RaspberryService) {
    }

    @Get('/raspberry-fruit-types')
    async getRaspFruitTypesMap() {
        return await this.raspberryService.getAvailableMapIds()
    }

    @Get('/config/:device_code')
    async getConfigByRaspCode(
        @Param('device_code') device_code: string,
        @Query('isParseJSON') isParseJSON: string
    ) {
        const parseJSON = isParseJSON === 'true';
        const config = await this.raspberryService.getConfigByDeviceId(device_code, parseJSON);

        if (!config) {
            throw new HttpException('Không tìm thấy cấu hình cho thiết bị này', HttpStatus.NOT_FOUND);
        }
        return config;
    }

    @Post('/generate-token')
    async getRaspberryAccessToken(
        @Body('device_code') device_code: string
    ) {
        if (!device_code) {
            throw new HttpException('Device code của Raspberry là bắt buộc', HttpStatus.BAD_REQUEST)
        }

        return await this.raspberryService.getRaspberryAccessToken(device_code)
    }

    @Post('/update-config')
    async updateRaspberryConfig(
        @Body() data: RaspberryConfigDto
    ) {
        return await this.raspberryService.updateRaspberryConfig(data)
    }
}
