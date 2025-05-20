'use client'

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {useToast} from "@/hooks/use-toast";
import {useEffect, useState} from "react";
import CustomTable from "@/components/table/CustomTable";
import CustomPagination from "@/components/common/CustomPagination";
import ModelLayer from "@/components/common/ModelLayer";
import CreateNewEmployeeForm from "@/components/forms/CreateNewEmployeeForm";
import {EmployeeBodyType} from "@/schemas/employee.schema";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";

export default function Employees() {
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
                    deleteItem={true}
                    search={true}
                    searchFields={searchFields}
                    handleCreate={toggleCreateFormState}
                    handleDelete={(itemSelected) => console.log(itemSelected)}
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