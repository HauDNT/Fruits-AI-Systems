import {Injectable} from '@nestjs/common';
import {CreateFruitBatchDto} from './dto/create-fruit-batch.dto';
import {UpdateFruitBatchDto} from './dto/update-fruit-batch.dto';
import {GetBatchByQueryParamsDto} from "@/modules/fruit-batches/dto/get-batch-query-params-dto";
import {TableMetaData} from "@/interfaces/table";
import {FruitBatch} from "@/modules/fruit-batches/entities/fruit-batch.entity";
import {IsNull, Like, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class FruitBatchesService {
    constructor(
        @InjectRepository(FruitBatch)
        private fruitBatchRepository: Repository<FruitBatch>
    ) {
    }

    create(createFruitBatchDto: CreateFruitBatchDto) {
        return 'This action adds a new fruitBatch';
    }

    findAll() {
        return `This action returns all fruitBatches`;
    }

    async getBatchesByQuery(data: GetBatchByQueryParamsDto): Promise<TableMetaData<FruitBatch>> {
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

        const [batches, total] = await this.fruitBatchRepository.findAndCount({
            where: searchConditions.length > 0 ? searchConditions : where,
            select: ['id', 'batch_code', 'batch_desc', 'created_at', 'updated_at'],
            skip,
            take,
        })

        const totalPages = Math.ceil(total / limit);

        return {
            "columns": [
                {"key": "id", "displayName": "ID", "type": "number"},
                {"key": "batch_code", "displayName": "Tên lô", "type": "string"},
                {"key": "batch_desc", "displayName": "Mô tả", "type": "string"},
                {"key": "created_at", "displayName": "Ngày tạo", "type": "date"},
                {"key": "updated_at", "displayName": "Ngày thay đổi", "type": "date"},
            ],
            "values": batches,
            "meta": {
                "totalItems": total,
                "currentPage": page,
                "totalPages": totalPages,
                "limit": limit,
            },
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} fruitBatch`;
    }

    update(id: number, updateFruitBatchDto: UpdateFruitBatchDto) {
        return `This action updates a #${id} fruitBatch`;
    }

    remove(id: number) {
        return `This action removes a #${id} fruitBatch`;
    }
}
