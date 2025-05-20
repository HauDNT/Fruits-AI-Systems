export interface TableColumn {
    key: string;
    displayName: string;
    type: "string" | "number" | "boolean" | "date" | "gender";
    valueMapping?: Record<string, string>;
}

export interface TableMetaData<T = any> {
    columns: TableColumn[];
    values: T[];
    meta?: any;
}