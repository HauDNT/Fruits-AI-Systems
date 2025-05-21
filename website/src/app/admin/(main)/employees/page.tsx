'use client'
import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {useToast} from "@/hooks/use-toast";
import CustomTable from "@/components/table/CustomTable";
import CustomPagination from "@/components/common/CustomPagination";
import ModelLayer from "@/components/common/ModelLayer";
import CreateNewEmployeeForm from "@/components/forms/CreateNewEmployeeForm";
import {EmployeeBodyType} from "@/schemas/employee.schema";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";

export default function Employees() {
    const router = useRouter()
    const {toast} = useToast()
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({totalPages: 1, currentPage: 1, limit: 10})
    const [searchQuery, setSearchQuery] = useState("")
    const searchFields = "fullname, employee_code, phone_number"
    const [createFormState, setCreateFormState] = useState(false)
    const toggleCreateFormState = () => setCreateFormState(prev => !prev)

    const handleNextPage = () => {
        if (meta.currentPage < meta.totalPages) {
            setMeta({...meta, currentPage: +meta.currentPage + 1});
        }
    }

    const handlePrevPage = () => {
        if (meta.currentPage > 1) {
            setMeta({...meta, currentPage: +meta.currentPage - 1});
        }
    }

    const fetchEmployeesByQueryParams = async (searchQuery: string, searchFields: string) => {
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

            setData({
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

    const handleCreateNewEmployee = async (formData: EmployeeBodyType) => {
        try {
            const resData = await axiosInstance.post(
                '/employees/create-employee',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })

            if (resData.status === 201) {
                setCreateFormState(false)
                setData(prev => ({
                    ...prev,
                    values: [...prev.values, resData.data.data]
                }))

                toast({ title: 'Thêm nhân viên mới thành công', variant: 'success' })
                return true
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            console.log('Thêm nhân viên thất bại: ', error)

            toast({
                title: "Thêm nhân viên thất bại",
                description: errorMessage,
                variant: "destructive",
            })

            return false
        }
    }

    const deleteEmployees = async (employeesSelected: string[]) => {
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

                        setData((prevState) => ({
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
            const errorMessage = handleAxiosError(error);
            console.log("Xoá nhân viên thất bại")

            toast({
                title: "Xoá nhân viên thất bại",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        fetchEmployeesByQueryParams(searchQuery, searchFields)
    }, [searchQuery, meta.currentPage])

    return (
        <>
            <PageBreadcrumb pageTitle={'Nhân viên'}/>

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
                    handleDetail={(item) => router.push(`/admin/employees/${item.id}`)}
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
                        onSubmit={(formData: EmployeeBodyType) => handleCreateNewEmployee(formData)}
                        onClose={() => setCreateFormState(false)}
                    />

                </ModelLayer>
            </div>
        </>
    )
}