import {Injectable} from '@nestjs/common';
import {CreateFruitClassificationDto} from './dto/create-fruit-classification.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {FruitClassification} from '@/modules/fruit-classification/entities/fruit-classification.entity';
import {Repository} from 'typeorm';
import {Fruit} from '@/modules/fruits/entities/fruit.entity';
import {Area} from '@/modules/areas/entities/area.entity';
import {FruitType} from '@/modules/fruit-types/entities/fruit-type.entity';
import {TableMetaData} from '@/interfaces/table';
import {FruitClassificationFlat} from '@/interfaces';
import {GetDataWithQueryParamsDTO} from '@/modules/dtoCommons';

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
    ) {
    }

    splitLabelFromResult(label: string): {
        fruit_name: string;
        type_name: string;
    } {
        const parts = label.trim().split(' ');
        if (parts.length !== 2) {
            throw new Error(`Kết quả "${label}" không hợp lệ`);
        }

        const type_name = parts.pop();
        const fruit_name = parts.join(' ');

        return {fruit_name, type_name};
    }

    async create(
        createFruitClassificationDto: CreateFruitClassificationDto,
        imageUrl: string,
    ) {
        const {confidence_level, result, areaId} = createFruitClassificationDto;

        const {fruit_name, type_name} = this.splitLabelFromResult(result);
        const fruit = await this.fruitRepository.findOneBy({fruit_name});
        const type = await this.fruitTypeRepository.findOneBy({type_name});
        const area = await this.areaRepository.findOneBy({id: areaId});

        let newClassifyResult = this.fruitClassificationRepository.create({
            confidence_level,
            fruit,
            areaBelong: area,
            image_url: imageUrl,
            fruitType: type,
            created_at: new Date(),
        });

        await this.fruitClassificationRepository.save(newClassifyResult);

        newClassifyResult = await this.fruitClassificationRepository.findOne({
            where: {id: newClassifyResult.id},
            relations: ['fruit', 'fruitType', 'areaBelong'],
        });

        return newClassifyResult;
    }

    async findAll(): Promise<FruitClassification[]> {
        return await this.fruitClassificationRepository.find();
    }

    async getClassifyByQuery(
        data: GetDataWithQueryParamsDTO,
    ): Promise<TableMetaData<FruitClassificationFlat>> {
        const {page = 1, limit = 10, queryString = '', searchFields = ''} = data;

        const skip = (page - 1) * limit;
        const take = limit;

        const query = this.fruitClassificationRepository
            .createQueryBuilder('fc')
            .leftJoinAndSelect('fc.fruit', 'fruit')
            .leftJoinAndSelect('fc.fruitType', 'fruitType')
            .leftJoinAndSelect('fc.areaBelong', 'areaBelong')
            .where('fc.deleted_at IS NULL')
            .addOrderBy('fc.created_at', 'DESC');

        if (queryString && searchFields) {
            const fields = searchFields.split(',').map((f) => f.trim());

            const conditions = fields
                .map((field) => {
                    if (field === 'fruit') return 'fruit.fruit_name LIKE :query';
                    if (field === 'areaBelong') return 'areaBelong.area_code LIKE :query';
                    return `fc.${field} LIKE :query`;
                })
                .join(' OR ');

            query.andWhere(`(${conditions})`, {query: `%${queryString}%`});
        }

        const [results, total] = await query
            .skip(skip)
            .take(take)
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        const formatResult: FruitClassificationFlat[] = results.map((result) => ({
            id: result.id,
            confidence_level: result.confidence_level,
            image_url: result.image_url,
            fruit: result.fruit.fruit_name,
            fruitType: result.fruitType.type_name,
            area: `${result.areaBelong.area_code} - ${result.areaBelong.area_desc}`,
            created_at: result.created_at,
        }));

        return {
            columns: [
                {key: 'id', displayName: 'ID', type: 'number'},
                {key: 'confidence_level', displayName: 'Độ tin cậy', type: 'string'},
                {key: 'fruit', displayName: 'Loại trái cây', type: 'string'},
                {key: 'fruitType', displayName: 'Loại', type: 'string'},
                {key: 'area', displayName: 'Khu vực', type: 'string'},
                {key: 'created_at', displayName: 'Thời gian', type: 'date'},
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
}
