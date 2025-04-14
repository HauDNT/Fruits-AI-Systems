'use client'
import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

const CustomPagination = ({
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
    handleClickPage,
    displayLimit = 10,
}) => {
    const renderPageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= displayLimit) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <PaginationLink
                        key={i}
                        onClick={() => handleClickPage(i)}
                        className={i === currentPage ? 'border-2 border-blue-300' : null}
                    >
                        {i}
                    </PaginationLink>
                );
            }
        }
        else {
            // Hiển thị 3 trang đầu
            for (let i = 1; i <= 3; i++) {
                pageNumbers.push(
                    <PaginationLink
                        key={i}
                        onClick={() => handleClickPage(i)}
                        disabled={i === currentPage}
                    >
                        {i}
                    </PaginationLink>
                );
            }

            pageNumbers.push(<PaginationEllipsis/>)

            for (let i = totalPages - 2; i <= totalPages; i++) {
                pageNumbers.push(
                    <PaginationLink
                        key={i}
                        onClick={() => handleClickPage(i)}
                        disabled={i === currentPage}
                    >
                        {i}
                    </PaginationLink>
                );
            }
        }

        return pageNumbers;
    };

    return (
        <Pagination className={'my-3'}>
            <PaginationContent>
                <PaginationItem className={'cursor-pointer hover:none'}>
                    <PaginationPrevious customTitle={'Trước'} onClick={handlePreviousPage} />
                </PaginationItem>
                <PaginationItem className={'cursor-pointer hover:none flex'}>
                    { renderPageNumbers() }
                </PaginationItem>
                <PaginationItem className={'cursor-pointer'}>
                    <PaginationNext customTitle={'Sau'} href="#" onClick={handleNextPage} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default CustomPagination