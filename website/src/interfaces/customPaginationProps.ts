export interface CustomPaginationProps {
    currentPage: number,
    totalPages: number,
    handleNextPage: () => void,
    handlePreviousPage: () => void,
    handleClickPage: (page: number) => void,
}