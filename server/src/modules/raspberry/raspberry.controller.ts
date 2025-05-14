import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    HttpException,
    HttpStatus,
    UseInterceptors,
    BadRequestException, UploadedFile
} from '@nestjs/common';
import {RaspberryService} from './raspberry.service';
import {RaspberryConfigDto} from "@/modules/raspberry/dto/raspberry-config.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from 'multer';
import {extname} from 'path';
import {SocketGateway} from "@/gateway/socketGateway";
import * as dayjs from "dayjs";

@Controller('raspberry')
export class RaspberryController {
    constructor(
        private readonly raspberryService: RaspberryService,
        private readonly socketGateway: SocketGateway,
    ) {
    }

    @Get('/raspberry-fruit-types')
    async getRaspFruitTypesMap() {
        return await this.raspberryService.getAvailableMapIds()
    }

    @Get('/config')
    async getConfigByRaspCode(
        @Query('device_code') device_code: string,
        @Query('isRaspberry') isRaspberry: string
    ) {
        const parseIsRaspberry = isRaspberry === 'true';
        const config = await this.raspberryService.getConfigByRaspCode(device_code, parseIsRaspberry);

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
    @UseInterceptors(FileInterceptor('raspberry_model', {
        storage: diskStorage({
            destination: './uploads/models',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now();
                const fileExt = extname(file.originalname);
                cb(null, `model_${uniqueSuffix}${fileExt}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.endsWith('.tflite')) {
                return cb(new BadRequestException('Chỉ được phép upload file .tflite'), false)
            }
            cb(null, true)
        }
    }))
    async updateRaspberryConfig(
        @UploadedFile() file: Express.Multer.File,
        @Body() data: RaspberryConfigDto
    ) {
        const modelPath = file ? `/uploads/models/${file.filename}` : null
        const {upsertConfig, configData} = await this.raspberryService.updateRaspberryConfig(data, modelPath)
        const formatConfigData = {
            ...configData,
            updatedAt: dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss'),
        }

        this.socketGateway.emitNewConfigurationToRaspberry(data.device_code, formatConfigData)

        return {
            success: true,
            message: `Đã gửi config đến Raspberry ${data.device_code}`
        }
    }
}
