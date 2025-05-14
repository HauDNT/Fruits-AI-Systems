import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    HttpException, InternalServerErrorException, BadRequestException, Query
} from '@nestjs/common';
import {DevicesService} from './devices.service';
import {CreateDeviceDto} from './dto/create-device.dto';
import {UpdateDeviceDto} from './dto/update-device.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import * as fs from 'fs/promises';
import {extname} from "path";
import {plainToInstance} from "class-transformer";
import {TableMetaData} from "@/interfaces/table";
import {DeviceClassificationFlat} from "@/interfaces";

@Controller('devices')
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {
    }

    @Post('create-device')
    @UseInterceptors(FileInterceptor('device_image', {
        storage: diskStorage({
            destination: async (req, file, callback) => {
                const uploadPath = './uploads/images/devices';
                try {
                    await fs.mkdir(uploadPath, {recursive: true});
                    callback(null, uploadPath);
                } catch (error) {
                    console.log('==> Lỗi tạo thư mục: ', error.message)
                    callback(new Error('Không thể tạo thư mục lưu trữ ảnh thiết bị'), null);
                }
            },
            filename(req, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    }))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ) {
        try {
            if (!file) {
                throw new BadRequestException('Vui lòng gửi file ảnh');
            }

            if (!body.type_id || !body.status_id || !body.area_id) {
                throw new BadRequestException('Thiếu thông tin bắt buộc: khu vực, trạng thái, loại thiết bị');
            }

            const createDeviceDto = plainToInstance(CreateDeviceDto, {
                type_id: body.type_id,
                status_id: body.status_id,
                area_id: body.area_id,
            })
            const imageUrl = `uploads/images/devices/${file.filename}`

            return await this.devicesService.create(createDeviceDto, imageUrl)
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo thiết bị mới');
        }
    }

    @Get()
    async getDevicesByQuery(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('queryString') queryString: string,
        @Query('searchFields') searchFields: string,
    ): Promise<TableMetaData<DeviceClassificationFlat>> {
        return await this.devicesService.getDevicesByQuery({
            page,
            limit,
            queryString,
            searchFields,
        });
    }

    @Get('/raspberry-all')
    async findAllRaspberry() {
        return await this.devicesService.findAllRaspberry();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
        return this.devicesService.update(+id, updateDeviceDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.devicesService.remove(+id);
    }
}
