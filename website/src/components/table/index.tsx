import React from "react";
import {TableBodyProps, TableCellProps, TableHeaderProps, TableProps, TableRowProps} from "@/interfaces/table";

// Table Component
export const Table: React.FC<TableProps> = ({children, className}) => {
    return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
export const TableHeader: React.FC<TableHeaderProps> = ({children, className}) => {
    return <thead className={className}>{children}</thead>;
};

// TableBody Component
export const TableBody: React.FC<TableBodyProps> = ({children, className}) => {
    return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
export const TableRow: React.FC<TableRowProps> = ({children, className}) => {
    return <tr className={className}>{children}</tr>;
};

// TableCell Component
export const TableCell: React.FC<TableCellProps> = ({
    children,
    key = 0,
    isHeader = false,
    className,
    onClick,
}) => {
    const CellTag = isHeader ? "th" : "td";
    return <CellTag className={` ${className}`} key={key} onClick={onClick}>{children}</CellTag>;
};
