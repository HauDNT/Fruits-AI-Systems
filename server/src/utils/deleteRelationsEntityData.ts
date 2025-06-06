import {EntityTarget, QueryRunner} from "typeorm";

export async function deleteRelationsEntityData(
    queryRunner: QueryRunner,
    parentEntityIds: string[],
    relations: {
        entity: EntityTarget<any>,
        relationField: string,
    }[]
): Promise<void> {
    for (const {entity, relationField} of relations) {
        const queryBuilder = queryRunner.manager.createQueryBuilder(entity, 'root');

        const relationParts = relationField.split('.');
        let alias = 'root';
        let prevAlias = alias;

        for (let i = 0; i < relationParts.length; i++) {
            const part = relationParts[i];
            alias = `alias_${i}`;
            queryBuilder.leftJoin(`${prevAlias}.${part}`, alias);
            prevAlias = alias;
        }

        const lastAlias = `alias_${relationParts.length - 1}`;
        queryBuilder.where(`${lastAlias}.id IN (:...ids)`, { ids: parentEntityIds });

        const entities = await queryBuilder.getMany();
        if (entities.length > 0) {
            await queryRunner.manager.remove(entity, entities);
        }
    }
}