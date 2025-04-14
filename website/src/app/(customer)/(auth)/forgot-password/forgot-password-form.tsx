'use client'

import React, {useState} from "react";
import {StepResetForm} from "@/interfaces";
import {useForm, Controller} from "react-hook-form";
import CustomButton from "@/components/buttons/CustomButton"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {useToast} from "@/hooks/use-toast"
import * as FormSchema from "@/schemas/reset-password-form.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {
    VerifyCodeFormSchema,
    VerifyEmailFormSchema,
    ChangePasswordFormSchema,
} from "@/schemas/reset-password-form.schema";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";
import {HttpStatusCode} from "axios";

const steps: StepResetForm[] = [
    {
        id: 'Bước 1',
        name: 'Email xác thực mật khẩu',
        fieldsName: ['email'],
    },
    {
        id: 'Bước 2',
        name: 'Nhập mã xác thực',
        fieldsName: ['verifyCode'],
    },
    {
        id: 'Bước 3',
        name: 'Nhập mật khẩu mới',
        fieldsName: ['password', 're_password'],
    },
    {
        id: 'Bước 4',
        name: 'Hoàn thành',
    },
]

const ForgotPasswordForm: React.FC = () => {
    const {toast} = useToast()
    const [currentStep, setCurrentStep] = useState(0)
    const [validEmail, setValidEmail] = useState('')

    const verifyEmailForm = useForm<FormSchema.VerifyEmailFormSchemaType>({
        resolver: zodResolver(FormSchema.VerifyEmailFormSchema),
        defaultValues: {
            email: '',
        }
    })

    const verifyCodeForm = useForm<FormSchema.VerifyCodeFormSchemaType>({
        resolver: zodResolver(FormSchema.VerifyCodeFormSchema),
        defaultValues: {
            verifyCode: '',
        }
    })

    const verifyPasswordForm = useForm<FormSchema.ChangePasswordFormSchemaType>({
        resolver: zodResolver(FormSchema.ChangePasswordFormSchema),
        defaultValues: {
            password: '',
            re_password: '',
        }
    })

    const handleSubmitEmail = async (data: VerifyEmailFormSchema) => {
        if (data) {
            const checkEmail = await axiosInstance.post('/auth/verify-email', data);

            if (checkEmail.data === true) {
                toast({
                    title: "Mã xác thực đã được gửi đến email",
                    description: "Có hiệu lực trong 5 phút"
                });

                setValidEmail(data.email);
                setCurrentStep(currentStep => currentStep + 1);
            } else {
                toast({
                    title: "Email không tồn tại",
                    variant: "destructive",
                });
            }
        } else {
            toast({
                title: "Vui lòng điền email",
                variant: "destructive",
            });
        }
    }

    const handleVerifyCode = async (data: VerifyCodeFormSchema) => {
        try {
            if (data) {
                const verifyCodeResult = await axiosInstance.post(
                    '/auth/otp-authentication',
                    {
                        email: validEmail,
                        verifyCode: data.verifyCode,
                    });

                if (verifyCodeResult.data === true) {
                    toast({
                        title: "Xác thực thành công, bạn có thể tạo mật khẩu mới.",
                    });

                    setCurrentStep(currentStep => currentStep + 1);
                }
                else {
                    toast({
                        title: "Mã OTP không chính xác, vui lòng kiểm tra lại",
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Vui lòng điền mã OTP",
                    variant: "destructive",
                });
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);

            toast({
                title: "Xác thực OTP thất bại",
                description: errorMessage,
                variant: "destructive",
            });
        }

    }

    const handleChangePassword = async (data: ChangePasswordFormSchema) => {
        try {
            if (!data && !validEmail) {
                toast({
                    title: "Vui lòng điền đẩy đủ thông tin",
                    variant: "destructive",
                });
                return;
            }

            const changePasswordResult = await axiosInstance
                .post(
                '/auth/reset-password',
                {
                    email: validEmail,
                    password: data.password,
                    re_password: data.re_password,
                });

            console.log(changePasswordResult)

            if (changePasswordResult.status === HttpStatusCode.Created) {
                toast({
                    title: "Đổi mật khẩu thành công",
                });

                setCurrentStep(currentStep => currentStep + 1);
            }

        } catch (error) {
            const errorMessage = handleAxiosError(error);

            toast({
                title: "Đổi mật khẩu thất bại",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }

    return (
        <div className="space-y-2 max-w-[900px] flex-1 bg-white p-6 rounded shadow-lg border-gray-950">
            {/* Steps */}
            <ol className="lg:flex flex-start w-full lg:space-x-8">
                {
                    steps.map((step, index) => (
                        <li key={index} className="flex-1">
                            <div
                                className={`
                                    border-l-2 border-t-0 pl-4 pt-0 border-solid 
                                    ${currentStep === index ? 'border-indigo-600' : 'border-indigo-200'}
                                    font-medium lg:border-t-2 lg:border-l-0 lg:pl-0`}>
                                <span className="text-sm lg:text-base text-indigo-600">
                                    {step.id}
                                </span>
                                <h4 className="text-base lg:text-lg text-gray-900">
                                    {step.name}
                                </h4>
                            </div>
                        </li>
                    ))
                }
            </ol>

            {/* Form */}
            <div className="pt-6">
                {
                    currentStep === 0 && (
                        <Form {...verifyEmailForm}>
                            <form onSubmit={verifyEmailForm.handleSubmit(handleSubmitEmail)}>
                                <FormField
                                    control={verifyEmailForm.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className='text-base'>Nhập Email đã đăng ký với tài khoản</FormLabel>
                                            <FormControl>
                                                <Input placeholder="nva@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <CustomButton type="submit" className='!mt-6 w-full'>Xác nhận</CustomButton>
                            </form>
                        </Form>
                    )
                }
                {
                    currentStep === 1 && (
                        <Form {...verifyCodeForm}>
                            <form onSubmit={verifyCodeForm.handleSubmit(handleVerifyCode)}>
                                <label htmlFor="verifyCode">Nhập mã OTP (6 chữ số):</label>
                                <Controller
                                    name="verifyCode"
                                    control={verifyCodeForm.control}
                                    rules={VerifyCodeFormSchema}
                                    render={({field, fieldState}) => (
                                        <div className='flex justify-center'>
                                            <InputOTP
                                                maxLength={6}
                                                value={field.value}
                                                onChange={(value) => {
                                                    field.onChange(value)
                                                }}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0}/>
                                                    <InputOTPSlot index={1}/>
                                                </InputOTPGroup>
                                                <InputOTPSeparator/>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={2}/>
                                                    <InputOTPSlot index={3}/>
                                                </InputOTPGroup>
                                                <InputOTPSeparator/>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={4}/>
                                                    <InputOTPSlot index={5}/>
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    )}
                                />
                                <CustomButton
                                    type="submit"
                                    className='!mt-6 w-full'
                                    disabled={!verifyCodeForm.formState.isValid}>Xác nhận</CustomButton>
                            </form>
                        </Form>
                    )
                }
                {
                    currentStep === 2 && (
                        <Form {...verifyPasswordForm}>
                            <form onSubmit={verifyPasswordForm.handleSubmit(handleChangePassword)}>
                                <FormField
                                    control={verifyPasswordForm.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className='text-base'>Nhập mật khẩu mới</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={verifyPasswordForm.control}
                                    name="re_password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className='pt-3 text-base'>Xác nhận mật khẩu</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <CustomButton type="submit" className='!mt-6 w-full'>Xác nhận</CustomButton>
                            </form>
                        </Form>
                    )
                }
                {
                    currentStep === 3 && (
                        <>
                            <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">Đổi mật khẩu thành công</h1>
                            <p className='text-base text-center'>
                                Bạn có thể&nbsp;
                                <Link href={'/login'} className='text-blue-600 text-center w-100'>đăng nhập</Link>
                                &nbsp;ngay
                            </p>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default ForgotPasswordForm