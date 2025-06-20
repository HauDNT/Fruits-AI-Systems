'use client';
import { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomTable from '@/components/table/CustomTable';
import CustomPagination from '@/components/common/CustomPagination';
import ModelLayer from '@/components/common/ModelLayer';
import PreviewClassifyResult from '@/components/forms/PreviewClassifyResult';
import { ClassifyResultInterface, MetaPaginate } from '@/interfaces';
import { useSocketFruitClassify } from '@/hooks/useSocketFruitClassify';
import { CustomTableData } from '@/interfaces/table';
import { useToast, usePaginate, useFetchResource } from '@/hooks';

export default function Classification() {
  const { toast } = useToast();
  const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 15 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchFields: string = 'fruit, areaBelong, confidence_level';
  const { data: cacheData } = useFetchResource({
    resource: 'fruit-classification',
    page: meta.currentPage,
    limit: meta.limit,
    queryString: searchQuery,
    searchFields,
  });
  const [data, setData] = useState<CustomTableData>({
    columns: [],
    values: [],
  });
  const { handlePrevPage, handleNextPage, handleClickPage } = usePaginate({
    meta,
    setMetaCallback: setMeta,
  });
  const [detailItemData, setDetailItemData] = useState<ClassifyResultInterface>();
  const [detailFormState, setDetailFormState] = useState(false);

  const handleDetail = (item: ClassifyResultInterface) => {
    setDetailItemData(item);
    setDetailFormState(true);
  };

  useEffect(() => {
    if (cacheData) {
      setData({
        columns: cacheData.columns,
        values: cacheData.values,
      });

      setMeta((prev) => ({
        ...prev,
        totalPages: cacheData.meta.totalPages,
        currentPage: cacheData.meta.currentPage,
      }));
    }
  }, [cacheData]);

  useSocketFruitClassify((newResult: ClassifyResultInterface) => {
    toast({
      title: 'Phát hiện kết quả phân loại mới',
      description: `
                Loại: ${newResult.fruit} - ${newResult.fruitType}, 
                Độ tin cậy: ${(newResult.confidence_level * 100).toFixed(2)} %
            `,
      variant: 'success',
    });

    setData((prev) => ({
      ...prev,
      values: [newResult, ...prev.values],
    }));
  });

  return (
    <div>
      <PageBreadcrumb pageTitle={'Kết quả phân loại'} />

      <div className="space-y-6">
        <CustomTable
          tableTitle={'Danh sách kết quả phân loại'}
          tableData={data}
          onSort={(key) => console.log(`Sorting by ${key}`)}
          createItem={false}
          detailItem={true}
          deleteItem={false}
          search={true}
          searchFields={searchFields}
          handleDetail={(item) => handleDetail(item as ClassifyResultInterface)}
          handleSearch={(query) => setSearchQuery(query)}
        />

        <CustomPagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          handlePreviousPage={handlePrevPage}
          handleNextPage={handleNextPage}
          handleClickPage={handleClickPage}
        />

        <ModelLayer
          isOpen={detailFormState}
          onClose={() => setDetailFormState(false)}
          maxWidth="max-w-3xl"
        >
          {detailItemData && <PreviewClassifyResult data={detailItemData} />}
        </ModelLayer>
      </div>
    </div>
  );
}
