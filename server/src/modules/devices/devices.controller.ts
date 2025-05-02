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
    HttpException, InternalServerErrorException, BadRequestException
} from '@nestjs/common';
import {DevicesService} from './devices.service';
import {CreateDeviceDto} from './dto/create-device.dto';
import {UpdateDeviceDto} from './dto/update-device.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import * as fs from 'fs/promises';
import {extname} from "path";
import {plainToInstance} from "class-transformer";

@Controller('devices')
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {
    }

    @Post('create-device')
    @UseInterceptors(FileInterceptor('device_image', {
        storage: diskStorage({
            destination: async (req, file, callback) => {
                const uploadPath = './uploads/devices';
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
        // @Body() createDeviceDto: CreateDeviceDto
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
            const imageUrl = `uploads/devices/${file.filename}`

            const createdResult = await this.devicesService.create(createDeviceDto, imageUrl)

            // this.classifyGateway
            /*
            {
              "message": "Tạo thiết bị mới thành công",
              "data": {
                "device_code": "#DV-6TN2I2",
                "image_url": "",
                "created_at": "2025-05-02T04:40:07.300Z",
                "updated_at": "2025-05-02T04:40:07.300Z",
                "deviceType": {
                  "id": 1,
                  "type_name": "Băng chuyền",
                  "created_at": "2025-05-02T04:06:05.880Z",
                  "updated_at": "2025-05-02T04:06:05.880Z",
                  "deleted_at": null
                },
                "deviceStatus": {
                  "id": 1,
                  "status_name": "Hoạt động",
                  "created_at": "2025-05-02T04:16:20.841Z",
                  "updated_at": "2025-05-02T04:16:20.841Z",
                  "deleted_at": null
                },
                "areaBelong": {
                  "id": 9,
                  "area_code": "#AR-0IWG9H",
                  "area_desc": "Khu phân loại số 5",
                  "image_url": "/uploads/areas/area_image-1745572734306-321321490.jpg",
                  "created_at": "2025-04-25T09:18:54.309Z",
                  "updated_at": "2025-04-25T09:18:54.309Z",
                  "deleted_at": null
                },
                "id": 1,
                "deleted_at": null
              }
            }
            */

            return createdResult
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo thiết bị mới');
        }
    }

    @Get()
    findAll() {
        return this.devicesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.devicesService.findOne(+id);
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
