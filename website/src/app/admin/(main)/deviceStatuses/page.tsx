'use client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomTable from '@/components/table/CustomTable';
import CustomPagination from '@/components/common/CustomPagination';
import ModelLayer from '@/components/common/ModelLayer';
import axiosInstance, { handleAxiosError } from '@/utils/axiosInstance';
import CreateNewDeviceStatusForm from '@/components/forms/CreateNewDeviceStatusForm';
import { CustomTableData } from '@/interfaces/table';
import { MetaPaginate } from '@/interfaces';
import { usePaginate } from '@/hooks/usePaginate';

export default function DeviceStatuses() {
  const { toast } = useToast();
  const [data, setData] = useState<CustomTableData>({
    columns: [],
    values: [],
  });
  const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchFields: string = 'status_name';
  const [createFormState, setCreateFormState] = useState<boolean>(false);
  const toggleCreateFormState = () => setCreateFormState((prev) => !prev);
  const { handlePrevPage, handleNextPage, handleClickPage } = usePaginate({
    meta,
    setMetaCallback: setMeta,
  });

  const fetchDeviceStatusesByQuery = async (
    searchQuery: string,
    searchFields: string,
  ): Promise<void> => {
    try {
      const resData = (
        await axiosInstance.get('/device-status', {
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
        title: 'Không thể tải lên danh sách trạng thái thiết bị',
        variant: 'destructive',
      });
    }
  };

  const createNewDeviceStatus = async (formData: FormData): Promise<boolean> => {
    try {
      const resData = await axiosInstance.post('/device-status/create-status', formData);

      if (resData.status === 201) {
        setCreateFormState(false);

        setData((prev) => ({
          ...prev,
          values: [...prev.values, resData.data.data],
        }));

        toast({ title: 'Thêm trạng thái mới thành công', variant: 'success' });
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = handleAxiosError(error);

      toast({
        title: 'Thêm trạng thái mới thất bại',
        description: errorMessage,
        variant: 'destructive',
      });

      return false;
    }
  };

  const deleteDeviceStatuses = async (statusesSelected: string[]): Promise<void> => {
    try {
      if (statusesSelected.length > 0) {
        await axiosInstance
          .delete('/device-status/delete-statuses', {
            data: {
              statusIds: statusesSelected,
            },
          })
          .then((res) => {
            if (res.data.affected > 0) {
              toast({
                title: 'Đã xoá trạng thái thành công',
                variant: 'success',
              });

              setData((prevState) => ({
                ...prevState,
                values: prevState.values.filter((item) => !statusesSelected.includes(item.id)),
              }));
            } else {
              toast({
                title: 'Vui lòng chọn ít nhất 1 trạng thái để xoá',
                variant: 'warning',
              });
            }
          });
      }
    } catch (error) {
      const errorMessage = handleAxiosError(error);

      toast({
        title: 'Xoá loại trạng thái thiết bị thất bại',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchDeviceStatusesByQuery(searchQuery, searchFields);
  }, [searchQuery, meta.currentPage]);

  return (
    <>
      <PageBreadcrumb pageTitle={'Trạng thái thiết bị'} />

      <div className="space-y-6">
        <CustomTable
          tableTitle={'Trạng thái thiết bị'}
          tableData={data}
          onSort={(key) => console.log(`Sorting by ${key}`)}
          createItem={true}
          deleteItem={true}
          search={true}
          searchFields={searchFields}
          handleCreate={toggleCreateFormState}
          handleDelete={(itemSelected) => deleteDeviceStatuses(itemSelected)}
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
          <CreateNewDeviceStatusForm
            onSubmit={(formData: FormData) => createNewDeviceStatus(formData)}
            onClose={() => setCreateFormState(false)}
          />
        </ModelLayer>
      </div>
    </>
  );
}
