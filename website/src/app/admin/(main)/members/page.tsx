'use client'
import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {useToast} from "@/hooks/use-toast";
import {HttpStatusCode} from "axios";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CustomTable from "@/components/table/CustomTable";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import CustomPagination from "@/components/common/CustomPagination";
import CreateNewAccountForm from "@/components/forms/CreateNewAccountForm";
import ModelLayer from "@/components/common/ModelLayer";
import {RegisterBodyType} from "@/schemas/auth.schema";
import {RoleEnum} from "@/enums";

export default function MemberManagement() {
    const {toast} = useToast()
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const {user} = useSelector((state: RootState) => state.auth)
    const [data, setData] = useState([])
    const [meta, setMeta] = useState({totalPages: 1, currentPage: 1, limit: 10})
    const [createFormState, setCreateFormState] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const searchFields = "username, email"

    const toggleCreateFormState = () => setCreateFormState(prev => !prev)

    const fetchUsersByTypeAndQuery = async (type: string, searchQuery: string, searchFields: string) => {
        try {
            const resData = (await axiosInstance.get(
                `/users`,
                {
                    params: {
                        type: +type,
                        page: meta.currentPage,
                        limit: meta.limit,
                        queryString: searchQuery,
                        searchFields: searchFields,
                    }
                }
            )).data;

            // Update table data
            resData?.values?.find(eachUser => {
                if (eachUser.id === user['userId']) {
                    eachUser.disableCheck = true;
                    return true; // Found and out
                }
                return false;
            })

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

    const handleNextPage = () => {
        if (meta.currentPage < meta.totalPages) {
            setMeta({...meta, currentPage: meta.currentPage + 1});
        }
    }

    const handlePrevPage = () => {
        if (meta.currentPage > 1) {
            setMeta({...meta, currentPage: meta.currentPage - 1});
        }
    }

    const handleDeleteUsers = async (itemSelected: number[]) => {
        try {
            if (itemSelected.length > 0) {
                await axiosInstance.delete(
                    '/users/delete-users',
                    {
                        data: {
                            userItemIds: itemSelected,
                        }
                    },
                ).then((res) => {
                    if (res.data.affected > 0) {
                        toast({
                            title: "Xoá người dùng thành công",
                            variant: "success",
                        })

                        setData((prevState) => ({
                            ...prevState, // Giữ nguyên phần `columns`
                            values: prevState.values.filter(item => !itemSelected.includes(item.id))
                        }));
                    }
                })
            } else {
                toast({
                    title: "Vui lòng chọn ít nhất 1 tài khoản",
                    variant: "warning",
                });
            }
        } catch (error) {
            toast({
                title: "Xoá người dùng thất bại",
                description: "Hãy thử lại sau",
                variant: "destructive",
            });
        }
    }

    const handleCreateUserForm = async (values: RegisterBodyType) => {
        try {
            if (!values) {
                toast({
                    title: "Vui lòng điền đẩy đủ thông tin",
                    variant: "destructive",
                });
                return;
            }

            if (values.re_password !== values.password) {
                toast({
                    title: "Đăng ký thất bại",
                    description: "Mật khẩu không trùng khớp",
                    variant: "destructive",
                });
                return;
            }

            const result = await axiosInstance.post<any>('/auth/register', {...values});

            if (result.status === HttpStatusCode.Created) {
                toast({
                    title: "Tạo tài khoản thành công",
                    variant: "success",
                });

                setCreateFormState(false)
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);

            toast({
                title: "Đăng ký thất bại",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        if (user && user['userId']) {
            fetchUsersByTypeAndQuery(type, searchQuery, searchFields);
        } else {
            console.warn('User is null or userId is missing');
        }
    }, [type, user, searchQuery, meta.currentPage]);

    return (
        <div>
            <PageBreadcrumb pageTitle={RoleEnum[type].charAt(0).toUpperCase() + RoleEnum[type].slice(1)}/>
            {
                data?.columns && (
                    <div className="space-y-6">
                        <CustomTable
                            tableTitle={'Danh sách tài khoản'}
                            tableData={data}
                            onSort={(key) => console.log(`Sorting by ${key}`)}
                            createItem={true}
                            deleteItem={true}
                            search={true}
                            searchFields={['username', 'email']}
                            handleCreate={toggleCreateFormState}
                            handleDelete={(itemSelected) => handleDeleteUsers(itemSelected)}
                            handleSearch={(query) => setSearchQuery(query)}
                        />
                    </div>
                )
            }

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
                <CreateNewAccountForm
                    onSubmit={(values: RegisterBodyType) => handleCreateUserForm(values)}
                />
            </ModelLayer>
        </div>
    )
}