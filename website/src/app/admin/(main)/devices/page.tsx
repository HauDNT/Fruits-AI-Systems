'use client'

import {useToast} from "@/hooks/use-toast";
import {useEffect, useState} from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomTable from "@/components/table/CustomTable";
import CustomPagination from "@/components/common/CustomPagination";
import ModelLayer from "@/components/common/ModelLayer";
import {DeviceBodyType} from '@/schemas/device.schema';
import CreateNewDeviceForm from "@/components/forms/CreateNewDeviceForm";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";

export default function Devices() {
    const {toast} = useToast()
    const [data, setData] = useState({
        columns: [],
        values: [],
    });
    const [meta, setMeta] = useState({totalPages: 1, currentPage: 1, limit: 10})
    const [searchQuery, setSearchQuery] = useState("")
    const searchFields = "device_code,deviceType,deviceStatus,areaBelong"
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

    const fetchDevicesByQueryParams = async (searchQuery: string, searchFields: string) => {
        try {
            const resData = (await axiosInstance.get(
                '/devices',
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
            toast({
                title: 'Không thể tải lên danh sách thiết bị',
                variant: 'destructive',
            })
        }
    }

    const handleCreateNewDevice = async (formData: DeviceBodyType) => {
        try {
            const resData = await axiosInstance.post('/devices/create-device', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            if (resData.status === 201) {
                setCreateFormState(false)

                setData(prev => ({
                    ...prev,
                    values: [...prev.values, resData.data.data]
                }))

                toast({ title: "Thêm thiết bị thành công" , variant: "success"})
                return true
            }
        }  catch (error) {
            const errorMessage = handleAxiosError(error);

            toast({
                title: "Thêm thiết bị thất bại",
                description: errorMessage,
                variant: "destructive",
            })

            return false
        }
    }

    useEffect(() => {
        fetchDevicesByQueryParams(searchQuery, searchFields)
    }, [searchQuery, meta.currentPage])

    return (
        <>
            <PageBreadcrumb pageTitle={'Thiết bị'}/>

            <div className="space-y-6">
                <CustomTable
                    tableTitle={'Danh sách thiết bị'}
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
                    <CreateNewDeviceForm
                        onSubmit={(formData: DeviceBodyType) => handleCreateNewDevice(formData)}
                        onClose={() => setCreateFormState(false)}
                    />
                </ModelLayer>
            </div>
        </>
    )
}