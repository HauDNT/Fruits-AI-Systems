import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateFruitDto} from './dto/create-fruit.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {DeleteResult, In, IsNull, Like, Repository} from "typeorm";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {TableMetaData} from "@/interfaces/table";
import {FruitImage} from "@/modules/fruit-images/entities/fruit-image.entity";
import * as fs from 'fs/promises';
import * as path from 'path';
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";

@Injectable()
export class FruitsService {
    constructor(
        @InjectRepository(Fruit)
        private fruitRepository: Repository<Fruit>,
        @InjectRepository(FruitType)
        private fruitTypeRepository: Repository<FruitType>,
        @InjectRepository(FruitImage)
        private fruitImageRepository: Repository<FruitImage>,
    ) {
    }

    async create(createFruitDto: CreateFruitDto, imageUrl: string) {
        const {fruit_name, fruit_desc, fruit_types} = createFruitDto

        const getFruitTypes = await this.fruitTypeRepository.findBy({id: In(fruit_types)});
        if (getFruitTypes.length !== fruit_types.length) {
            throw new BadRequestException('Trạng thái trái cây không chính xác')
        }

        const checkExistFruit = await this.fruitRepository
            .createQueryBuilder('fruitName')
            .where('LOWER(fruitName.fruit_name) = LOWER(:fruit_name)', {fruit_name: fruit_name})
            .getOne()

        if (checkExistFruit) {
            throw new BadRequestException('Trái cây đã tồn tại')
        }

        const newFruit = this.fruitRepository.create({
            fruit_name,
            fruit_desc,
            fruitTypes: getFruitTypes,
            created_at: new Date(),
            updated_at: new Date(),
        })
        const saveFruit = await this.fruitRepository.save(newFruit)

        const fruitImage = this.fruitImageRepository.create({
            fruit: saveFruit,
            image_url: imageUrl,
            created_at: new Date(),
            updated_at: new Date(),
        })
        await this.fruitImageRepository.save(fruitImage);

        return {
            message: 'Tạo trái cây thành công',
            data: saveFruit,
        };
    }

    async findAll(): Promise<Fruit[]> {
        return await this.fruitRepository.find();
    }

    async getFruitsByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<Fruit>> {
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

        const [fruits, total] = await this.fruitRepository.findAndCount({
            where: searchConditions.length > 0 ? searchConditions : where,
            select: ['id', 'fruit_name', 'fruit_desc', 'created_at', 'updated_at'],
            skip,
            take,
        })

        const totalPages = Math.ceil(total / limit);

        return {
            "columns": [
                {"key": "id", "displayName": "ID", "type": "number"},
                {"key": "fruit_name", "displayName": "Tên trái cây", "type": "string"},
                {"key": "fruit_desc", "displayName": "Mô tả", "type": "string"},
                {"key": "created_at", "displayName": "Ngày tạo", "type": "date"},
                {"key": "updated_at", "displayName": "Ngày thay đổi", "type": "date"},
            ],
            "values": fruits,
            "meta": {
                "totalItems": total,
                "currentPage": page,
                "totalPages": totalPages,
                "limit": limit,
            },
        };
    }

    async deleteFruits(fruitIds: string[]): Promise<DeleteResult> {
        if (!Array.isArray(fruitIds) || fruitIds.length === 0) {
            throw new BadRequestException('Danh sách id trái cây không hợp lệ');
        }

        const fruits = await this.fruitRepository.find({
            where: { id: In(fruitIds) },
            relations: ['fruitImages'],
        });

        if (fruits.length !== fruitIds.length) {
            throw new BadRequestException('Một hoặc nhiều trái cây không tồn tại');
        }

        const fruitImages = await this.fruitImageRepository.find({
            where: { fruit: { id: In(fruitIds) } },
        });

        for (const fruitImage of fruitImages) {
            const filePath = path.join(process.cwd(), fruitImage.image_url);
            try {
                await fs.unlink(filePath);
                console.log(`Deleted file: ${filePath}`);
            } catch (error) {
                console.error(`Error deleting file ${filePath}: `, error.message);
            }
        }

        await this.fruitImageRepository.delete({ fruit: { id: In(fruitIds) } });

        return await this.fruitRepository.delete(fruitIds);
    }
}
