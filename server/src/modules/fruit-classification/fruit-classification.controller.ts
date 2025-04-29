import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpException,
    InternalServerErrorException, UseInterceptors, UploadedFile, BadRequestException, Query
} from '@nestjs/common';
import {FruitClassificationService} from './fruit-classification.service';
import {CreateFruitClassificationDto} from './dto/create-fruit-classification.dto';
import {UpdateFruitClassificationDto} from './dto/update-fruit-classification.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import * as fs from 'fs/promises';
import {extname} from "path";
import {plainToInstance} from "class-transformer";
import {TableMetaData} from "@/interfaces/table";
import {FruitClassification} from "@/modules/fruit-classification/entities/fruit-classification.entity";
import {FruitClassificationFlat} from "@/interfaces";

@Controller('fruit-classification')
export class FruitClassificationController {
    constructor(private readonly fruitClassificationService: FruitClassificationService) {
    }

    @Post('create-classify')
    @UseInterceptors(FileInterceptor('classify_image', {
        storage: diskStorage({
            destination: async (req, file, callback) => {
                const uploadPath = './uploads/results';
                try {
                    await fs.mkdir(uploadPath, { recursive: true });
                    callback(null, uploadPath);
                } catch (error) {
                    console.log('==> Lỗi tạo thư mục: ', error.message)
                    callback(new Error('Không thể tạo thư mục lưu trữ ảnh kết quả phân loại'), null);
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
        console.log('File received in handler:', file);
        console.log('Body received:', body);

        try {
            if (!file) {
                throw new BadRequestException('Vui lòng gửi file ảnh');
            }

            if (!body.confidence_level || !body.fruitId || !body.areaId || !body.batchId || !body.typeId) {
                throw new BadRequestException('Thiếu thông tin bắt buộc: độ tin cậy, trái cây, khu vực, lô, tình trạng');
            }

            const createResultDto = plainToInstance(CreateFruitClassificationDto, {
                confidence_level: body.confidence_level,
                fruitId: body.fruitId,
                areaId: body.areaId,
                batchId: body.batchId,
                typeId: body.typeId,
            })

            const imageUrl = `/uploads/results/${file.filename}`;

            return await this.fruitClassificationService.create(createResultDto, imageUrl)
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo kết quả phân loại');
        }
    }

    @Get('/all')
    async findAll() {
        return await this.fruitClassificationService.findAll();
    }

    @Get()
    async getClassifyByQuery(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('queryString') queryString: string,
        @Query('searchFields') searchFields: string,
    ): Promise<TableMetaData<FruitClassificationFlat>> {
        return await this.fruitClassificationService.getClassifyByQuery({
            page,
            limit,
            queryString,
            searchFields,
        })
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.fruitClassificationService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFruitClassificationDto: UpdateFruitClassificationDto) {
        return this.fruitClassificationService.update(+id, updateFruitClassificationDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.fruitClassificationService.remove(+id);
    }
}
