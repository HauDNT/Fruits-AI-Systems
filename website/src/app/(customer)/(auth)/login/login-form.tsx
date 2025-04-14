'use client'

import React, {useState, useEffect} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import Link from "next/link"
import {useRouter, useSearchParams} from "next/navigation"
import {useDispatch} from 'react-redux'
import {FaGithub, FaGoogle, FaFacebook} from 'react-icons/fa'
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
import axiosInstance from "@/utils/axiosInstance"
import {LoginBody, LoginBodyType} from '@/schemas/auth.schema'
import {LoginResponseInterface} from '@/interfaces'
import {setCookie} from '@/utils/cookieManage'

const LoginForm: React.FC = () => {
    const [ssoUnAuth, setSsoUnAuth] = useState('')
    const searchParams = useSearchParams()
    const {toast} = useToast()
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        const googleUnAuthParam = searchParams.get('google-unauth')
        const githubUnAuthParam = searchParams.get('github-unauth')
        const facebookUnAuthParam = searchParams.get('facebook-unauth')

        if (googleUnAuthParam) setSsoUnAuth('Google')
        else if (githubUnAuthParam) setSsoUnAuth('Github')
        else if (facebookUnAuthParam) setSsoUnAuth('Facebook')
    }, [searchParams.toString()]);

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
                    '/auth/login',
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

                router.push('/home')
            }
        } catch (error) {
            toast({
                title: "Đăng nhập thất bại",
                description: "Hãy kiểm tra lại thông tin đăng nhập",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="space-y-2 max-w-[600px] flex-1 bg-white p-6 rounded shadow-lg border-gray-950">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleLogin)}
                >
                    <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">Đăng nhập vào EduFlexHub</h1>
                    <FormField
                        control={form.control}
                        name="username"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Tài khoản</FormLabel>
                                <FormControl>
                                    <Input placeholder="Tên tài khoản của bạn" {...field} />
                                </FormControl>
                                <FormMessage/>
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
                                        placeholder="Mật khẩu tài khoản của bạn"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <CustomButton type="submit" className='!mt-6 w-full'>Đăng nhập</CustomButton>

                    <div className='flex justify-between !my-4'>
                        <div>
                            Bạn chưa có tài khoản?&nbsp;
                            <Link href='/register' className='text-blue-500'>
                                Đăng ký ngay
                            </Link>
                        </div>
                        <Link href='/forgot-password' className='text-blue-500'>
                            Quên mật khẩu
                        </Link>
                    </div>
                </form>
            </Form>
            <hr className="border-t border-gray-300 !mt-6"/>
            <h3 className='font-thin text-center'>Hoặc đăng nhập với (dành cho học viên)</h3>
            <div className='flex items-center justify-center space-x-8 !mt-4'>
                <Link href={`${process.env.NEXT_PUBLIC_URL_SERVER}/auth/google?option=login`}>
                    <FaGithub size={30}/>
                </Link>
                <Link href={`${process.env.NEXT_PUBLIC_URL_SERVER}/auth/google?option=login`}>
                    <FaGoogle size={30}/>
                </Link>
                <Link href={`${process.env.NEXT_PUBLIC_URL_SERVER}/auth/google?option=login`}>
                    <FaFacebook size={30}/>
                </Link>
            </div>
            {
                ssoUnAuth !== '' ?
                    (
                        <h3 className='pt-6 text-center text-red-500'>Tài khoản {ssoUnAuth} của bạn chưa được đăng ký với EduFlexHub</h3>
                    ) : (<></>)
            }
        </div>
    )
}

export default LoginForm