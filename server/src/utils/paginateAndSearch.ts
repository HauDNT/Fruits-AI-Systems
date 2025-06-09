import { Like, IsNull, FindOptionsWhere } from 'typeorm';
import {TableMetaData, TableMetaDataQueryOptions} from "@/interfaces/table";

export async function getDataWithQueryAndPaginate<Entity>(
    options: TableMetaDataQueryOptions<Entity>
): Promise<TableMetaData<Entity>> {
    const {
        repository,
        page,
        limit,
        queryString,
        searchFields,
        selectFields,
        columnsMeta,
        where = { deleted_at: IsNull() } as unknown as FindOptionsWhere<Entity>,
    } = options;

    const skip = (page - 1) * limit;
    const take = limit;

    let searchConditions: FindOptionsWhere<Entity>[] = [];

    if (queryString && searchFields?.length) {
        searchConditions = searchFields.map((field) => ({
            ...where,
            [field]: Like(`%${queryString}%`),
        })) as FindOptionsWhere<Entity>[];
    }

    const [values, total] = await repository.findAndCount({
        where: searchConditions.length > 0 ? searchConditions : where,
        select: selectFields as (keyof Entity)[],
        skip,
        take,
    });

    return {
        columns: columnsMeta,
        values,
        meta: {
            totalItems: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            limit,
        },
    }
}