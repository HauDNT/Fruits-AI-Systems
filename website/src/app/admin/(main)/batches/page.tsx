'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomTable from "@/components/table/CustomTable";
import {useToast} from "@/hooks/use-toast";
import {useEffect, useState} from "react";
import CustomPagination from "@/components/common/CustomPagination";
import ModelLayer from "@/components/common/ModelLayer";
import axiosInstance from "@/utils/axiosInstance";
import {AreaBodyType} from "@/schemas/area.schema";
import CreateNewAreaForm from "@/components/forms/CreateNewAreaForm";

export default function Batches() {
    const {toast} = useToast()
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({totalPages: 1, currentPage: 1, limit: 10})
    const [searchQuery, setSearchQuery] = useState("")
    const searchFields = "batch_code, batch_desc"
    const [createFormState, setCreateFormState] = useState(false)
    const toggleCreateFormState = () => setCreateFormState(prev => !prev)

    const fetchBatchesByQuery = async (searchQuery: string, searchFields: string) => {
        try {
            const resData = (await axiosInstance.get(
                '/fruit-batches',
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
                title: 'Không thể tải lên danh sách lô',
                variant: 'destructive',
            })
        }
    }

    const createNewBatch = async (formData: AreaBodyType): Promise<boolean> => {
        // try {
        //     const resData = await axiosInstance.post(
        //         'areas/create-area',
        //         formData,
        //         {
        //             headers: { 'Content-Type': 'multipart/form-data' },
        //         })
        //
        //     if (resData.status === 201) {
        //         setCreateFormState(false);
        //
        //         setData(prev => ({
        //             ...prev,
        //             values: [...prev.values, resData.data.data]
        //         }))
        //
        //         toast({ title: "Thêm khu thành công" , variant: "success"});
        //         return true;
        //     }
        // } catch (e) {
        //     console.error('Thêm khu thất bại:', error);
        //
        //     toast({
        //         title: "Thêm khu thất bại",
        //         description: "Vui lòng thử lại sau",
        //         variant: "destructive",
        //     });
        //
        //     return false;
        // }
    }

    const deleteBatches = async (batchesSelected: string[]) => {
        // try {
        //     if (batchesSelected.length > 0) {
        //         await axiosInstance.delete(
        //             '/areas/delete-areas',
        //             {
        //                 data: {
        //                     areaIds: batchesSelected
        //                 }
        //             }
        //         ).then((res) => {
        //             if (res.data.affected > 0) {
        //                 if (res.data.affected < batchesSelected.length) {
        //                     toast({
        //                         title: `Đã xoá ${res.data.affected} / ${batchesSelected.length} khu`,
        //                         variant: "success",
        //                     })
        //                 } else {
        //                     toast({
        //                         title: `Đã xoá khu phân loại thành công`,
        //                         variant: "success",
        //                     })
        //                 }
        //
        //                 setData((prevState) => ({
        //                     ...prevState,
        //                     values: prevState.values.filter(item => !batchesSelected.includes(item.id))
        //                 }));
        //             } else {
        //                 toast({
        //                     title: "Vui lòng chọn ít nhất 1 khu để xoá",
        //                     variant: "warning",
        //                 });
        //             }
        //         })
        //     }
        // } catch (error) {
        //     toast({
        //         title: "Xoá trạng thái thất bại",
        //         description: "Hãy thử lại sau",
        //         variant: "destructive",
        //     });
        // }
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
        fetchBatchesByQuery(searchQuery, searchFields)
    }, [searchQuery, meta.currentPage])

    return (
        <>
            <PageBreadcrumb pageTitle={'Lô trái cây'}/>

            <div className="space-y-6">
                <CustomTable
                    tableTitle={'Danh sách lô trái cây'}
                    tableData={data}
                    onSort={(key) => console.log(`Sorting by ${key}`)}
                    createItem={true}
                    deleteItem={true}
                    search={true}
                    searchFields={searchFields}
                    handleCreate={toggleCreateFormState}
                    handleDelete={(itemSelected) => deleteBatches(itemSelected)}
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
                        onSubmit={(formData: AreaBodyType) => createNewBatch(formData)}
                    />
                </ModelLayer>
            </div>
        </>
    )
}