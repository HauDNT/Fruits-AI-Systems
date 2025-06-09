import {FindOptionsWhere, Repository} from "typeorm";

export interface TableColumn {
    key: string;
    displayName: string;
    type: "string" | "number" | "boolean" | "date" | "gender";
    valueMapping?: Record<string, string>;
}

export interface TableMetaData<T = any> {
    columns: TableColumn[];
    values: T[];
    meta: {
        totalItems: number;
        currentPage: number;
        totalPages: number;
        limit: number;
    };
}

export interface TableMetaDataQueryOptions<Entity> {
    repository: Repository<Entity>,
    page: number;
    limit: number;
    queryString?: string;
    searchFields?: string[];
    selectFields?: (keyof Entity)[];
    columnsMeta: TableColumn[];
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
}