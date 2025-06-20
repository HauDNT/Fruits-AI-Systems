'use client';
import { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomTable from '@/components/table/CustomTable';
import CustomPagination from '@/components/common/CustomPagination';
import ModelLayer from '@/components/common/ModelLayer';
import CreateNewDeviceForm from '@/components/forms/CreateNewDeviceForm';
import { handleAxiosError } from '@/utils/axiosInstance';
import { CustomTableData } from '@/interfaces/table';
import { DeviceDetail, MetaPaginate } from '@/interfaces';
import ChangeDeviceInfoForm from '@/components/forms/ChangeDeviceInfoForm';
import {
  useToast,
  usePaginate,
  useFetchResource,
  useCreateResource,
  useDeleteResource,
} from '@/hooks';

export default function Devices() {
  const { toast } = useToast();
  const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchFields: string = 'device_code,deviceType,deviceStatus,areaBelong';
  const { data: cacheData } = useFetchResource({
    resource: 'devices',
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
  const [deviceData, setDeviceData] = useState<DeviceDetail>();
  const [createFormState, setCreateFormState] = useState<boolean>(false);
  const [detailFormState, setDetailFormState] = useState<boolean>(false);
  const toggleCreateFormState = () => setCreateFormState((prev) => !prev);

  const createNewDevice = useCreateResource(
    'devices',
    'formdata',
    () => {
      toast({ title: 'Thêm thiết bị thành công', variant: 'success' });
      setCreateFormState(false);
    },
    (error) => {
      toast({
        title: 'Thêm thiết bị thất bại',
        description: handleAxiosError(error),
        variant: 'destructive',
      });
    },
  );

  const deleteDevices = useDeleteResource(
    'devices',
    'deviceIds',
    () => {
      toast({
        title: `Đã xoá thiết bị thành công`,
        variant: 'success',
      });
    },
    (error) => {
      toast({
        title: 'Xoá thiết bị thất bại',
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
      <PageBreadcrumb pageTitle={'Thiết bị'} />

      <div className="space-y-6">
        <CustomTable
          tableTitle={'Danh sách thiết bị'}
          tableData={data}
          onSort={(key) => console.log(`Sorting by ${key}`)}
          createItem={true}
          detailItem={true}
          deleteItem={true}
          search={true}
          searchFields={searchFields}
          handleCreate={toggleCreateFormState}
          handleDetail={(item) => {
            setDeviceData(item as DeviceDetail);
            setDetailFormState(true);
          }}
          handleDelete={async (itemSelected) => deleteDevices.mutateAsync(itemSelected)}
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
          <CreateNewDeviceForm
            onSubmit={async (formData: FormData) => createNewDevice.mutateAsync(formData)}
            onClose={() => setCreateFormState(false)}
          />
        </ModelLayer>

        <ModelLayer
          isOpen={detailFormState}
          onClose={() => setDetailFormState(false)}
          maxWidth="max-w-3xl"
        >
          {deviceData && (
            <ChangeDeviceInfoForm
              data={deviceData}
              onUpdateSuccess={async (newDeviceInfo) => {
                setData((prev) => ({
                  ...prev,
                  values: prev.values.map((type) =>
                    type.id === newDeviceInfo.id ? newDeviceInfo : type,
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
