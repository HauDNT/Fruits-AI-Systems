'use client';
import { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomTable from '@/components/table/CustomTable';
import { handleAxiosError } from '@/utils/axiosInstance';
import CustomPagination from '@/components/common/CustomPagination';
import ModelLayer from '@/components/common/ModelLayer';
import CreateNewUserForm from '@/components/forms/CreateNewUserForm';
import ChangeUserInfoForm from '@/components/forms/ChangeUserInfoForm';
import { UserBodyType } from '@/schemas/user.schema';
import { CustomTableData } from '@/interfaces/table';
import { MetaPaginate } from '@/interfaces';
import { UserInfo } from '@/interfaces';
import {
  useToast,
  usePaginate,
  useFetchResource,
  useCreateResource,
  useDeleteResource,
} from '@/hooks';

export default function Users() {
  const { toast } = useToast();
  const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchFields: string = 'username';
  const { data: cacheData } = useFetchResource({
    resource: 'user',
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
  const [userSelected, setUserSelected] = useState<UserInfo>();
  const [createFormState, setCreateFormState] = useState<boolean>(false);
  const [editFormState, setEditFormState] = useState<boolean>(false);
  const toggleCreateFormState = () => setCreateFormState((prev) => !prev);

  const createNewUser = useCreateResource(
    'user',
    'json',
    () => {
      toast({ title: 'Thêm tài khoản thành công', variant: 'success' });
      setCreateFormState(false);
    },
    (error) => {
      toast({
        title: 'Thêm tài khoản thất bại',
        description: handleAxiosError(error),
        variant: 'destructive',
      });
    },
  );

  const deleteUsers = useDeleteResource(
    'user',
    'userIds',
    () => {
      toast({
        title: `Đã xoá tài khoản thành công`,
        variant: 'success',
      });
    },
    (error) => {
      toast({
        title: 'Xoá tài khoản thất bại',
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
      <PageBreadcrumb pageTitle={'Nhân viên'} />

      <div className="space-y-6">
        <CustomTable
          tableTitle={'Danh sách tài khoản nhân viên'}
          tableData={data}
          onSort={(key) => console.log(`Sorting by ${key}`)}
          createItem={true}
          deleteItem={true}
          detailItem={true}
          search={true}
          searchFields={searchFields}
          handleCreate={toggleCreateFormState}
          handleDelete={async (itemSelected) => deleteUsers.mutateAsync(itemSelected)}
          handleDetail={(itemSelected) => {
            setUserSelected(itemSelected as UserInfo);
            setEditFormState(true);
          }}
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
          <CreateNewUserForm
            onSubmit={async (formData: UserBodyType) => createNewUser.mutateAsync(formData)}
          />
        </ModelLayer>

        <ModelLayer
          isOpen={editFormState}
          onClose={() => setEditFormState(false)}
          maxWidth="max-w-3xl"
        >
          {userSelected && (
            <ChangeUserInfoForm
              data={userSelected}
              onUpdateSuccess={async (newUserData) => {
                setData((prev) => ({
                  ...prev,
                  values: prev.values.map((user) =>
                    user.id === newUserData.id ? newUserData : user,
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
