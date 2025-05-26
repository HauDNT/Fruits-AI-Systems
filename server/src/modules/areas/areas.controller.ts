import {extname} from 'path';
import {DeleteResult} from "typeorm";
import * as fs from 'fs/promises';
import {diskStorage} from 'multer';
import {plainToInstance} from 'class-transformer';
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
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {AreasService} from './areas.service';
import {CreateAreaDto} from './dto/create-area.dto';
import {UpdateAreaDto} from './dto/update-area.dto';
import {TableMetaData} from "@/interfaces/table";
import {Area} from "@/modules/areas/entities/area.entity";
import {DeleteAreaDto} from "@/modules/areas/dto/delete-area.dto";

@Controller('areas')
export class AreasController {
    constructor(private readonly areasService: AreasService) {
    }

    @Post('create-area')
    @UseInterceptors(FileInterceptor('area_image', {
        storage: diskStorage({
            destination: async (req, file, callback) => {
                const uploadPath = './uploads/images/areas';
                try {
                    await fs.mkdir(uploadPath, {recursive: true});
                    callback(null, uploadPath);
                } catch (error) {
                    callback(new Error('Không thể tạo thư mục lưu trữ ảnh khu phân loại'), null);
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
        @Body() body: CreateAreaDto) {

        if (!file) {
            throw new BadRequestException('Vui lòng gửi file ảnh');
        }

        if (!body.area_desc) {
            throw new BadRequestException('Thiếu thông tin bắt buộc: mô tả');
        }

        const createAreaDto = plainToInstance(CreateAreaDto, {
            area_desc: body.area_desc,
        })
        const imageUrl = `/uploads/images/areas/${file.filename}`;

        return await this.areasService.create(createAreaDto, imageUrl);
    }

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
        })
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.areasService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
        return this.areasService.update(+id, updateAreaDto);
    }

    @Delete('/delete-areas')
    async deleteAreas(@Body() data: DeleteAreaDto): Promise<DeleteResult> {
        const {areaIds} = data
        return await this.areasService.deleteAreas(areaIds);
    }
}
