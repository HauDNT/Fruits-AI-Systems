'use client';
import { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import CustomTable from '@/components/table/CustomTable';
import CustomPagination from '@/components/common/CustomPagination';
import ModelLayer from '@/components/common/ModelLayer';
import CreateNewEmployeeForm from '@/components/forms/CreateNewEmployeeForm';
import axiosInstance, { handleAxiosError } from '@/utils/axiosInstance';
import ChangeEmployeeInfoForm from '@/components/forms/ChangeEmployeeInfoForm';
import { CustomTableData } from '@/interfaces/table';
import { EmployeeDetailInterface, MetaPaginate } from '@/interfaces';
import {
  useToast,
  usePaginate,
  useFetchResource,
  useCreateResource,
  useDeleteResource,
} from '@/hooks';

export default function Employees() {
  const { toast } = useToast();
  const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchFields: string = 'fullname,employee_code,phone_number';
  const { data: cacheData } = useFetchResource({
    resource: 'employees',
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
  const [employeeDetailData, setEmployeeDetailData] = useState<EmployeeDetailInterface>();
  const [detailFormState, setDetailFormState] = useState<boolean>(false);
  const toggleCreateFormState = () => setCreateFormState((prev) => !prev);

  const createNewEmployee = useCreateResource(
    'employees',
    'formdata',
    () => {
      toast({ title: 'Thêm nhân viên mới thành công', variant: 'success' });
      setCreateFormState(false);
    },
    (error) => {
      toast({
        title: 'Thêm nhân viên mới thất bại',
        description: handleAxiosError(error),
        variant: 'destructive',
      });
    },
  );

  const deleteEmployees = useDeleteResource(
    'employees',
    'employeeIds',
    () => {
      toast({
        title: `Đã xoá nhân viên thành công`,
        variant: 'success',
      });
    },
    (error) => {
      toast({
        title: 'Xoá nhân viên thất bại',
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
          tableTitle={'Danh sách nhân viên'}
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
            setEmployeeDetailData(item as EmployeeDetailInterface);
          }}
          handleDelete={async (itemSelected) => deleteEmployees.mutateAsync(itemSelected)}
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
          <CreateNewEmployeeForm
            onSubmit={async (formData: FormData) => createNewEmployee.mutateAsync(formData)}
            onClose={() => setCreateFormState(false)}
          />
        </ModelLayer>

        <ModelLayer
          isOpen={detailFormState}
          onClose={() => setDetailFormState(false)}
          maxWidth="max-w-3xl"
        >
          {employeeDetailData && (
            <ChangeEmployeeInfoForm
              data={employeeDetailData}
              onUpdateSuccess={async (newEmployeeProfile) => {
                setData((prev) => ({
                  ...prev,
                  values: prev.values.map((employee) =>
                    employee.id === newEmployeeProfile.id ? newEmployeeProfile : employee,
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
