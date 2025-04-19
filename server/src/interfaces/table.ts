export interface TableColumn {
    key: string;
    displayName: string;
    type: "string" | "number" | "boolean" | "date";
    valueMapping?: Record<string, string>;
}

export interface TableMetaData<T> {
    columns: TableColumn[];
    values: T[];
    meta?: any;
}