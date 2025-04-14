import React, {ReactNode} from "react";

// Props for Table
export interface TableProps {
    children: ReactNode; // Table content (thead, tbody, etc.)
    className?: string; // Optional className for styling
    tableTitle?: string;
    createItem?: boolean;
    detailItem?: boolean;
    deleteItem?: boolean;
    search?: boolean;
    restoreItem?: boolean;
    handleCreate?: void;
    handleDelete?: void;
    handleRestore?: void;
    handleSearch?: void;
}

// Props for TableHeader
export interface TableHeaderProps {
    children: ReactNode; // Header row(s)
    className?: string; // Optional className for styling
}

// Props for TableBody
export interface TableBodyProps {
    children: ReactNode; // Body row(s)
    className?: string; // Optional className for styling
}

// Props for TableRow
export interface TableRowProps {
    children: ReactNode; // Cells (th or td)
    className?: string; // Optional className for styling
}

// Props for TableCell
export interface TableCellProps {
    children: ReactNode; // Cell content
    key?: number;       // Key for map loop
    isHeader?: boolean; // If true, renders as <th>, otherwise <td>
    className?: string; // Optional className for styling
    onClick?: void;
}

// Table Props
export interface CustomTableProps extends TableProps {
    tableData: CustomTableData;
    onSort?: (key: string) => void; // Hàm xử lý sắp xếp
}

export interface CustomTableColumn {
    key: string;
    displayName: string;
    type: 'string' | 'number' | 'boolean' | 'date';
    valueMapping?: Record<string, any>
}

export interface CustomTableData {
    columns: CustomTableColumn[];
    values: Record<string, any>[];
}