'use client'

import React from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {useRouter} from "next/navigation"
import {useDispatch} from 'react-redux'
import CustomButton from "@/components/buttons/CustomButton"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {setReduxAuthToken} from '@/redux/authSlice'
import {Input} from "@/components/ui/input"
import {useToast} from "@/hooks/use-toast"
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance"
import {LoginBody, LoginBodyType} from '@/schemas/auth.schema'
import {LoginResponseInterface} from '@/interfaces'
import {setCookie} from '@/utils/cookieManage'

const AdminLoginForm: React.FC = () => {
    const {toast} = useToast()
    const dispatch = useDispatch()
    const router = useRouter()

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            username: '',
            password: '',
        }
    })

    const handleLogin = async (values: LoginBodyType) => {
        try {
            if (!values) {
                toast({
                    title: "Vui lòng điền đẩy đủ thông tin",
                    variant: "destructive",
                });
                return;
            }

            const result = await axiosInstance
                .post<LoginResponseInterface>(
                    '/auth/admin/login',
                    {...values}
                )
                .then(res => (
                    {
                        status: res.status,
                        payload: res.data,
                    }
                ))

            if (result.payload.accessToken) {
                await setCookie('eduflexhub-authentication', JSON.stringify({
                    userId: result.payload.userId,
                    username: result.payload.username,
                    accessToken: result.payload.accessToken,
                    role: result.payload.role,
                }))

                dispatch(setReduxAuthToken({
                    userId: result.payload.userId,
                    username: result.payload.username,
                    accessToken: result.payload.accessToken,
                    role: result.payload.role,
                }))

                router.push('/admin/dashboard')
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);

            toast({
                title: "Đăng nhập thất bại",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }

    return (
        <div
            className="flex flex-wrap justify-center md:mx-32 items-center bg-white p-24 rounded shadow-lg border-gray-950">
            <div className="md:w-1/2">
                <img src={'/images/Banner/banner.jpg'}/>
            </div>
            <div className="md:w-1/2">
                <>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleLogin)}
                        >
                            <h1 className="text-4xl leading-normal font-bold text-blue-600 mb-4 text-center">
                                Trang quản trị <br/> EduFlexHub</h1>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Tài khoản</FormLabel>
                                        <FormControl>
                                            <Input
                                                style={{ marginBottom: '12px' }}
                                                placeholder="nva@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage style={{ marginBottom: '12px' }}/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type={'password'}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <CustomButton type="submit" className='!mt-6 w-full text-2md font-bold'>Đăng nhập</CustomButton>
                        </form>
                    </Form>
                </>
            </div>
        </div>
    )
}

export default AdminLoginForm