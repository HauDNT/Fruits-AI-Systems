'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import CustomTable from "@/components/table/CustomTable";
import { useToast } from "@/hooks/use-toast";
import ModelLayer from "@/components/common/ModelLayer";
import CreateNewFruitForm from "@/components/forms/CreateNewFruitForm";
import axiosInstance, { handleAxiosError } from "@/utils/axiosInstance";
import CustomPagination from "@/components/common/CustomPagination";
import { CustomTableData } from "@/interfaces/table";
import { MetaPaginate } from "@/interfaces";
import { FruitDetailInterface } from "@/interfaces/fruitDetail";
import ChangeFruitInfoForm from "@/components/forms/ChangeFruitInfoForm";

export default function Fruits() {
    const { toast } = useToast()
    const [data, setData] = useState<CustomTableData>({
        columns: [],
        values: [],
    });
    const [meta, setMeta] = useState<MetaPaginate>({ totalPages: 1, currentPage: 1, limit: 10 });
    const [searchQuery, setSearchQuery] = useState<string>("");
    const searchFields: string = "fruit_name,fruit_desc";
    const [fruitDetailData, setFruitDetailData] = useState<FruitDetailInterface>();
    const [createFormState, setCreateFormState] = useState<boolean>(false);
    const [detailFormState, setDetailFormState] = useState<boolean>(false);
    const toggleCreateFormState = () => setCreateFormState(prev => !prev);

    const fetchFruitsByQuery = async (searchQuery: string, searchFields: string): Promise<void> => {
        try {
            const resData = (await axiosInstance.get(
                `/fruits`,
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
                title: "Xảy ra lỗi khi lấy thông tin",
                variant: "destructive",
            });
        }
    }

    const createNewFruits = async (formData: FormData): Promise<boolean> => {
        try {
            const resData = await axiosInstance.post('/fruits/create-fruit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (resData.status === 201) {
                setCreateFormState(false);

                setData(prev => ({
                    ...prev,
                    values: [...prev.values, resData.data.data]
                }))

                toast({ title: "Thêm trái cây thành công", variant: "success" });
                return true;
            }
            return false;
        } catch (error) {
            toast({
                title: "Thêm trái cây thất bại",
                description: handleAxiosError(error),
                variant: "destructive",
            });

            return false;
        }
    }

    const deleteFruits = async (fruitsSeleted: string[]): Promise<void> => {
        try {
            if (fruitsSeleted.length > 0) {
                await axiosInstance.delete(
                    '/fruits/delete-fruits',
                    {
                        data: {
                            fruitIds: fruitsSeleted,
                        }
                    },
                ).then((res) => {
                    if (res.data.affected > 0) {
                        if (res.data.affected < fruitsSeleted.length) {
                            toast({
                                title: `Đã xoá ${res.data.affected} / ${fruitsSeleted.length} trái cây`,
                                variant: "success",
                            })
                        } else {
                            toast({
                                title: `Đã xoá trái cây thành công`,
                                variant: "success",
                            })
                        }

                        setData((prevState) => ({
                            ...prevState,
                            values: prevState.values.filter(item => !fruitsSeleted.includes(item.id))
                        }));
                    } else {
                        toast({
                            title: "Vui lòng chọn ít nhất 1 trái cây để xoá",
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
            setMeta({ ...meta, currentPage: +meta.currentPage + 1 });
        }
    }

    const handlePrevPage = () => {
        if (meta.currentPage > 1) {
            setMeta({ ...meta, currentPage: +meta.currentPage - 1 });
        }
    }

    useEffect(() => {
        fetchFruitsByQuery(searchQuery, searchFields)
    }, [searchQuery, meta.currentPage])

    return (
        <>
            <PageBreadcrumb pageTitle={'Trái cây'} />

            <div className="space-y-6">
                <CustomTable
                    tableTitle={'Danh sách trái cây'}
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
                        setFruitDetailData(item as FruitDetailInterface);
                    }}
                    handleDelete={(itemSelected) => deleteFruits(itemSelected)}
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
                    <CreateNewFruitForm
                        onSubmit={(formData: FormData) => createNewFruits(formData)}
                    />
                </ModelLayer>

                <ModelLayer
                    isOpen={detailFormState}
                    onClose={() => setDetailFormState(false)}
                    maxWidth="max-w-3xl"
                >
                    {
                        fruitDetailData &&
                        <ChangeFruitInfoForm
                            data={fruitDetailData}
                            onUpdateSuccess={async (newFruitData) => {
                                setData(prev => ({
                                    ...prev,
                                    values: prev.values.map(fruit => fruit.id === newFruitData.id ? newFruitData : fruit)
                                }))
                            }}
                        />
                    }
                </ModelLayer>
            </div>
        </>
    )
}