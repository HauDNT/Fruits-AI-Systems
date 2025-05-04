'use client'
import {useToast} from "@/hooks/use-toast";
import {useEffect, useState} from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomTable from "@/components/table/CustomTable";
import CustomPagination from "@/components/common/CustomPagination";
import ModelLayer from "@/components/common/ModelLayer";
import axiosInstance from "@/utils/axiosInstance";
import PreviewClassifyResult from "@/components/forms/PreviewClassifyResult";
import {ClassifyResultInterface} from "@/interfaces";
import { useSocketFruitClassify } from "@/hooks/useSocketFruitClassify";

export default function Classification() {
    const {toast} = useToast()
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({totalPages: 1, currentPage: 1, limit: 15})
    const [searchQuery, setSearchQuery] = useState("")
    const searchFields = "fruit, areaBelong, confidence_level";
    const [detailItemData, setDetailItemData] = useState<ClassifyResultInterface>(null);
    const [detailFormState, setDetailFormState] = useState(false)

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

    const handleDetail = (item: ClassifyResultInterface) => {
        setDetailItemData(item)
        setDetailFormState(true)
    }

    useEffect(() => {
        fetchClassifiesByQuery(searchQuery, searchFields)
    }, [searchQuery, meta.currentPage])

    useSocketFruitClassify((newResult: ClassifyResultInterface) => {
        console.log('Socket newFruitClassification - ON')

        toast({
            title: "Phát hiện kết quả phân loại mới",
            description: `
                Loại: ${newResult.fruit} - ${newResult.fruitType}, 
                Độ tin cậy: ${parseFloat(newResult.confidence_level * 100).toFixed(2)} %
            `,
            variant: "success",
        });

        setData(prev => ({
            ...prev,
            values: [newResult, ...prev.values], // Thêm lên đầu bảng
        }));
    });

    return (
        <div>
            <PageBreadcrumb pageTitle={'Kết quả phân loại'}/>

            <div className="space-y-6">
                <CustomTable
                    tableTitle={'Danh sách kết quả phân loại'}
                    tableData={data}
                    onSort={(key) => console.log(`Sorting by ${key}`)}
                    createItem={false}
                    detailItem={true}
                    deleteItem={true}
                    search={true}
                    searchFields={searchFields}
                    handleDetail={(item) => handleDetail(item)}
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
                    isOpen={detailFormState}
                    onClose={() => setDetailFormState(false)}
                    maxWidth="max-w-3xl"
                >
                    <PreviewClassifyResult data={detailItemData} />
                </ModelLayer>
            </div>
        </div>
    )
}