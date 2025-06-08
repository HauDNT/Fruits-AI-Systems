import {
    Controller,
    Get,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Query,
} from '@nestjs/common';
import {FruitClassificationService} from './fruit-classification.service';
import {CreateFruitClassificationDto} from './dto/create-fruit-classification.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import * as fs from 'fs/promises';
import {extname} from 'path';
import {plainToInstance} from 'class-transformer';
import {TableMetaData} from '@/interfaces/table';
import {FruitClassificationFlat} from '@/interfaces';
import {SocketGateway} from '@/gateway/socketGateway';

@Controller('fruit-classification')
export class FruitClassificationController {
    constructor(
        private readonly fruitClassificationService: FruitClassificationService,
        private readonly socketGateway: SocketGateway,
    ) {
    }

    @Post('create-classify')
    @UseInterceptors(
        FileInterceptor('classify_image', {
            storage: diskStorage({
                destination: async (req, file, callback) => {
                    const uploadPath = './uploads/images/results';
                    try {
                        await fs.mkdir(uploadPath, {recursive: true});
                        callback(null, uploadPath);
                    } catch (error) {
                        console.log('==> Lỗi tạo thư mục: ', error.message);
                        callback(
                            new Error('Không thể tạo thư mục lưu trữ ảnh kết quả phân loại'),
                            null,
                        );
                    }
                },
                filename(
                    req,
                    file: Express.Multer.File,
                    callback: (error: Error | null, filename: string) => void,
                ) {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
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
    async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
        if (!file) {
            throw new BadRequestException('Vui lòng gửi file ảnh');
        }

        if (!body.confidence_level || !body.result || !body.areaId) {
            throw new BadRequestException(
                'Thiếu thông tin bắt buộc: độ tin cậy, kết quả, khu vực',
            );
        }

        const createResultDto = plainToInstance(CreateFruitClassificationDto, {
            confidence_level: body.confidence_level,
            result: body.result,
            areaId: body.areaId,
        });

        const imageUrl = `/uploads/images/results/${file.filename}`;

        const createdRecord = await this.fruitClassificationService.create(
            createResultDto,
            imageUrl,
        );

        this.socketGateway.emitNewFruitClassification({
            id: createdRecord.id,
            confidence_level: createdRecord.confidence_level,
            fruit: createdRecord.fruit.fruit_name,
            fruitType: createdRecord.fruitType.type_name,
            area: `${createdRecord.areaClassify.area_code} - ${createdRecord.areaClassify.area_desc}`,
            image_url: imageUrl,
            created_at: createdRecord.created_at,
        });

        return createdRecord;
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
        });
    }
}
