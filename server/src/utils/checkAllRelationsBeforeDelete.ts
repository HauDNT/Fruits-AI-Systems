import { BadRequestException } from '@nestjs/common';
import { DataSource, EntityTarget, In } from 'typeorm';

export async function checkAllRelationsBeforeDelete(
    dataSource: DataSource,
    entityClass: EntityTarget<any>,
    entityIds: any[],
    customMessages?: Record<string, string>
): Promise<void> {
    const metadata = dataSource.getMetadata(entityClass);

    for (const relation of metadata.relations) {
        const inverseEntity = relation.inverseEntityMetadata.target;
        const propertyPath = relation.inverseRelation?.propertyPath;

        if (!propertyPath) continue;

        const relatedRepo = dataSource.getRepository(inverseEntity);
        let count = 0;

        if (relation.isManyToMany) {
            count = await relatedRepo
                .createQueryBuilder('entity')
                .innerJoin(`entity.${propertyPath}`, 'relation')
                .where('relation.id IN (:...ids)', { ids: entityIds})
                .getCount();
        } else {
            count = await relatedRepo.count({
                where: {
                    [propertyPath]: In(entityIds),
                } as any
            });
        }

        if (count > 0) {
            const message = customMessages?.[propertyPath] || `Không thể xóa vì có liên kết với ${relatedRepo.metadata.tableName}`
            throw new BadRequestException(message);
        }
    }
}