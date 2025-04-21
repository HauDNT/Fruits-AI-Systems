'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {useEffect, useState} from "react";
import CustomTable from "@/components/table/CustomTable";
import {useToast} from "@/hooks/use-toast";
import {FruitBodyType} from "@/schemas/fruit.schema";
import ModelLayer from "@/components/common/ModelLayer";
import CreateNewFruitForm from "@/components/forms/CreateNewFruitForm";

export default function Fruits() {
    const {toast} = useToast()
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({totalPages: 1, currentPage: 1, limit: 10})
    const [searchQuery, setSearchQuery] = useState("")
    const searchFields = "fruit_name, fruit_desc"
    const [createFormState, setCreateFormState] = useState(false)
    const toggleCreateFormState = () => setCreateFormState(prev => !prev)

    useEffect(() => {

    }, [])

    return (
        <div>
            <PageBreadcrumb pageTitle={'Trái cây'}/>

            <div className="space-y-6">
                <CustomTable
                    tableTitle={'Danh sách trái cây'}
                    tableData={data}
                    onSort={(key) => console.log(`Sorting by ${key}`)}
                    createItem={true}
                    deleteItem={true}
                    search={true}
                    searchFields={searchFields}
                    handleCreate={toggleCreateFormState}
                    handleDelete={(itemSelected) => console.table(itemSelected)}
                    handleSearch={(query) => console.log(query)}
                />

                <ModelLayer
                    isOpen={createFormState}
                    onClose={() => setCreateFormState(false)}
                    maxWidth="max-w-3xl"
                >
                    <CreateNewFruitForm
                        onSubmit={(values: FruitBodyType) => console.log(values)}
                    />
                </ModelLayer>
            </div>
        </div>
    )
}