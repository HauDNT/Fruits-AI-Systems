'use client'
import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { CustomPaginationProps } from "@/interfaces";

const CustomPagination = ({
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
    handleClickPage,
}: CustomPaginationProps) => {
    const renderPageNumbers = () => {
        const pages: React.JSX.Element[] = [];

        if (totalPages <= 1) return pages;

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <PaginationLink
                    key={i}
                    onClick={() => handleClickPage(i)}
                    className={i === currentPage ? 'border-2 border-blue-300' : ''}
                >
                    {i}
                </PaginationLink>
            );
        }

        return pages;
    };

    return (
        <Pagination className={'my-3'}>
            <PaginationContent className={'flex overflow-x-auto'}>
                <PaginationItem className={'cursor-pointer select-none'}>
                    <PaginationPrevious customTitle={'Trước'} onClick={handlePreviousPage} />
                </PaginationItem>
                <div className={`${totalPages >= 20 ? 'w-[1000px]' : null} flex overflow-x-auto`}>
                    <PaginationItem className={`cursor-pointer select-none ${totalPages >= 20 ? 'flex pb-3' : null}`}>
                        {renderPageNumbers()}
                    </PaginationItem>
                </div>
                <PaginationItem className={'cursor-pointer select-none'}>
                    <PaginationNext customTitle={'Sau'} onClick={handleNextPage} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default CustomPagination;
