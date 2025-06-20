'use client';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomTable from '@/components/table/CustomTable';
import { useEffect, useState } from 'react';
import CustomPagination from '@/components/common/CustomPagination';
import ModelLayer from '@/components/common/ModelLayer';
import { handleAxiosError } from '@/utils/axiosInstance';
import { AreaBodyType } from '@/schemas/area.schema';
import CreateNewAreaForm from '@/components/forms/CreateNewAreaForm';
import { CustomTableData } from '@/interfaces/table';
import { MetaPaginate } from '@/interfaces';
import { AreaDetail } from '@/interfaces';
import ChangeAreaInfoForm from '@/components/forms/ChangeAreaInfoForm';
import {
  useToast,
  usePaginate,
  useFetchResource,
  useCreateResource,
  useDeleteResource,
} from '@/hooks';

export default function Areas() {
  const { toast } = useToast();
  const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 3 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchFields: string = 'area_code,area_desc';
  const { data: cacheData, isLoading } = useFetchResource({
    resource: 'areas',
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
  const [detailFormState, setDetailFormState] = useState<boolean>(false);
  const [areaDetailData, setAreaDetailData] = useState<AreaDetail>();
  const toggleCreateFormState = () => setCreateFormState((prev) => !prev);

  const createNewArea = useCreateResource(
    'areas',
    'formdata',
    () => {
      toast({ title: 'Thêm khu thành công', variant: 'success' });
      setCreateFormState(false);
    },
    (error) => {
      toast({
        title: 'Thêm khu thất bại',
        description: handleAxiosError(error),
        variant: 'destructive',
      });
    },
  );

  const deleteAreas = useDeleteResource(
    'areas',
    'areaIds',
    () => {
      toast({
        title: `Đã xoá khu phân loại thành công`,
        variant: 'success',
      });
    },
    (error) => {
      toast({
        title: 'Xoá trạng thái thất bại',
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
      <PageBreadcrumb pageTitle={'Khu phân loại'} />

      <div className="space-y-6">
        <CustomTable
          tableTitle={'Danh sách khu phân loại'}
          tableData={data}
          onSort={(key) => console.log(`Sorting by ${key}`)}
          createItem={true}
          detailItem={true}
          deleteItem={true}
          search={true}
          searchFields={searchFields}
          handleCreate={toggleCreateFormState}
          handleDetail={(areaSelected) => {
            setAreaDetailData(areaSelected as AreaDetail);
            setDetailFormState(true);
          }}
          handleDelete={async (itemSelected) => deleteAreas.mutateAsync(itemSelected)}
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
          <CreateNewAreaForm
            onSubmit={async (formData: AreaBodyType) => createNewArea.mutateAsync(formData)}
          />
        </ModelLayer>

        <ModelLayer
          isOpen={detailFormState}
          onClose={() => setDetailFormState(false)}
          maxWidth="max-w-3xl"
        >
          {areaDetailData && (
            <ChangeAreaInfoForm
              key={areaDetailData?.id}
              data={areaDetailData}
              onUpdateSuccess={async (newAreaData) => {
                setData((prev) => ({
                  ...prev,
                  values: prev.values.map((area) =>
                    area.id === newAreaData.id ? newAreaData : area,
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
