'use client'
import React, {useEffect, useState} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import Link from "next/link";
import {HttpStatusCode} from "axios";
import CustomButton from "@/components/buttons/CustomButton"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useRouter, useSearchParams} from 'next/navigation'
import {IoIosArrowBack} from "react-icons/io"
import {Input} from "@/components/ui/input"
import {useToast} from "@/hooks/use-toast"
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance"
import {RegisterBody, RegisterBodyType} from '@/schemas/auth.schema'
import {FaFacebook, FaGithub, FaGoogle} from "react-icons/fa";
import {RoleEnum} from "@/enums";

const RegisterForm: React.FC = () => {
    const [ssoRegistered, setSsoRegistered] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter()
    const {toast} = useToast()

    useEffect(() => {
        const googleUnAuthParam = searchParams.get('google-unauth')
        const githubUnAuthParam = searchParams.get('github-unauth')
        const facebookUnAuthParam = searchParams.get('facebook-unauth')

        if (googleUnAuthParam) setSsoRegistered('Google')
        else if (githubUnAuthParam) setSsoRegistered('Github')
        else if (facebookUnAuthParam) setSsoRegistered('Facebook')
    }, [searchParams.toString()]);

    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            username: '',
            password: '',
            re_password: '',
            account_type: '',
        }
    })

    const handleRegister = async (values: RegisterBodyType) => {
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
                    title: "Đăng ký thành công",
                    description: "Bạn có thể sử dụng tài khoản này để đăng nhập"
                });
                router.push('/login');
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

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleRegister)}
                className="space-y-2 max-w-[600px] flex-1 bg-white p-6 rounded shadow-lg border-gray-950"
            >
                <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">Đăng ký tài khoản EduFlexHub</h1>
                <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Tài khoản</FormLabel>
                            <FormControl>
                                <Input placeholder="nva@email.com" {...field} />
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
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="re_password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Xác nhận mật khẩu</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="account_type"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Loại tài khoản</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại tài khoản muốn đăng ký"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={'' + RoleEnum.Student}>Học viên</SelectItem>
                                    <SelectItem value={'' + RoleEnum.Teacher}>Giảng viên</SelectItem>

                                    {/* Tạm thời để lận test */}
                                    <SelectItem value={'' + RoleEnum.Staff}>Nhân viên</SelectItem>
                                    <SelectItem value={'' + RoleEnum.Admin}>Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <CustomButton type="submit" className='!mt-6 w-full'>Đăng ký</CustomButton>

                <Link href='/login' className='flex justify-center items-center !mt-4'>
                    <IoIosArrowBack size={20}/>
                    <span>Quay lại</span>
                </Link>

                <hr className="border-t border-gray-300 !mt-6"/>
                <h3 className='font-thin text-center'>Hoặc đăng ký với (dành cho học viên)</h3>
                <div className='flex items-center justify-center space-x-8 !mt-4'>
                    <Link href={`${process.env.NEXT_PUBLIC_URL_SERVER}/auth/google?option=register`}>
                        <FaGithub size={30}/>
                    </Link>
                    <Link href={`${process.env.NEXT_PUBLIC_URL_SERVER}/auth/google?option=register`}>
                        <FaGoogle size={30}/>
                    </Link>
                    <Link href={`${process.env.NEXT_PUBLIC_URL_SERVER}/auth/google?option=register`}>
                        <FaFacebook size={30}/>
                    </Link>
                </div>

                {
                    ssoRegistered !== '' ?
                        (
                            <h3 className='pt-6 text-center text-red-500'>Tài khoản {ssoRegistered} của bạn đã được đăng ký
                                với EduFlexHub</h3>
                        ) : (<></>)
                }
            </form>
        </Form>
    )
}

export default RegisterForm