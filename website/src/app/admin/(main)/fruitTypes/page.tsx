'use client'
import {useEffect, useState} from "react";
import {useSearchParams} from 'next/navigation';
import {useToast} from "@/hooks/use-toast";
import {HttpStatusCode} from "axios";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomTable from "@/components/table/CustomTable";
import CreateNewFruitTypeForm from "@/components/forms/CreateNewFruitTypeForm";
import ModelLayer from "@/components/common/ModelLayer";
import {FruitTypeBodyType} from "@/schemas/auth.schema";
import CustomPagination from "@/components/common/CustomPagination";

export default function FruitTypes() {
    const {toast} = useToast()
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({totalPages: 1, currentPage: 1, limit: 10})
    const [searchQuery, setSearchQuery] = useState("")
    const searchFields = "type_name, type_desc"
    const [createFormState, setCreateFormState] = useState(false)

    const toggleCreateFormState = () => setCreateFormState(prev => !prev)

    const fetchFruitTypesByQuery = async (searchQuery: string, searchFields: string) => {
        try {
            const resData = (await axiosInstance.get(
                `/fruit-types`,
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

            // Update meta
            setMeta({
                ...meta,
                currentPage: resData.meta.currentPage,
                totalPages: resData.meta.totalPages,
            })
        } catch (e) {
            console.log('Error: ', e)
            toast({
                title: "Xảy ra lỗi khi lấy thông tin",
                variant: "destructive",
            });
        }
    }

    const handleAddNewFruitType = async (newType: FruitTypeBodyType) => {
        try {
            if (!newType) {
                toast({
                    title: "Vui lòng điền đẩy đủ thông tin",
                    variant: "destructive",
                });
                return;
            }

            const result = await axiosInstance.post<any>('/fruit-types/create-type', newType);

            if (result.status !== HttpStatusCode.Created) {
                throw new Error(result?.data?.message || 'Tạo thất bại, vui lòng thử lại');
            }

            toast({
                title: result.data.message,
                variant: "success",
            });

            setCreateFormState(false)
            setData(prev => ({
                ...prev,
                values: [...prev.values, result.data.data],
            }));

        } catch (error) {
            const errorMessage = handleAxiosError(error);

            toast({
                title: "Xảy ra lỗi khi tạo trạng thái mới",
                variant: "destructive",
                description: errorMessage,
            });
        }
    }

    const deleteFruitTypes = async (fruitTypeSeleted: string[]) => {
        try {
            if (fruitTypeSeleted.length > 0) {
                await axiosInstance.delete(
                    '/fruit-types/delete-types',
                    {
                        data: {
                            fruitTypeIds: fruitTypeSeleted,
                        }
                    },
                ).then((res) => {
                    if (res.data.affected > 0) {
                        if (res.data.affected < fruitTypeSeleted.length) {
                            toast({
                                title: `Đã ${res.data.affected} / ${fruitTypeSeleted.length} tình trạng`,
                                variant: "success",
                            })
                        } else {
                            toast({
                                title: `Đã xoá tình trạng thành công`,
                                variant: "success",
                            })
                        }

                        setData((prevState) => ({
                            ...prevState,
                            values: prevState.values.filter(item => !fruitTypeSeleted.includes(item.id))
                        }));
                    } else {
                        toast({
                            title: "Vui lòng chọn ít nhất 1 tình trạng",
                            variant: "warning",
                        });
                    }
                })
            }
        } catch (error) {
            toast({
                title: "Xoá trạng thái thất bại",
                description: "Hãy thử lại sau",
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
        fetchFruitTypesByQuery(searchQuery, searchFields)
    }, [searchQuery, meta.currentPage])

    return (
        <div>
            <PageBreadcrumb pageTitle={'Trạng thái trái cây'}/>

            <div className="space-y-6">
                <CustomTable
                    tableTitle={'Danh sách trạng thái'}
                    tableData={data}
                    onSort={(key) => console.log(`Sorting by ${key}`)}
                    createItem={true}
                    deleteItem={true}
                    search={true}
                    searchFields={searchFields}
                    handleCreate={toggleCreateFormState}
                    handleDelete={(itemSelected) => deleteFruitTypes(itemSelected)}
                    handleSearch={(query) => setSearchQuery(query)}
                />
            </div>

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
                <CreateNewFruitTypeForm
                    onSubmit={(values: FruitTypeBodyType) => handleAddNewFruitType(values)}
                />
            </ModelLayer>
        </div>
    )
}