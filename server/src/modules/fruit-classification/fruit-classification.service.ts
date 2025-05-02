import {HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateFruitClassificationDto} from './dto/create-fruit-classification.dto';
import {UpdateFruitClassificationDto} from './dto/update-fruit-classification.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {FruitClassification} from "@/modules/fruit-classification/entities/fruit-classification.entity";
import { Repository} from "typeorm";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {Area} from "@/modules/areas/entities/area.entity";
import {FruitBatch} from "@/modules/fruit-batches/entities/fruit-batch.entity";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {TableMetaData} from "@/interfaces/table";
import {GetClassifyQueryParamsDto} from "@/modules/fruit-classification/dto/get-classify-query-params.dto";
import {FruitClassificationFlat} from "@/interfaces";

@Injectable()
export class FruitClassificationService {
    constructor(
        @InjectRepository(FruitClassification)
        private fruitClassificationRepository: Repository<FruitClassification>,
        @InjectRepository(Fruit)
        private fruitRepository: Repository<Fruit>,
        @InjectRepository(FruitType)
        private fruitTypeRepository: Repository<FruitType>,
        @InjectRepository(Area)
        private areaRepository: Repository<Area>,
        @InjectRepository(FruitBatch)
        private fruitBatchRepository: Repository<FruitBatch>,
    ) {
    }

    async create(createFruitClassificationDto: CreateFruitClassificationDto, imageUrl: string) {
        try {
            const {
                confidence_level,
                fruitId,
                areaId,
                batchId,
                typeId,
            } = createFruitClassificationDto

            const fruit = await this.fruitRepository.findOneBy({ id: fruitId })
            const type = await this.fruitTypeRepository.findOneBy({ id: typeId })
            const area = await this.areaRepository.findOneBy({ id: areaId })
            const batch = await this.fruitBatchRepository.findOneBy({ id: batchId })

            let newClassifyResult = this.fruitClassificationRepository.create({
                confidence_level,
                fruit,
                areaBelong: area,
                fruitBatchBelong: batch,
                image_url: imageUrl,
                fruitType: type,
                created_at: new Date(),
            })

            await this.fruitClassificationRepository.save(newClassifyResult)

            newClassifyResult = await this.fruitClassificationRepository.findOne({
                where: {id: newClassifyResult.id},
                relations: ['fruit', 'fruitType', 'areaBelong', 'fruitBatchBelong']
            })

            return newClassifyResult
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo trái cây');
        }
    }

    async findAll(): Promise<FruitClassification[]> {
        try {
            return await this.fruitClassificationRepository.find();
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình lấy danh sách trái cây');
        }
    }

    async getClassifyByQuery(data: GetClassifyQueryParamsDto): Promise<TableMetaData<FruitClassificationFlat>> {
        const {
            page = 1,
            limit = 10,
            queryString = '',
            searchFields = '',
        } = data;

        const skip = (page - 1) * limit;
        const take = limit;

        const query = this.fruitClassificationRepository
            .createQueryBuilder('fc')
            .leftJoinAndSelect('fc.fruit', 'fruit')
            .leftJoinAndSelect('fc.fruitType', 'fruitType')
            .leftJoinAndSelect('fc.areaBelong', 'areaBelong')
            .leftJoinAndSelect('fc.fruitBatchBelong', 'fruitBatchBelong')
            .where('fc.deleted_at IS NULL')
            .addOrderBy('fc.created_at', 'DESC')

        if (queryString && searchFields) {
            const fields = searchFields.split(',').map(f => f.trim());

            const conditions = fields.map(field => {
                if (field === 'fruit') return 'fruit.fruit_name LIKE :query';
                if (field === 'areaBelong') return 'areaBelong.area_code LIKE :query';
                if (field === 'fruitBatchBelong') return 'fruitBatchBelong.batch_code LIKE :query';
                return `fc.${field} LIKE :query`;
            }).join(' OR ');

            query.andWhere(`(${conditions})`, { query: `%${queryString}%` });
        }

        const [results, total] = await query
            .skip(skip)
            .take(take)
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        const formatResult: FruitClassificationFlat[] = results.map(result => ({
            id: result.id,
            confidence_level: result.confidence_level,
            image_url: result.image_url,
            fruit: result.fruit.fruit_name,
            fruitType: result.fruitType.type_name,
            area: result.areaBelong.area_code,
            batch: result.fruitBatchBelong.batch_code,
            created_at: result.created_at,
        }));

        return {
            columns: [
                { key: 'id', displayName: 'ID', type: 'number' },
                { key: 'confidence_level', displayName: 'Độ tin cậy', type: 'string' },
                { key: 'fruit', displayName: 'Loại trái cây', type: 'string' },
                { key: 'fruitType', displayName: 'Loại', type: 'string' },
                { key: 'area', displayName: 'Khu vực', type: 'string' },
                { key: 'batch', displayName: 'Mã lô', type: 'string' },
                { key: 'created_at', displayName: 'Thời gian', type: 'date' },
            ],
            values: formatResult,
            meta: {
                totalItems: total,
                currentPage: page,
                totalPages,
                limit,
            },
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} fruitClassification`;
    }

    update(id: number, updateFruitClassificationDto: UpdateFruitClassificationDto) {
        return `This action updates a #${id} fruitClassification`;
    }

    remove(id: number) {
        return `This action removes a #${id} fruitClassification`;
    }
}
