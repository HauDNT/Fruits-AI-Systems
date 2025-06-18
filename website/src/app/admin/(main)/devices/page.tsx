'use client';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomTable from '@/components/table/CustomTable';
import CustomPagination from '@/components/common/CustomPagination';
import ModelLayer from '@/components/common/ModelLayer';
import CreateNewDeviceForm from '@/components/forms/CreateNewDeviceForm';
import axiosInstance, { handleAxiosError } from '@/utils/axiosInstance';
import { CustomTableData } from '@/interfaces/table';
import { DeviceDetail, MetaPaginate } from '@/interfaces';
import ChangeDeviceInfoForm from '@/components/forms/ChangeDeviceInfoForm';

export default function Devices() {
  const { toast } = useToast();
  const [data, setData] = useState<CustomTableData>({
    columns: [],
    values: [],
  });
  const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchFields: string = 'device_code,deviceType,deviceStatus,areaBelong';
  const [deviceData, setDeviceData] = useState<DeviceDetail>();
  const [createFormState, setCreateFormState] = useState<boolean>(false);
  const [detailFormState, setDetailFormState] = useState<boolean>(false);
  const toggleCreateFormState = () => setCreateFormState((prev) => !prev);

  const handleNextPage = () => {
    if (meta.currentPage < meta.totalPages) {
      setMeta({ ...meta, currentPage: +meta.currentPage + 1 });
    }
  };

  const handlePrevPage = () => {
    if (meta.currentPage > 1) {
      setMeta({ ...meta, currentPage: +meta.currentPage - 1 });
    }
  };

  const fetchDevicesByQueryParams = async (
    searchQuery: string,
    searchFields: string,
  ): Promise<void> => {
    try {
      const resData = (
        await axiosInstance.get('/devices', {
          params: {
            page: meta.currentPage,
            limit: meta.limit,
            queryString: searchQuery,
            searchFields: searchFields,
          },
        })
      ).data;

      setData({
        columns: resData.columns,
        values: resData.values,
      });

      setMeta({
        ...meta,
        currentPage: resData.meta.currentPage,
        totalPages: resData.meta.totalPages,
      });
    } catch (e) {
      toast({
        title: 'Không thể tải lên danh sách thiết bị',
        variant: 'destructive',
      });
    }
  };

  const handleCreateNewDevice = async (formData: FormData): Promise<boolean> => {
    try {
      const resData = await axiosInstance.post('/devices/create-device', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (resData.status === 201) {
        setCreateFormState(false);

        setData((prev) => ({
          ...prev,
          values: [...prev.values, resData.data.data],
        }));

        toast({ title: 'Thêm thiết bị thành công', variant: 'success' });
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = handleAxiosError(error);

      toast({
        title: 'Thêm thiết bị thất bại',
        description: errorMessage,
        variant: 'destructive',
      });

      return false;
    }
  };

  const deleteDevices = async (deviceIds: string[]): Promise<void> => {
    try {
      if (deviceIds.length > 0) {
        await axiosInstance
          .delete(`/devices/delete`, {
            data: {
              deviceIds,
            },
          })
          .then((res) => {
            if (res.data.affected > 0) {
              toast({
                title: 'Đã xoá thiết bị thành công',
                variant: 'success',
              });

              setData((prevState) => ({
                ...prevState,
                values: prevState.values.filter((item) => !deviceIds.includes(item.id)),
              }));
            } else {
              toast({
                title: 'Vui lòng chọn ít nhất 1 thiết bị để xoá',
                variant: 'warning',
              });
            }
          });
      }
    } catch (error) {
      toast({
        title: 'Xoá loại thiết bị thất bại',
        description: handleAxiosError(error),
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchDevicesByQueryParams(searchQuery, searchFields);
  }, [searchQuery, meta.currentPage]);

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
          handleDelete={async (itemSelected) => await deleteDevices(itemSelected)}
          handleSearch={(query) => setSearchQuery(query)}
        />

        <CustomPagination
          currentPage={meta.currentPage}
          totalPages={meta.totalPages}
          handlePreviousPage={() => handlePrevPage()}
          handleNextPage={() => handleNextPage()}
          handleClickPage={(page) =>
            setMeta((prev) => ({
              ...prev,
              currentPage: page,
            }))
          }
        />

        <ModelLayer
          isOpen={createFormState}
          onClose={() => setCreateFormState(false)}
          maxWidth="max-w-3xl"
        >
          <CreateNewDeviceForm
            onSubmit={(formData: FormData) => handleCreateNewDevice(formData)}
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
