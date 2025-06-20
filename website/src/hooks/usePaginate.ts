import { MetaPaginate } from '@/interfaces';

export function usePaginate({
  meta,
  setMetaCallback,
}: {
  meta: MetaPaginate;
  setMetaCallback: (item: MetaPaginate) => void;
}) {
  const handleNextPage = () => {
    if (meta.currentPage < meta.totalPages) {
      setMetaCallback({ ...meta, currentPage: +meta.currentPage + 1 });
    }
  };

  const handlePrevPage = () => {
    if (meta.currentPage > 1) {
      setMetaCallback({ ...meta, currentPage: +meta.currentPage - 1 });
    }
  };

  const handleClickPage = (page: number) => {
    if (page >= 1 && page <= meta.totalPages) {
      setMetaCallback({ ...meta, currentPage: page });
    }
  };

  return {
    handleNextPage,
    handlePrevPage,
    handleClickPage,
  };
}
