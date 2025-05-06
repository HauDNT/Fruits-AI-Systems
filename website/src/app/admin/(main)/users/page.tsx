'use client'

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {useToast} from "@/hooks/use-toast";
import {useEffect, useState} from "react";
import CustomTable from "@/components/table/CustomTable";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";
import CustomPagination from "@/components/common/CustomPagination";
import ModelLayer from "@/components/common/ModelLayer";
import CreateNewUserForm from "@/components/forms/CreateNewUserForm";
import {UserBodyType} from "@/schemas/user.schema";

export default function Users() {
    const {toast} = useToast()
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({totalPages: 1, currentPage: 1, limit: 10})
    const [searchQuery, setSearchQuery] = useState("")
    const searchFields = "username"
    const [createFormState, setCreateFormState] = useState(false)
    const toggleCreateFormState = () => setCreateFormState(prev => !prev)

    const fetchUsersByQuery = async (searchQuery: string, searchFields: string) => {
        try {
            const resData = (await axiosInstance.get(
                '/user',
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
                title: 'Không thể tải lên danh sách tài khoản người dùng',
                variant: 'destructive',
            })
        }
    }

    const createNewUser = async (formData: UserBodyType): Promise<boolean> => {
        try {
            const resData = await axiosInstance.post(
                'user/create-user',
                formData
            )

            if (resData.status === 201) {
                setCreateFormState(false);

                setData(prev => ({
                    ...prev,
                    values: [...prev.values, resData.data.data]
                }))

                toast({ title: "Thêm tài khoản thành công" , variant: "success"});
                return true;
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            console.error('Thêm tài khoản thất bại:', error);

            toast({
                title: "Thêm tài khoản thất bại",
                description: errorMessage,
                variant: "destructive",
            });

            return false;
        }
    }

    const deleteUsers = async (usersSelected: string[]) => {
        try {
            if (usersSelected.length > 0) {
                await axiosInstance.delete(
                    '/user/delete-users',
                    {
                        data: {
                            userIds: usersSelected
                        }
                    }
                ).then((res) => {
                    if (res.data.affected > 0) {
                        if (res.data.affected < usersSelected.length) {
                            toast({
                                title: `Đã xoá ${res.data.affected} / ${usersSelected.length} tài khoản`,
                                variant: "success",
                            })
                        } else {
                            toast({
                                title: `Đã xoá tài khoản thành công`,
                                variant: "success",
                            })
                        }

                        setData((prevState) => ({
                            ...prevState,
                            values: prevState.values.filter(item => !usersSelected.includes(item.id))
                        }));
                    } else {
                        toast({
                            title: "Vui lòng chọn ít nhất 1 tài khoản để xoá",
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
        fetchUsersByQuery(searchQuery, searchFields)
    }, [searchQuery, meta.currentPage])

    return (
        <>
            <PageBreadcrumb pageTitle={'Nhân viên'}/>

            <div className="space-y-6">
                <CustomTable
                    tableTitle={'Danh sách tài khoản nhân viên'}
                    tableData={data}
                    onSort={(key) => console.log(`Sorting by ${key}`)}
                    createItem={true}
                    deleteItem={true}
                    search={true}
                    searchFields={searchFields}
                    handleCreate={toggleCreateFormState}
                    handleDelete={(itemSelected) => deleteUsers(itemSelected)}
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
                    <CreateNewUserForm
                        onSubmit={(formData: UserBodyType) => createNewUser(formData)}
                    />
                </ModelLayer>
            </div>
        </>
    )
}