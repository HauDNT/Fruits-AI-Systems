'use client'
import {useToast} from "@/hooks/use-toast";
import {useEffect, useState} from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomTable from "@/components/table/CustomTable";
import CustomPagination from "@/components/common/CustomPagination";
import ModelLayer from "@/components/common/ModelLayer";
import CreateNewFruitClassifyForm from "@/components/forms/CreateNewFruitClassifyForm";
import {FruitClassifyBodyType} from "@/schemas/fruit-classify.schema";
import axiosInstance from "@/utils/axiosInstance";

export default function Classification() {
    const {toast} = useToast()
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({totalPages: 1, currentPage: 1, limit: 10})
    const [searchQuery, setSearchQuery] = useState("")
    const searchFields = "batch_code, batch_desc"
    const [createFormState, setCreateFormState] = useState(false)
    const toggleCreateFormState = () => setCreateFormState(prev => !prev)

    const fetchClassifiesByQuery = async (searchQuery: string, searchFields: string) => {
        try {
            const resData = (await axiosInstance.get(
                '/fruit-classification',
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
                title: 'Không thể tải lên danh sách kết quả phân loại',
                variant: 'destructive',
            })
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

    const createNewClassify = async (formData: FruitClassifyBodyType): Promise<boolean> => {
        try {
            const resData = await axiosInstance.post('/fruit-classification/create-classify', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (resData.status === 201) {
                setCreateFormState(false);

                setData(prev => ({
                    ...prev,
                    values: [...prev.values, resData.data.data]
                }))

                toast({ title: "Thêm kết quả thành công" , variant: "success"});
                return true;
            }
        } catch (error) {
            console.log('Thêm kết quả thất bại: ', error.message)

            toast({
                title: "Thêm kết quả thất bại",
                description: "Vui lòng thử lại sau",
                variant: "destructive",
            })

            return false
        }
    }

    useEffect(() => {
        fetchClassifiesByQuery(searchQuery, searchFields)
    }, [searchQuery, meta.currentPage])

    return (
        <>
            <PageBreadcrumb pageTitle={'Kết quả phân loại'}/>

            <div className="space-y-6">
                <img src={'http://localhost:8080/uploads/results/classify_image-1745854504762-267787356.jpg'} />

                <CustomTable
                    tableTitle={'Danh sách kết quả phân loại'}
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
                    <CreateNewFruitClassifyForm
                        onSubmit={(formData: FruitClassifyBodyType) => createNewClassify(formData)}
                    />
                </ModelLayer>
            </div>
        </>
    )
}