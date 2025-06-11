'use client'
import {useToast} from "@/hooks/use-toast";
import {useEffect, useState} from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomTable from "@/components/table/CustomTable";
import CustomPagination from "@/components/common/CustomPagination";
import ModelLayer from "@/components/common/ModelLayer";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";
import CreateNewDeviceTypeForm from "@/components/forms/CreateNewDeviceTypeForm";
import { CustomTableData } from "@/interfaces/table";
import { MetaPaginate } from "@/interfaces";

export default function DeviceTypes() {
    const {toast} = useToast()
    const [data, setData] = useState<CustomTableData>({
        columns: [],
        values: [],
    })
    const [meta, setMeta] = useState<MetaPaginate>({totalPages: 1, currentPage: 1, limit: 10})
    const [searchQuery, setSearchQuery] = useState<string>("")
    const searchFields: string = "type_name"
    const [createFormState, setCreateFormState] = useState<boolean>(false)
    const toggleCreateFormState = () => setCreateFormState(prev => !prev)

    const fetchDeviceTypesByQuery = async (searchQuery: string, searchFields: string): Promise<void> => {
        try {
            const resData = (await axiosInstance.get(
                '/device-types',
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
            })

            setMeta({
                ...meta,
                currentPage: resData.meta.currentPage,
                totalPages: resData.meta.totalPages,
            })
        } catch (e) {
            toast({
                title: 'Không thể tải lên danh sách loại thiết bị',
                variant: 'destructive',
            })
        }
    }

    const createNewDeviceType = async (formData: FormData): Promise<boolean> => {
        try {
            const resData = await axiosInstance.post(
                '/device-types/create-type',
                formData,
            )

            if (resData.status === 201) {
                setCreateFormState(false);

                setData(prev => ({
                    ...prev,
                    values: [...prev.values, resData.data.data]
                }))

                toast({ title: "Thêm loại thiết bị thành công" , variant: "success"});
                return true;
            }
            return false;
        } catch (error) {
            const errorMessage = handleAxiosError(error);

            toast({
                title: "Thêm loại thiết bị mới thất bại",
                description: errorMessage,
                variant: "destructive",
            });

            return false;
        }
    }

    const deleteDeviceTypes = async (typesSelected: string[]): Promise<void> => {
        try {
            if (typesSelected.length > 0) {
                await axiosInstance.delete(
                    '/device-types/delete-types',
                    {
                        data: {
                            typeIds: typesSelected
                        }
                    }
                ).then((res) => {
                    if (res.data.affected > 0) {
                        toast({
                            title: 'Đã xoá loại thiết bị thành công',
                            variant: "success",
                        })

                        setData((prevState) => ({
                            ...prevState,
                            values: prevState.values.filter(item => !typesSelected.includes(item.id))
                        }));
                    } else {
                        toast({
                            title: "Vui lòng chọn ít nhất 1 loại thiết bị để xoá",
                            variant: "warning",
                        });
                    }
                })
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);

            toast({
                title: "Xoá loại thiết bị thất bại",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }

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

    useEffect(() => {
        fetchDeviceTypesByQuery(searchQuery, searchFields)
    }, [searchQuery, meta.currentPage])

    return (
        <>
            <PageBreadcrumb pageTitle={'Loại thiết bị'}/>

            <div className="space-y-6">
                <CustomTable
                    tableTitle={'Loại thiết bị'}
                    tableData={data}
                    onSort={(key) => console.log(`Sorting by ${key}`)}
                    createItem={true}
                    deleteItem={true}
                    search={true}
                    searchFields={searchFields}
                    handleCreate={toggleCreateFormState}
                    handleDelete={(itemSelected) => deleteDeviceTypes(itemSelected)}
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
                    <CreateNewDeviceTypeForm
                        onSubmit={(formData: FormData) => createNewDeviceType(formData)}
                        onClose={() => setCreateFormState(false)}
                    />
                </ModelLayer>
            </div>
        </>
    )
}