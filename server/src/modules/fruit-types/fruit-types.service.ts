import {
    HttpException,
    Injectable,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import {TableMetaData} from "@/interfaces/table";
import {CreateFruitTypeDto} from './dto/create-fruit-type.dto';
import {UpdateFruitTypeDto} from './dto/update-fruit-type.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {FruitType} from "@/modules/fruit-types/entities/fruit-type.entity";
import {IsNull, Repository, Like} from "typeorm";
import {GetFruitTypeDTO} from "@/modules/fruit-types/dto/get-fruit-type.dto";

@Injectable()
export class FruitTypesService {
    constructor(
        @InjectRepository(FruitType)
        private fruitTypeRespository: Repository<FruitType>,
    ) {
    }

    async create(createFruitTypeDto: CreateFruitTypeDto) {
        try {
            const {type_name, type_desc} = createFruitTypeDto;

            const checkExistType = await this.fruitTypeRespository
                .createQueryBuilder('fruitType')
                .where('LOWER(fruitType.type_name) = LOWER(:type_name)', {type_name: type_name})
                .getOne()

            if (!checkExistType) {
                const newType = await this.fruitTypeRespository.create({
                    type_name: type_name,
                    type_desc: type_desc,
                    created_at: new Date(),
                    updated_at: new Date(),
                })

                const savedType = await this.fruitTypeRespository.save(newType);

                return {
                    message: 'Tạo trạng thái thành công',
                    data: savedType,
                };
            } else {
                throw new BadRequestException('Trạng thái đã tồn tại')
            }
        } catch (e) {
            console.log('Lỗi: ', e.message)

            if (e instanceof HttpException) {
                throw e;
            }

            throw new InternalServerErrorException('Xảy ra lỗi từ phía server trong quá trình tạo tình trạng trái cây mới');
        }
    }

    async getFruitTypesByQuery(data: GetFruitTypeDTO): Promise<TableMetaData<FruitType>> {
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

        const [fruitTypes, total] = await this.fruitTypeRespository.findAndCount({
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

    findOne(id: number) {
        return `This action returns a #${id} fruitType`;
    }

    update(id: number, updateFruitTypeDto: UpdateFruitTypeDto) {
        return `This action updates a #${id} fruitType`;
    }

    remove(id: number) {
        return `This action removes a #${id} fruitType`;
    }
}
