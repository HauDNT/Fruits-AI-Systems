'use client'
import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useToast } from "@/hooks/use-toast";
import CustomTable from "@/components/table/CustomTable";
import CustomPagination from "@/components/common/CustomPagination";
import ModelLayer from "@/components/common/ModelLayer";
import CreateNewEmployeeForm from "@/components/forms/CreateNewEmployeeForm";
import axiosInstance, { handleAxiosError } from "@/utils/axiosInstance";
import ChangeEmployeeInfoForm from "@/components/forms/ChangeEmployeeInfoForm";
import { CustomTableData } from "@/interfaces/table";
import { EmployeeDetailInterface, MetaPaginate } from "@/interfaces";

export default function Employees() {
    const { toast } = useToast()
    const [employeesData, setEmployeesData] = useState<CustomTableData>({
        columns: [],
        values: [],
    });
    const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 10 });
    const [searchQuery, setSearchQuery] = useState<string>("");
    const searchFields: string = "fullname,employee_code,phone_number"
    const [createFormState, setCreateFormState] = useState<boolean>(false);
    const [employeeDetailData, setEmployeeDetailData] = useState<EmployeeDetailInterface>();
    const [detailFormState, setDetailFormState] = useState<boolean>(false);
    const toggleCreateFormState = () => setCreateFormState(prev => !prev);

    const handleNextPage = () => {
        if (meta.currentPage < meta.totalPages) {
            setMeta({ ...meta, currentPage: +meta.currentPage + 1 });
        }
    }

    const handlePrevPage = () => {
        if (meta.currentPage > 1) {
            setMeta({ ...meta, currentPage: +meta.currentPage - 1 });
        }
    }

    const fetchEmployeesByQueryParams = async (searchQuery: string, searchFields: string): Promise<void> => {
        try {
            const resData = (await axiosInstance.get(
                '/employees',
                {
                    params: {
                        page: meta.currentPage,
                        limit: meta.limit,
                        queryString: searchQuery,
                        searchFields: searchFields,
                    }
                }
            )).data;

            setEmployeesData({
                columns: resData.columns,
                values: resData.values,
            });

            setMeta({
                ...meta,
                currentPage: resData.meta.currentPage,
                totalPages: resData.meta.totalPages,
            })
        } catch (e) {
            console.log('Error: ', e)
            toast({
                title: 'Không thể tải lên danh sách nhân viên',
                variant: 'destructive',
            })
        }
    }

    const handleCreateNewEmployee = async (formData: FormData): Promise<boolean> => {
        try {
            const resData = await axiosInstance.post(
                '/employees/create-employee',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })

            if (resData.status === 201) {
                setCreateFormState(false);
                setEmployeesData(prev => ({
                    ...prev,
                    values: [...prev.values, resData.data.data]
                }));

                toast({ title: 'Thêm nhân viên mới thành công', variant: 'success' });
                return true;
            }
            return false;
        } catch (error) {
            toast({
                title: "Thêm nhân viên thất bại",
                description: handleAxiosError(error),
                variant: "destructive",
            })

            return false
        }
    }

    const deleteEmployees = async (employeesSelected: string[]): Promise<void> => {
        try {
            if (employeesSelected.length > 0) {
                await axiosInstance.delete(
                    '/employees/delete-employees',
                    {
                        data: {
                            employeeIds: employeesSelected
                        }
                    }
                ).then((res) => {
                    if (res.data.affected > 0) {
                        if (res.data.affected < employeesSelected.length) {
                            toast({
                                title: `Đã xoá ${res.data.affected} / ${employeesSelected.length} nhân viên`,
                                variant: "success",
                            })
                        } else {
                            toast({
                                title: `Đã xoá nhân viên thành công`,
                                variant: "success",
                            })
                        }

                        setEmployeesData((prevState) => ({
                            ...prevState,
                            values: prevState.values.filter(item => !employeesSelected.includes(item.id))
                        }));
                    } else {
                        toast({
                            title: "Vui lòng chọn ít nhất 1 khu để xoá",
                            variant: "warning",
                        });
                    }
                })
            }
        } catch (error) {
            toast({
                title: "Xoá nhân viên thất bại",
                description: handleAxiosError(error),
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        fetchEmployeesByQueryParams(searchQuery, searchFields)
    }, [searchQuery, meta.currentPage])

    return (
        <>
            <PageBreadcrumb pageTitle={'Nhân viên'} />

            <div className="space-y-6">
                <CustomTable
                    tableTitle={'Danh sách nhân viên'}
                    tableData={employeesData}
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
                    handleDelete={(itemSelected) => deleteEmployees(itemSelected)}
                    handleSearch={(query) => setSearchQuery(query)}
                />

                <CustomPagination
                    currentPage={meta.currentPage}
                    totalPages={meta.totalPages}
                    handlePreviousPage={() => handlePrevPage()}
                    handleNextPage={() => handleNextPage()}
                    handleClickPage={(page) => setMeta(prev => ({
                        ...prev,
                        currentPage: page
                    }))}
                />

                <ModelLayer
                    isOpen={createFormState}
                    onClose={() => setCreateFormState(false)}
                    maxWidth="max-w-3xl"
                >
                    <CreateNewEmployeeForm
                        onSubmit={(formData: FormData) => handleCreateNewEmployee(formData)}
                        onClose={() => setCreateFormState(false)}
                    />
                </ModelLayer>

                <ModelLayer
                    isOpen={detailFormState}
                    onClose={() => setDetailFormState(false)}
                    maxWidth="max-w-3xl"
                >
                    {
                        employeeDetailData &&
                        <ChangeEmployeeInfoForm
                            data={employeeDetailData}
                            onUpdateSuccess={async (newEmployeeProfile) => {
                                setEmployeesData(prev => ({
                                    ...prev,
                                    values: prev.values.map(employee => employee.id === newEmployeeProfile.id ? newEmployeeProfile : employee)
                                }))
                            }}
                        />
                    }
                </ModelLayer>
            </div>
        </>
    )
}