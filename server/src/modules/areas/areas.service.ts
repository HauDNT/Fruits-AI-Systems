import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, In, IsNull, Like, Repository} from "typeorm";
import {CreateAreaDto} from './dto/create-area.dto';
import {TableMetaData} from "@/interfaces/table";
import {Area} from "@/modules/areas/entities/area.entity";
import {generateUniqueCode} from "@/utils/generateUniqueCode";
import {omitFields} from "@/utils/omitFields";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";

@Injectable()
export class AreasService {
    constructor(
        @InjectRepository(Area)
        private areaRepository: Repository<Area>,
    ) {
    }

    async create(createAreaDto: CreateAreaDto, imageUrl: string) {
        const {area_desc} = createAreaDto;

        const areaExist = await this.areaRepository
            .createQueryBuilder('ar')
            .where('LOWER(ar.area_desc) = LOWER(:area_desc)', {area_desc: area_desc})
            .getOne()

        if (areaExist) {
            throw new BadRequestException('Khu phân loại đã tồn tại!')
        }

        let areaCode: string;
        let areaCodeExist;

        do {
            areaCode = generateUniqueCode("Area", 6)
            areaCodeExist = await this.areaRepository.findOneBy({
                area_code: areaCode,
            });
        } while (areaCodeExist);

        const newArea = this.areaRepository.create({
            area_code: areaCode,
            area_desc,
            image_url: imageUrl,
            created_at: new Date(),
            updated_at: new Date(),
        })

        const saveArea = await this.areaRepository.save(newArea)

        return {
            message: 'Tạo khu phân loại thành công',
            data: saveArea,
        }
    }

    async findAll() {
        try {
            const areas = await this.areaRepository.find()

            areas.forEach((area, index) => {
                areas[index] = omitFields(area, ['image_url', 'created_at', 'updated_at', 'deleted_at'])
            })

            return areas
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy danh sách khu phân loại');
        }
    }

    async getAreasByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<Area>> {
        try {
            const {
                page,
                limit,
                queryString,
                searchFields,
            } = data;

            const skip = (page - 1) * limit;
            const take = limit;

            const where: any = {};
            where.deleted_at = IsNull();

            let searchConditions: any[] = [];
            if (queryString && searchFields) {
                const fields = searchFields.split(',').map((field) => field.trim());
                searchConditions = fields.map((field) => ({
                    ...where,
                    [field]: Like(`%${queryString}%`),
                }));
            }

            const [areas, total] = await this.areaRepository.findAndCount({
                where: searchConditions.length > 0 ? searchConditions : where,
                select: ['id', 'area_code', 'area_desc', 'created_at', 'updated_at'],
                skip,
                take,
            })

            const totalPages = Math.ceil(total / limit)

            return {
                "columns": [
                    {"key": "id", "displayName": "ID", "type": "number"},
                    {"key": "area_code", "displayName": "Mã khu", "type": "string"},
                    {"key": "area_desc", "displayName": "Mô tả", "type": "string"},
                    {"key": "created_at", "displayName": "Ngày tạo", "type": "date"},
                    {"key": "updated_at", "displayName": "Ngày thay đổi", "type": "date"},
                ],
                "values": areas,
                "meta": {
                    "totalItems": total,
                    "currentPage": page,
                    "totalPages": totalPages,
                    "limit": limit,
                },
            };
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy danh sách khu');
        }
    }

    async deleteAreas(areaIds: string[]): Promise<DeleteResult> {
        try {
            if (!Array.isArray(areaIds) || areaIds.length === 0) {
                throw new BadRequestException('Danh sách id khu phân loại không hợp lệ');
            }

            const areas = await this.areaRepository.find({
                where: {id: In(areaIds)},
            })

            if (areas.length !== areaIds.length) {
                throw new BadRequestException('Một hoặc nhiều khu phân loại không tồn tại');
            }

            for (const area of areas) {
                const fileAreaImgPath = path.join(process.cwd(), area.image_url)
                try {
                    await fs.unlink(fileAreaImgPath);
                } catch (error) {
                    console.error(`Error deleting file ${fileAreaImgPath}: `, error.message);
                }
            }

            return await this.areaRepository.delete(areaIds);
        } catch (e) {
            console.log('Error when delete areas: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình xoá khu phân loại');
        }
    }
}
