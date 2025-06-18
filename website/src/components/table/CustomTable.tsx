'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/table/index';
import { MdMore } from 'react-icons/md';
import { CustomTableProps } from '@/interfaces/table';
import { renderCellValues } from '@/utils/customTableUtils';
import ComponentCard from '@/components/common/ComponentCard';
import ActionButton from '@/components/common/ActionButton';
import { Checkbox } from '@/components/ui/checkbox';
import Searchbar from '@/components/common/Searchbar';

export default function CustomTable({
  children,
  className,
  searchFields,
  tableTitle = '',
  tableData,
  onSort,
  createItem,
  deleteItem,
  restoreItem,
  detailItem,
  search,
  handleCreate,
  handleDetail,
  handleDelete,
  handleRestore,
  handleSearch,
}: CustomTableProps) {
  const { columns, values } = tableData;
  const [itemSelected, setItemSelect] = useState<number[]>([]);

  const handleItemChecked = (itemId: number, checked: boolean) => {
    if (checked) {
      setItemSelect((prev) => {
        if (prev.includes(itemId)) {
          return prev;
        }
        return [...prev, itemId];
      });
    } else {
      setItemSelect((prev) => prev.filter((id) => id !== itemId));
    }
  };

  return (
    <ComponentCard
      title={tableTitle}
      actionBar={
        <div className="flex justify-between w-full gap-4">
          {search && <Searchbar onSearch={(queryString) => handleSearch?.(queryString)} />}
          {createItem && <ActionButton action={'Create'} handleAction={handleCreate} />}
          {deleteItem && (
            <ActionButton
              action={'Delete'}
              handleAction={async () => {
                await handleDelete?.(itemSelected);
                setItemSelect([]);
              }}
            />
          )}
          {restoreItem && <ActionButton action={'Restore'} handleAction={handleRestore} />}
        </div>
      }
    >
      <div
        className={`${className} overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]`}
      >
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {(deleteItem || restoreItem) && tableData?.columns?.length > 0 && (
                    <TableCell
                      isHeader
                      className="px-3 pb-2 font-medium text-black-500 text-center text-theme-sm dark:text-gray-400"
                    >
                      <Checkbox className={'table-select-all'} />
                    </TableCell>
                  )}
                  {tableData?.values && tableData?.columns ? (
                    columns.map((col, index) =>
                      col.key !== 'id' ? (
                        <TableCell
                          key={index}
                          isHeader
                          onClick={() => onSort?.(col.key)}
                          className="px-5 py-3 font-medium text-black-500 text-center text-theme-sm dark:text-gray-400"
                        >
                          {col.displayName}
                        </TableCell>
                      ) : null,
                    )
                  ) : (
                    <TableCell
                      key={1}
                      isHeader
                      className="px-5 py-3 font-medium text-black-500 text-center text-theme-sm dark:text-gray-400"
                    >
                      Không có dữ liệu
                    </TableCell>
                  )}
                  {detailItem && (
                    <TableCell
                      isHeader
                      className="px-3 pb-2 font-medium text-black-500 text-center text-theme-sm dark:text-gray-400"
                    >
                      <span>Chi tiết</span>
                    </TableCell>
                  )}
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              {tableData?.values?.length > 0 ? (
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {values.map((row, index) => (
                    <TableRow key={index}>
                      {(deleteItem || restoreItem) &&
                        (row.disableCheck ? (
                          <span />
                        ) : (
                          <TableCell
                            key={index}
                            onClick={() => {}}
                            className="px-5 py-3 font-medium text-black-500 text-center text-theme-sm dark:text-gray-400"
                          >
                            <Checkbox
                              className={'table-select-item'}
                              checked={itemSelected.includes(row.id)}
                              onCheckedChange={(checked) =>
                                handleItemChecked(row.id, checked as boolean)
                              }
                            />
                          </TableCell>
                        ))}
                      {columns.map((col, index) =>
                        col.key !== 'id' && col.key !== 'image_url' ? (
                          <TableCell key={index} className="px-5 py-4 sm:px-6 text-center">
                            <div className="flex items-center gap-3">
                              <div className={'w-full'}>
                                <span className="block text-gray-600 text-center text-theme-sm">
                                  <span>{renderCellValues(col, row[col.key])}</span>
                                </span>
                              </div>
                            </div>
                          </TableCell>
                        ) : null,
                      )}
                      {detailItem && (
                        <TableCell
                          isHeader
                          className="px-3 pb-2 font-medium text-black-500 text-center text-theme-sm dark:text-gray-400"
                        >
                          <span className={'w-full block'}>
                            <MdMore
                              size={20}
                              className={'dark:white m-auto cursor-pointer'}
                              onClick={() => handleDetail?.(row)}
                            />
                          </span>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              ) : null}
            </Table>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}
