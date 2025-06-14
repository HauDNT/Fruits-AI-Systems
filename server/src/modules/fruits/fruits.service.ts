import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFruitDto } from './dto/create-fruit.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Fruit } from "@/modules/fruits/entities/fruit.entity";
import { DataSource, DeleteResult, In, IsNull, Like, QueryRunner, Repository } from "typeorm";
import { FruitType } from "@/modules/fruit-types/entities/fruit-type.entity";
import { TableMetaData } from "@/interfaces/table";
import { FruitImage } from "@/modules/fruit-images/entities/fruit-image.entity";
import * as path from 'path';
import { GetDataWithQueryParamsDTO } from "@/modules/dtoCommons";
import { FruitClassification } from "@/modules/fruit-classification/entities/fruit-classification.entity";
import { deleteFile, deleteFilesInParallel } from "@/utils/handleFiles";
import { deleteRelationsEntityData } from "@/utils/deleteRelationsEntityData";
import { getDataWithQueryAndPaginate } from "@/utils/paginateAndSearch";
import { validateAndGetEntitiesByIds } from "@/utils/validateAndGetEntitiesByIds";

@Injectable()
export class FruitsService {
    constructor(
        @InjectRepository(Fruit)
        private readonly fruitRepository: Repository<Fruit>,
        @InjectRepository(FruitType)
        private readonly fruitTypeRepository: Repository<FruitType>,
        @InjectRepository(FruitImage)
        private readonly fruitImageRepository: Repository<FruitImage>,
        @InjectRepository(FruitClassification)
        private readonly fruitClassificationRepository: Repository<FruitClassification>,
        private readonly dataSource: DataSource,
    ) {
    }

    private extractFilePathsFromFruits(fruits: Fruit[]): string[] {
        return fruits.flatMap(fruit =>
            fruit.fruitImages?.map(image => path.join(process.cwd(), image.image_url))
        ) || []
    }

    async create(createFruitDto: CreateFruitDto, imageUrls: string[]) {
        const { fruit_name, fruit_desc, fruit_types } = createFruitDto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const getFruitTypes = await queryRunner.manager.find(FruitType);
            if (getFruitTypes.length !== fruit_types.length) {
                throw new BadRequestException('Trạng thái trái cây không chính xác')
            }

            const checkExistFruit = await queryRunner.manager
                .createQueryBuilder(Fruit, 'fruitName')
                .where('LOWER(fruitName.fruit_name) = LOWER(:fruit_name)', { fruit_name })
                .getOne();

            if (checkExistFruit) {
                throw new BadRequestException('Trái cây đã tồn tại');
            }

            const newFruit = queryRunner.manager.create(Fruit, {
                fruit_name,
                fruit_desc,
                fruitTypes: getFruitTypes,
                created_at: new Date(),
                updated_at: new Date(),
            });
            const saveFruit = await queryRunner.manager.save(Fruit, newFruit);

            if (imageUrls.length > 0) {
                const fruitImages = imageUrls.map(imageUrl =>
                    queryRunner.manager.create(FruitImage, {
                        fruit: saveFruit,
                        image_url: imageUrl,
                        created_at: new Date(),
                        updated_at: new Date(),
                    }));

                await queryRunner.manager.save(FruitImage, fruitImages);
            }

            await queryRunner.commitTransaction();

            return {
                message: 'Tạo trái cây thành công',
                data: saveFruit,
            };
        } catch (e) {
            if (Array.isArray(imageUrls)) {
                imageUrls.forEach(imageUrl => deleteFile(imageUrl));
            }
            await queryRunner.rollbackTransaction();
            throw new BadRequestException('Xảy ra lỗi khi thêm trái cây mới');
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(): Promise<Fruit[]> {
        return await this.fruitRepository.find();
    }

    async getFruitsByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<Fruit>> {
        return getDataWithQueryAndPaginate({
            repository: this.fruitRepository,
            page: data.page,
            limit: data.limit,
            queryString: data.queryString,
            searchFields: data.searchFields?.split(','),
            selectFields: ['id', 'fruit_name', 'fruit_desc', 'created_at', 'updated_at'],
            columnsMeta: [
                { "key": "id", "displayName": "ID", "type": "number" },
                { "key": "fruit_name", "displayName": "Tên trái cây", "type": "string" },
                { "key": "fruit_desc", "displayName": "Mô tả", "type": "string" },
                { "key": "created_at", "displayName": "Ngày tạo", "type": "date" },
                { "key": "updated_at", "displayName": "Ngày thay đổi", "type": "date" },
            ],
        });
    }

    async deleteFruits(fruitIds: string[]): Promise<DeleteResult> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let fruitImagePaths: string[] = [];

        try {
            const fruits = await queryRunner.manager.find(Fruit, {
                where: { id: In(fruitIds) },
                relations: ['fruitImages'],
            });

            if (fruits.length !== fruitIds.length) {
                throw new BadRequestException('Một hoặc nhiều trái cây không tồn tại');
            }

            fruitImagePaths = this.extractFilePathsFromFruits(fruits);

            await deleteRelationsEntityData(queryRunner, fruitIds, [
                { entity: FruitImage, relationField: 'fruit' },
                { entity: FruitClassification, relationField: 'fruit' },
            ]);

            const deleteFruit = await queryRunner.manager.delete(Fruit, fruitIds);

            await queryRunner.commitTransaction();

            await deleteFilesInParallel(fruitImagePaths);

            return deleteFruit;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Xoá trái cây thất bại: ' + error.message);
        } finally {
            await queryRunner.release();
        }
    }
}
