import {FindOptionsWhere, In, Repository} from "typeorm";
import {BadRequestException} from "@nestjs/common";

interface RequireId {
    id: string | number;
}

export async function validateAndGetEntitiesByIds<T extends RequireId>(
    repository: Repository<T>,
    ids: string[],
    notFoundMessage = 'Một hoặc nhiều phần tử không tồn tại',
    invalidMessage = 'Danh sách ID không hợp lệ',
): Promise<T[]> {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new BadRequestException(invalidMessage);
    }

    const entities = await repository.find({ where: { id: In(ids) } as FindOptionsWhere<T> });

    if (entities.length !== ids.length) {
        throw new BadRequestException(notFoundMessage);
    }

    return entities;
}