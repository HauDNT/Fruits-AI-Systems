'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomTable from "@/components/table/CustomTable";
import {useToast} from "@/hooks/use-toast";
import {useEffect, useState} from "react";
import CustomPagination from "@/components/common/CustomPagination";
import ModelLayer from "@/components/common/ModelLayer";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";
import {AreaBodyType} from "@/schemas/area.schema";
import CreateNewAreaForm from "@/components/forms/CreateNewAreaForm";

export default function Areas() {
    const {toast} = useToast()
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({totalPages: 1, currentPage: 1, limit: 10})
    const [searchQuery, setSearchQuery] = useState("")
    const searchFields = "area_code, area_desc"
    const [createFormState, setCreateFormState] = useState(false)
    const toggleCreateFormState = () => setCreateFormState(prev => !prev)

    const fetchAreasByQuery = async (searchQuery: string, searchFields: string) => {
        try {
            const resData = (await axiosInstance.get(
                '/areas',
                {
                    params: {
                        page: meta.currentPage,
                        limit: meta.limit,
                        queryString: searchQuery,
                        searchFields: searchFields,
                    }
                })).data;

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
                title: 'Không thể tải lên danh sách khu',
                variant: 'destructive',
            })
        }
    }

    const createNewArea = async (formData: AreaBodyType): Promise<boolean> => {
        try {
            const resData = await axiosInstance.post(
                'areas/create-area',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })

            if (resData.status === 201) {
                setCreateFormState(false);

                setData(prev => ({
                    ...prev,
                    values: [...prev.values, resData.data.data]
                }))

                toast({ title: "Thêm khu thành công" , variant: "success"});
                return true;
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            console.error('Thêm khu thất bại:', error);

            toast({
                title: "Thêm khu thất bại",
                description: errorMessage,
                variant: "destructive",
            });

            return false;
        }
    }

    const deleteAreas = async (areasSelected: string[]) => {
        try {
            if (areasSelected.length > 0) {
                await axiosInstance.delete(
                    '/areas/delete-areas',
                    {
                        data: {
                            areaIds: areasSelected
                        }
                    }
                ).then((res) => {
                    if (res.data.affected > 0) {
                        if (res.data.affected < areasSelected.length) {
                            toast({
                                title: `Đã xoá ${res.data.affected} / ${areasSelected.length} khu`,
                                variant: "success",
                            })
                        } else {
                            toast({
                                title: `Đã xoá khu phân loại thành công`,
                                variant: "success",
                            })
                        }

                        setData((prevState) => ({
                            ...prevState,
                            values: prevState.values.filter(item => !areasSelected.includes(item.id))
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
            console.log("Xoá trạng thái thất bại")

            toast({
                title: "Xoá trạng thái thất bại",
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
        fetchAreasByQuery(searchQuery, searchFields)
    }, [searchQuery, meta.currentPage])

    return (
        <>
            <PageBreadcrumb pageTitle={'Khu phân loại'}/>

            <div className="space-y-6">
                <CustomTable
                    tableTitle={'Danh sách khu phân loại'}
                    tableData={data}
                    onSort={(key) => console.log(`Sorting by ${key}`)}
                    createItem={true}
                    deleteItem={true}
                    search={true}
                    searchFields={searchFields}
                    handleCreate={toggleCreateFormState}
                    handleDelete={(itemSelected) => deleteAreas(itemSelected)}
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
                    <CreateNewAreaForm
                        onSubmit={(formData: AreaBodyType) => createNewArea(formData)}
                    />
                </ModelLayer>
            </div>
        </>
    )
}