'use client';
import { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomTable from '@/components/table/CustomTable';
import CustomPagination from '@/components/common/CustomPagination';
import ModelLayer from '@/components/common/ModelLayer';
import { handleAxiosError } from '@/utils/axiosInstance';
import CreateNewDeviceTypeForm from '@/components/forms/CreateNewDeviceTypeForm';
import { CustomTableData } from '@/interfaces/table';
import { MetaPaginate } from '@/interfaces';
import {
  useToast,
  usePaginate,
  useFetchResource,
  useCreateResource,
  useDeleteResource,
} from '@/hooks';

export default function DeviceTypes() {
  const { toast } = useToast();
  const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchFields: string = 'type_name';
  const { data: cacheData } = useFetchResource({
    resource: 'device-types',
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
  const [createFormState, setCreateFormState] = useState<boolean>(false);
  const toggleCreateFormState = () => setCreateFormState((prev) => !prev);

  const createNewDeviceType = useCreateResource(
    'device-types',
    'json',
    () => {
      toast({ title: 'Thêm loại thiết bị thành công', variant: 'success' });
      setCreateFormState(false);
    },
    (error) => {
      toast({
        title: 'Thêm loại thiết bị thất bại',
        description: handleAxiosError(error),
        variant: 'destructive',
      });
    },
  );

  const deleteDeviceTypes = useDeleteResource(
    'device-types',
    'typeIds',
    () => {
      toast({
        title: `Đã xoá loại thiết bị thành công`,
        variant: 'success',
      });
    },
    (error) => {
      toast({
        title: 'Xoá loại thiết bị thất bại',
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
      <PageBreadcrumb pageTitle={'Loại thiết bị'} />

      <div className="space-y-6">
        <CustomTable
          tableTitle={'Loại thiết bị'}
          tableData={data}
          onSort={(key) => console.log(`Sorting by ${key}`)}
          createItem={true}
          deleteItem={true}
          search={true}
          searchFields={searchFields}
          handleCreate={toggleCreateFormState}
          handleDelete={async (itemSelected) => deleteDeviceTypes.mutateAsync(itemSelected)}
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
          <CreateNewDeviceTypeForm
            onSubmit={async (formData: FormData) => createNewDeviceType.mutateAsync(formData)}
            onClose={() => setCreateFormState(false)}
          />
        </ModelLayer>
      </div>
    </>
  );
}
