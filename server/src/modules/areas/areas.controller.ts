import { extname } from 'path';
import { DeleteResult } from 'typeorm';
import * as fs from 'fs/promises';
import { diskStorage } from 'multer';
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { TableMetaData } from '@/interfaces/table';
import { Area } from '@/modules/areas/entities/area.entity';
import { DeleteAreaDto } from '@/modules/areas/dto/delete-area.dto';
import { UpdateAreaDto } from '@/modules/areas/dto/update-area.dto';
import { JWTGuard } from '@/authentication/jwt/jwt-guard';

@Controller('areas')
@UseGuards(JWTGuard)
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get('/all')
  async findAll() {
    return await this.areasService.findAll();
  }

  @Get()
  async getAreasByQuery(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
    @Query('searchFields') searchFields: string,
  ): Promise<TableMetaData<Area>> {
    return await this.areasService.getAreasByQuery({
      page,
      limit,
      queryString,
      searchFields,
    });
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('image_url', {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const uploadPath = './uploads/images/areas';
          try {
            await fs.mkdir(uploadPath, { recursive: true });
            callback(null, uploadPath);
          } catch (error) {
            callback(new Error('Không thể tạo thư mục lưu trữ ảnh khu phân loại'), null);
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
  async create(@UploadedFile() file: Express.Multer.File, @Body() createAreaDto: CreateAreaDto) {
    if (!file) {
      throw new BadRequestException('Vui lòng gửi file ảnh');
    }

    const imageUrl = `/uploads/images/areas/${file.filename}`;

    return await this.areasService.create(createAreaDto, imageUrl);
  }

  @Put('/update')
  @UseInterceptors(
    FileInterceptor('image_url', {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const uploadPath = './uploads/images/areas';
          try {
            await fs.mkdir(uploadPath, { recursive: true });
            callback(null, uploadPath);
          } catch (error) {
            callback(new Error('Không thể tạo thư mục lưu trữ ảnh khu phân loại'), null);
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
  async updateArea(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateAreaDto: UpdateAreaDto,
  ) {
    let imageUrl = null;
    if (file) {
      imageUrl = `/uploads/images/areas/${file.filename}`;
    }

    return await this.areasService.update(updateAreaDto, imageUrl);
  }

  @Delete('/delete')
  async deleteAreas(@Body() data: DeleteAreaDto): Promise<DeleteResult> {
    const { areaIds } = data;
    return await this.areasService.deleteAreas(areaIds);
  }
}
