'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useEffect, useState } from 'react';
import CustomTable from '@/components/table/CustomTable';
import ModelLayer from '@/components/common/ModelLayer';
import CreateNewFruitForm from '@/components/forms/CreateNewFruitForm';
import { handleAxiosError } from '@/utils/axiosInstance';
import CustomPagination from '@/components/common/CustomPagination';
import { CustomTableData } from '@/interfaces/table';
import { MetaPaginate } from '@/interfaces';
import { FruitDetailInterface } from '@/interfaces/fruitDetail';
import ChangeFruitInfoForm from '@/components/forms/ChangeFruitInfoForm';
import {
  useToast,
  usePaginate,
  useFetchResource,
  useCreateResource,
  useDeleteResource,
} from '@/hooks';

export default function Fruits() {
  const { toast } = useToast();
  const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchFields: string = 'fruit_name,fruit_desc';
  const { data: cacheData } = useFetchResource({
    resource: 'fruits',
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
  const [fruitDetailData, setFruitDetailData] = useState<FruitDetailInterface>();
  const [createFormState, setCreateFormState] = useState<boolean>(false);
  const [detailFormState, setDetailFormState] = useState<boolean>(false);
  const toggleCreateFormState = () => setCreateFormState((prev) => !prev);

  const createNewFruit = useCreateResource(
    'fruits',
    'formdata',
    () => {
      toast({ title: 'Thêm trái cây thành công', variant: 'success' });
      setCreateFormState(false);
    },
    (error) => {
      toast({
        title: 'Thêm trái cây thất bại',
        description: handleAxiosError(error),
        variant: 'destructive',
      });
    },
  );

  const deleteFruits = useDeleteResource(
    'fruits',
    'fruitIds',
    () => {
      toast({
        title: `Đã xoá trái cây thành công`,
        variant: 'success',
      });
    },
    (error) => {
      toast({
        title: 'Xoá trái cây thất bại',
        description: handleAxiosError(error),
        variant: 'destructive',
      });
    },
  );

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

  return (
    <>
      <PageBreadcrumb pageTitle={'Trái cây'} />

      <div className="space-y-6">
        <CustomTable
          tableTitle={'Danh sách trái cây'}
          tableData={data}
          onSort={(key) => console.log(`Sorting by ${key}`)}
          createItem={true}
          detailItem={true}
          deleteItem={true}
          search={true}
          searchFields={searchFields}
          handleCreate={toggleCreateFormState}
          handleDetail={(item) => {
            setDetailFormState(true);
            setFruitDetailData(item as FruitDetailInterface);
          }}
          handleDelete={async (itemSelected) => deleteFruits.mutateAsync(itemSelected)}
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
          isOpen={createFormState}
          onClose={() => setCreateFormState(false)}
          maxWidth="max-w-3xl"
        >
          <CreateNewFruitForm
            onSubmit={async (formData: FormData) => createNewFruit.mutateAsync(formData)}
          />
        </ModelLayer>

        <ModelLayer
          isOpen={detailFormState}
          onClose={() => setDetailFormState(false)}
          maxWidth="max-w-3xl"
        >
          {fruitDetailData && (
            <ChangeFruitInfoForm
              data={fruitDetailData}
              onUpdateSuccess={async (newFruitData) => {
                setData((prev) => ({
                  ...prev,
                  values: prev.values.map((fruit) =>
                    fruit.id === newFruitData.id ? newFruitData : fruit,
                  ),
                }));
              }}
            />
          )}
        </ModelLayer>
      </div>
    </>
  );
}
