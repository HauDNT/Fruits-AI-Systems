import {
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import {TableMetaData} from "@/interfaces/table";
import {CreateFruitTypeDto} from './dto/create-fruit-type.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {IsNull, Repository, Like, DeleteResult, DataSource} from "typeorm";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {validateAndGetEntitiesByIds} from "@/utils/validateAndGetEntitiesByIds";
import {Fruit} from "@/modules/fruits/entities/fruit.entity";
import {checkAllRelationsBeforeDelete} from "@/utils/checkAllRelationsBeforeDelete";
import {getDataWithQueryAndPaginate} from "@/utils/paginateAndSearch";

@Injectable()
export class FruitTypesService {
    constructor(
        @InjectRepository(FruitType)
        private readonly fruitTypeRepository: Repository<FruitType>,
        @InjectRepository(Fruit)
        private readonly fruitRepository: Repository<Fruit>,
        private readonly dataSource: DataSource,
    ) {
    }

    async create(createFruitTypeDto: CreateFruitTypeDto) {
        const {type_name, type_desc} = createFruitTypeDto;

        const checkExistType = await this.fruitTypeRepository
            .createQueryBuilder('fruitType')
            .where('LOWER(fruitType.type_name) = LOWER(:type_name)', {type_name: type_name})
            .getOne()

        if (!checkExistType) {
            const newType = await this.fruitTypeRepository.create({
                type_name: type_name,
                type_desc: type_desc,
                created_at: new Date(),
                updated_at: new Date(),
            })

            const savedType = await this.fruitTypeRepository.save(newType);

            return {
                message: 'Tạo trạng thái thành công',
                data: savedType,
            };
        } else {
            throw new BadRequestException('Trạng thái đã tồn tại')
        }
    }

    async getAllFruitTypes(): Promise<FruitType[]> {
        return await this.fruitTypeRepository.find();
    }

    async getFruitTypesByQuery(data: GetDataWithQueryParamsDTO): Promise<TableMetaData<FruitType>> {
        return getDataWithQueryAndPaginate({
            repository: this.fruitTypeRepository,
            page: data.page,
            limit: data.limit,
            queryString: data.queryString,
            searchFields: data.searchFields?.split(','),
            selectFields: ['id', 'type_name', 'type_desc', 'created_at', 'updated_at'],
            columnsMeta: [
                {"key": "id", "displayName": "ID", "type": "number"},
                {"key": "type_name", "displayName": "Tình trạng", "type": "string"},
                {"key": "type_desc", "displayName": "Mô tả", "type": "string"},
                {"key": "created_at", "displayName": "Ngày tạo", "type": "date"},
                {"key": "updated_at", "displayName": "Ngày thay đổi", "type": "date"},
            ],
        });
    }

    async deleteFruitTypes(fruitTypeIds: string[]): Promise<DeleteResult> {
        await validateAndGetEntitiesByIds(this.fruitTypeRepository, fruitTypeIds);

        await checkAllRelationsBeforeDelete(
            this.dataSource,
            FruitType,
            fruitTypeIds,
            {
                fruitTypes: 'Không thể xóa tình trạng trái cây vì đang được sử dụng',
            }
        )

        return await this.fruitTypeRepository.delete(fruitTypeIds);
    }
}
