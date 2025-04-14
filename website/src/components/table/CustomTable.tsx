'use client'
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/table/index";
import {CustomTableProps} from "@/interfaces/table";
import {renderCellValues} from "@/utils/customTableUtils";
import ComponentCard from "@/components/common/ComponentCard";
import ActionButton from "@/components/common/ActionButton";
import {Checkbox} from "@/components/ui/checkbox"
import Searchbar from "@/components/common/Searchbar";

export default function CustomTable({
    tableTitle,
    tableData,
    onSort,
    classname,
    createItem,
    deleteItem,
    restoreItem,
    search,
    handleCreate,
    handleDelete,
    handleRestore,
    handleSearch,
}: CustomTableProps) {
    const {columns, values} = tableData;
    const [itemSelected, setItemSelect] = useState<number[]>([]);

    const handleItemChecked = (itemId: number, checked: boolean) => {
        if (checked) {
            setItemSelect((prev) => {
                if (prev.includes(itemId)) {
                    return prev; // Nếu itemId đã có, không thêm lại
                }
                return [...prev, itemId]; // Thêm itemId vào danh sách
            });
        } else {
            setItemSelect((prev) => prev.filter((id) => id !== itemId));
        }
    };

    return (
        <ComponentCard
            title={tableTitle}
            actionBar={
                <div className='flex justify-between w-full gap-4'>
                    {
                        search && (
                            <Searchbar
                                onSearch={(queryString) => handleSearch(queryString)}
                            />
                        )
                    }
                    {
                        createItem && (
                            <ActionButton
                                action={"Create"}
                                handleAction={handleCreate}
                            />
                        )
                    }
                    {
                        deleteItem && (
                            <ActionButton
                                action={"Delete"}
                                handleAction={async () => handleDelete(itemSelected)}
                            />
                        )
                    }
                    {
                        restoreItem && (
                            <ActionButton
                                action={"Restore"}
                                handleAction={handleRestore}
                            />
                        )
                    }
                </div>
            }
        >
            <div className={`${classname} overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]`}>
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {
                                        (deleteItem || restoreItem) && (
                                            <TableCell
                                                isHeader
                                                className="px-3 pb-2 font-medium text-black-500 text-center text-theme-sm dark:text-gray-400"
                                            >
                                                <Checkbox className={'table-select-all'}/>
                                            </TableCell>
                                        )
                                    }
                                    {
                                        columns.map((col) => (
                                            col.key !== 'id' ? (
                                                <TableCell
                                                    key={col.key}
                                                    isHeader
                                                    onClick={() => onSort?.(col.key)}
                                                    className="px-5 py-3 font-medium text-black-500 text-center text-theme-sm dark:text-gray-400"
                                                >
                                                    {col.displayName}
                                                </TableCell>
                                            ) : null
                                        ))
                                    }
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {values.map((row, index) => (
                                    <TableRow key={index}>
                                        {
                                            (deleteItem || restoreItem) && (
                                                row.disableCheck ? (
                                                    <span/>
                                                ) : (
                                                    <TableCell
                                                        key={index}
                                                        onClick={() => {}}
                                                        className="px-5 py-3 font-medium text-black-500 text-center text-theme-sm dark:text-gray-400"
                                                    >
                                                        <Checkbox
                                                            className={'table-select-item'}
                                                            checked={itemSelected.includes(row.id)}
                                                            onCheckedChange={(checked) => handleItemChecked(row.id, checked as boolean)}
                                                        />
                                                    </TableCell>
                                                )
                                            )
                                        }
                                        {
                                            columns.map((col) => (
                                                col.key !== 'id' ? (
                                                    <TableCell key={col.key} className="px-5 py-4 sm:px-6 text-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className={'w-full'}>
                                                                <span className="block text-gray-600 text-center text-theme-sm">
                                                                {
                                                                    col.key === 'is_online' ?
                                                                        (
                                                                            <div className={'w-100 flex justify-center'}>
                                                                                {
                                                                                    row[col.key] === true ? (
                                                                                        <span
                                                                                            className={`absolute h-2 w-2 rounded-full bg-green-400 flex`}>
                                                                                        <span
                                                                                            className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"/>
                                                                                    </span>
                                                                                    ) : (
                                                                                        <span
                                                                                            className="relative h-2 w-2 rounded-full bg-red-400 flex items-center justify-center">
                                                                                        <span
                                                                                            className="inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"/>
                                                                                    </span>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        ) : (
                                                                            <span>
                                                                                {renderCellValues(col, row[col.key])}
                                                                            </span>
                                                                        )
                                                                }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                ) : null
                                            ))
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </ComponentCard>
    );
}
