'use client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HttpStatusCode } from 'axios';
import axiosInstance, { handleAxiosError } from '@/utils/axiosInstance';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomTable from '@/components/table/CustomTable';
import CreateNewFruitTypeForm from '@/components/forms/CreateNewFruitTypeForm';
import ModelLayer from '@/components/common/ModelLayer';
import { FruitTypeBodyType } from '@/schemas/fruit.schema';
import CustomPagination from '@/components/common/CustomPagination';
import { CustomTableData } from '@/interfaces/table';
import { FruitType, MetaPaginate } from '@/interfaces';
import ChangeFruitTypeForm from '@/components/forms/ChangeFruitTypeForm';
import { usePaginate } from '@/hooks/usePaginate';

export default function FruitTypes() {
  const { toast } = useToast();
  const [data, setData] = useState<CustomTableData>({
    columns: [],
    values: [],
  });
  const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchFields: string = 'type_name,type_desc';
  const [fruitTypeData, setFruitTypeData] = useState<FruitType>();
  const [createFormState, setCreateFormState] = useState<boolean>(false);
  const [detailFormState, setDetailFormState] = useState<boolean>(false);
  const toggleCreateFormState = () => setCreateFormState((prev) => !prev);
  const { handlePrevPage, handleNextPage, handleClickPage } = usePaginate({
    meta,
    setMetaCallback: setMeta,
  });

  const fetchFruitTypesByQuery = async (
    searchQuery: string,
    searchFields: string,
  ): Promise<void> => {
    try {
      const resData = (
        await axiosInstance.get(`/fruit-types`, {
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

      // Update meta
      setMeta({
        ...meta,
        currentPage: resData.meta.currentPage,
        totalPages: resData.meta.totalPages,
      });
    } catch (e) {
      console.log('Error: ', e);
      toast({
        title: 'Xảy ra lỗi khi lấy thông tin',
        variant: 'destructive',
      });
    }
  };

  const handleAddNewFruitType = async (newType: FruitTypeBodyType): Promise<boolean> => {
    try {
      if (!newType) {
        toast({
          title: 'Vui lòng điền đẩy đủ thông tin',
          variant: 'destructive',
        });
        return false;
      }

      const result = await axiosInstance.post<any>('/fruit-types/create-type', newType);

      if (result.status !== HttpStatusCode.Created) {
        throw new Error(result?.data?.message || 'Tạo thất bại, vui lòng thử lại');
        return false;
      }

      toast({
        title: result.data.message,
        variant: 'success',
      });

      setCreateFormState(false);
      setData((prev) => ({
        ...prev,
        values: [...prev.values, result.data.data],
      }));

      return true;
    } catch (error) {
      toast({
        title: 'Xảy ra lỗi khi tạo trạng thái mới',
        variant: 'destructive',
        description: handleAxiosError(error),
      });

      return false;
    }
  };

  const deleteFruitTypes = async (fruitTypeSeleted: string[]): Promise<void> => {
    try {
      if (fruitTypeSeleted.length > 0) {
        await axiosInstance
          .delete('/fruit-types/delete-types', {
            data: {
              fruitTypeIds: fruitTypeSeleted,
            },
          })
          .then((res) => {
            if (res.data.affected > 0) {
              if (res.data.affected < fruitTypeSeleted.length) {
                toast({
                  title: `Đã ${res.data.affected} / ${fruitTypeSeleted.length} tình trạng`,
                  variant: 'success',
                });
              } else {
                toast({
                  title: `Đã xoá tình trạng thành công`,
                  variant: 'success',
                });
              }

              setData((prevState) => ({
                ...prevState,
                values: prevState.values.filter((item) => !fruitTypeSeleted.includes(item.id)),
              }));
            } else {
              toast({
                title: 'Vui lòng chọn ít nhất 1 tình trạng',
                variant: 'warning',
              });
            }
          });
      }
    } catch (error) {
      const errorMessage = handleAxiosError(error);

      toast({
        title: 'Xoá trạng thái thất bại',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchFruitTypesByQuery(searchQuery, searchFields);
  }, [searchQuery, meta.currentPage]);

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
          handleDelete={(itemSelected) => deleteFruitTypes(itemSelected)}
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
          onSubmit={(values: FruitTypeBodyType) => handleAddNewFruitType(values)}
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
