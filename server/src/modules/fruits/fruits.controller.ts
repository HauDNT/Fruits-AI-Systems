import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';
import {FruitsService} from './fruits.service';
import {CreateFruitDto} from './dto/create-fruit.dto';
import {UpdateFruitDto} from './dto/update-fruit.dto';
import {TableMetaData} from "@/interfaces/table";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {DeleteFruitDto} from "./dto/delete-fruit.dto"
import {DeleteResult} from "typeorm";
import { plainToInstance } from 'class-transformer';
import * as fs from 'fs/promises';

@Controller('fruits')
export class FruitsController {
    constructor(
        private readonly fruitsService: FruitsService) {
    }

    @Post('create-fruit')
    @UseInterceptors(FileInterceptor('fruit_image', {
        storage: diskStorage({
            destination: async (req, file, callback) => {
                const uploadPath = './uploads/fruits';
                try {
                    await fs.mkdir(uploadPath, { recursive: true });
                    callback(null, uploadPath);
                } catch (error) {
                    callback(new Error('Không thể tạo thư mục lưu trữ ảnh trái cây'), null);
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
            fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
        },
    }))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any) {
        try {
            if (!file) {
                throw new BadRequestException('Vui lòng gửi file ảnh');
            }

            if (!body.fruit_name || !body.fruit_desc || !body.fruit_types) {
                throw new BadRequestException('Thiếu thông tin bắt buộc: fruit_name, fruit_desc, hoặc fruit_types');
            }

            // Parse fruit_types từ chuỗi JSON
            let fruitTypes: number[];
            try {
                fruitTypes = JSON.parse(body.fruit_types);
                if (!Array.isArray(fruitTypes) || fruitTypes.length === 0) {
                    throw new Error('fruit_types phải là một mảng không rỗng');
                }
            } catch (parseError) {
                throw new BadRequestException('fruit_types không hợp lệ, phải là mảng JSON');
            }

            // Tạo DTO và validate
            const createFruitDto = plainToInstance(CreateFruitDto, {
                fruit_name: body.fruit_name,
                fruit_desc: body.fruit_desc,
                fruit_types: fruitTypes,
            });

            const imageUrl = `/uploads/fruits/${file.filename}`;

            return await this.fruitsService.create(createFruitDto, imageUrl);
        } catch (error) {
            console.log('-> Error: ', error.message)

            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Lỗi khi thêm trái cây: ' + error.message);
        }
    }

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
        })
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.fruitsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFruitDto: UpdateFruitDto) {
        return this.fruitsService.update(+id, updateFruitDto);
    }

    @Delete('/delete-fruits')
    async deleteFruits(
        @Body() data: DeleteFruitDto
    ): Promise<DeleteResult> {
        const {fruitIds} = data
        return this.fruitsService.deleteFruits(fruitIds);
    }
}
