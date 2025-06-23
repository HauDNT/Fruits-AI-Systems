import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { extname } from 'path';
import * as fs from 'fs/promises';
import { diskStorage } from 'multer';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TableMetaData } from '@/interfaces/table';
import { DeviceClassificationFlat } from '@/interfaces';
import { UpdateDeviceDto } from '@/modules/devices/dto/update-device.dto';
import { DeleteResult } from 'typeorm';
import { DeleteDeviceDto } from '@/modules/devices/dto/delete-device.dto';
import { JWTGuard } from '@/authentication/jwt/jwt-guard';

@Controller('devices')
@UseGuards(JWTGuard)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

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

  @Post('create')
  @UseInterceptors(
    FileInterceptor('device_image', {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const uploadPath = './uploads/images/devices';
          try {
            await fs.mkdir(uploadPath, { recursive: true });
            callback(null, uploadPath);
          } catch (error) {
            console.log('==> Lỗi tạo thư mục: ', error.message);
            callback(new Error('Không thể tạo thư mục lưu trữ ảnh thiết bị'), null);
          }
        },
        filename(
          req,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
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
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDeviceDto: CreateDeviceDto,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng gửi file ảnh');
    }
    const imageUrl = `/uploads/images/devices/${file.filename}`;

    return await this.devicesService.create(createDeviceDto, imageUrl);
  }

  @Put('/update/:device_id')
  @UseInterceptors(
    FileInterceptor('image_url', {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const uploadPath = './uploads/images/devices';
          try {
            await fs.mkdir(uploadPath, { recursive: true });
            callback(null, uploadPath);
          } catch (error) {
            console.log('==> Lỗi tạo thư mục: ', error.message);
            callback(new Error('Không thể tạo thư mục lưu trữ ảnh thiết bị'), null);
          }
        },
        filename(
          req,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
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
    }),
  )
  async updateDevice(
    @Param('device_id') device_id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    let imageUrl: string;

    if (file) {
      imageUrl = `/uploads/images/devices/${file.filename}`;
    }

    return await this.devicesService.updateDevice(device_id, updateDeviceDto, imageUrl);
  }

  @Delete('/delete')
  async deleteDevices(@Body() data: DeleteDeviceDto): Promise<DeleteResult | any> {
    const { deviceIds } = data;
    return await this.devicesService.deleteDevices(deviceIds);
  }
}
