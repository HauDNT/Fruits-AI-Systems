'use client';
import { useEffect, useState } from 'react';
import { HttpStatusCode } from 'axios';
import { handleAxiosError } from '@/utils/axiosInstance';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomTable from '@/components/table/CustomTable';
import CreateNewFruitTypeForm from '@/components/forms/CreateNewFruitTypeForm';
import ModelLayer from '@/components/common/ModelLayer';
import { FruitTypeBodyType } from '@/schemas/fruit.schema';
import CustomPagination from '@/components/common/CustomPagination';
import { CustomTableData } from '@/interfaces/table';
import { FruitType, MetaPaginate } from '@/interfaces';
import ChangeFruitTypeForm from '@/components/forms/ChangeFruitTypeForm';
import {
  useToast,
  usePaginate,
  useFetchResource,
  useCreateResource,
  useDeleteResource,
} from '@/hooks';

export default function FruitTypes() {
  const { toast } = useToast();
  const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchFields: string = 'type_name,type_desc';
  const { data: cacheData } = useFetchResource({
    resource: 'fruit-types',
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
  const [fruitTypeData, setFruitTypeData] = useState<FruitType>();
  const [createFormState, setCreateFormState] = useState<boolean>(false);
  const [detailFormState, setDetailFormState] = useState<boolean>(false);
  const toggleCreateFormState = () => setCreateFormState((prev) => !prev);

  const createNewFruitType = useCreateResource(
    'fruit-types',
    'json',
    () => {
      toast({ title: 'Thêm tình trạng trái cây thành công', variant: 'success' });
      setCreateFormState(false);
    },
    (error) => {
      toast({
        title: 'Thêm tình trạng trái cây thất bại',
        description: handleAxiosError(error),
        variant: 'destructive',
      });
    },
  );

  const deleteFruitTypes = useDeleteResource(
    'fruit-types',
    'fruitTypeIds',
    () => {
      toast({
        title: `Đã xoá tình trạng trái cây thành công`,
        variant: 'success',
      });
    },
    (error) => {
      toast({
        title: 'Xoá tình trạng trái cây thất bại',
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
    <div>
      <PageBreadcrumb pageTitle={'Trạng thái trái cây'} />

      <div className="space-y-6">
        <CustomTable
          tableTitle={'Danh sách trạng thái'}
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
            setFruitTypeData(item as FruitType);
          }}
          handleDelete={async (itemSelected) => deleteFruitTypes.mutateAsync(itemSelected)}
          handleSearch={(query) => setSearchQuery(query)}
        />
      </div>

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
        <CreateNewFruitTypeForm
          onSubmit={async (values: FruitTypeBodyType) => createNewFruitType.mutateAsync(values)}
        />
      </ModelLayer>

      <ModelLayer
        isOpen={detailFormState}
        onClose={() => setDetailFormState(false)}
        maxWidth="max-w-3xl bg-red"
      >
        {fruitTypeData && (
          <ChangeFruitTypeForm
            data={fruitTypeData}
            onUpdateSuccess={async (newFruitType) => {
              setData((prev) => ({
                ...prev,
                values: prev.values.map((type) =>
                  type.id === newFruitType.id ? newFruitType : type,
                ),
              }));
            }}
          />
        )}
      </ModelLayer>
    </div>
  );
}
