'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {useState} from "react";
import CustomTable from "@/components/table/CustomTable";

export default function Fruits() {
    const [data, setData] = useState([])

    return (
        <div>
            <PageBreadcrumb pageTitle={'Trái cây'}/>

            {
                data?.columns && (
                    <div className="space-y-6">
                        <CustomTable
                            tableTitle={'Danh sách trái cây'}
                            tableData={data}
                            onSort={(key) => console.log(`Sorting by ${key}`)}
                            createItem={true}
                            deleteItem={true}
                            search={true}
                            searchFields={['fruit_name', 'fruit_des']}
                            handleCreate={toggleCreateFormState}
                            handleDelete={(itemSelected) => console.table(itemSelected)}
                            handleSearch={(query) => console.log(query)}
                        />
                    </div>
                )
            }
        </div>
    )
}