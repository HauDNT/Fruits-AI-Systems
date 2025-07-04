import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FruitsService } from './fruits.service';
import { CreateFruitDto } from './dto/create-fruit.dto';
import { TableMetaData } from '@/interfaces/table';
import { Fruit } from '@/modules/fruits/entities/fruit.entity';
import { DeleteFruitDto } from './dto/delete-fruit.dto';
import { DeleteResult } from 'typeorm';
import * as fs from 'fs/promises';
import { UpdateFruitDto } from '@/modules/fruits/dto/update-fruit.dto';
import { JWTGuard } from '@/authentication/jwt/jwt-guard';

@Controller('fruits')
@UseGuards(JWTGuard)
export class FruitsController {
  constructor(private readonly fruitsService: FruitsService) {}

  @Get('/all')
  async findAll() {
    return await this.fruitsService.findAll();
  }

  @Get()
  async getFruitsByQuery(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('queryString') queryString: string,
    @Query('searchFields') searchFields: string,
  ): Promise<TableMetaData<Fruit>> {
    return await this.fruitsService.getFruitsByQuery({
      page,
      limit,
      queryString,
      searchFields,
    });
  }

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('fruit_image', 5, {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const uploadPath = './uploads/images/fruits';
          try {
            await fs.mkdir(uploadPath, { recursive: true });
            callback(null, uploadPath);
          } catch (error) {
            callback(new Error('Không thể tạo thư mục lưu trữ ảnh trái cây'), null);
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
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createFruitDto: CreateFruitDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Vui lòng gửi ít nhất 1 file ảnh');
    }

    if (!createFruitDto.fruit_types) {
      throw new BadRequestException('Không tìm thấy dữ liệu về tình trạng trái cây từ kết quả');
    }

    const imageUrls = files.map((file) => `/uploads/images/fruits/${file.filename}`);

    return await this.fruitsService.create(createFruitDto, imageUrls);
  }

  @Put('/update/:fruit_id')
  @UseInterceptors(
    FilesInterceptor('fruit_image', 5, {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const uploadPath = './uploads/images/fruits';
          try {
            await fs.mkdir(uploadPath, { recursive: true });
            callback(null, uploadPath);
          } catch (error) {
            callback(new Error('Không thể tạo thư mục lưu trữ ảnh trái cây'), null);
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
  async updateFruit(
    @Param('fruit_id') fruit_id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: UpdateFruitDto,
  ): Promise<any> {
    let imageUrls: string[];

    if (files && files.length > 0) {
      imageUrls = files.map((file) => `/uploads/images/fruits/${file.filename}`);
    }

    return await this.fruitsService.updateFruit(fruit_id, data, imageUrls);
  }

  @Delete('/delete')
  async deleteFruits(@Body() data: DeleteFruitDto): Promise<DeleteResult> {
    const { fruitIds } = data;
    return await this.fruitsService.deleteFruits(fruitIds);
  }
}
