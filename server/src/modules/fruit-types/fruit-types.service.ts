import {
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import {TableMetaData} from "@/interfaces/table";
import {CreateFruitTypeDto} from './dto/create-fruit-type.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {IsNull, Repository, Like, In, DeleteResult} from "typeorm";
import {GetDataWithQueryParamsDTO} from "@/modules/dtoCommons";
import {validateAndGetEntitiesByIds} from "@/utils/validateAndGetEntitiesByIds";

@Injectable()
export class FruitTypesService {
    constructor(
        @InjectRepository(FruitType)
        private fruitTypeRepository: Repository<FruitType>,
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
        };

        const [fruitTypes, total] = await this.fruitTypeRepository.findAndCount({
            where: searchConditions.length > 0 ? searchConditions : where,
            select: ['id', 'type_name', 'type_desc', 'created_at', 'updated_at'],
            skip,
            take,
        });

        const totalPages = Math.ceil(total / limit);

        return {
            "columns": [
                {"key": "id", "displayName": "ID", "type": "number"},
                {"key": "type_name", "displayName": "Tình trạng", "type": "string"},
                {"key": "type_desc", "displayName": "Mô tả", "type": "string"},
                {"key": "created_at", "displayName": "Ngày tạo", "type": "date"},
                {"key": "updated_at", "displayName": "Ngày thay đổi", "type": "date"},
            ],
            "values": fruitTypes,
            "meta": {
                "totalItems": total,
                "currentPage": page,
                "totalPages": totalPages,
                "limit": limit,
            },
        };
    }

    async deleteFruitTypes(fruitTypeIds: string[]): Promise<DeleteResult> {
        await validateAndGetEntitiesByIds(this.fruitTypeRepository, fruitTypeIds);
        return await this.fruitTypeRepository.delete(fruitTypeIds);
    }
}
