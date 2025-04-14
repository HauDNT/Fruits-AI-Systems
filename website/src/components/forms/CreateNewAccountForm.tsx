'use client'
import React from "react";
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {RegisterBody, RegisterBodyType} from '@/schemas/auth.schema'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {FormInterface} from "@/interfaces"
import ComponentCard from "@/components/common/ComponentCard"
import InputField from "@/components/inputs/InputField"
import CustomButton from "@/components/buttons/CustomButton"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {RoleEnum} from "@/enums";

const CreateNewAccountForm = ({
    className,
    onSubmit,
}: FormInterface) => {
    const handleSubmit = (values: RegisterBodyType) => {
        onSubmit(values);
    };

    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            username: '',
            password: '',
            re_password: '',
            account_type: '',
        }
    })

    return (
        <ComponentCard title="Thêm tài khoản mới" className={'w-full'}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className={` ${className}`}
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name={"username"}
                            render={({field}) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Tên tài khoản</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="text"
                                            placeholder="username01"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="password"
                                            placeholder="Mật khẩu phải trùng khớp"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="re_password"
                            render={({field}) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="password"
                                            placeholder="Mật khẩu phải trùng khớp"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="account_type"
                            render={({field}) => (
                                <FormItem className="col-span-full">
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
                        <div className="col-span-full">
                            <CustomButton type="submit" className='!mt-6 w-full'>Đăng ký</CustomButton>
                        </div>
                    </div>
                </form>
            </Form>
        </ComponentCard>
    )
}

export default CreateNewAccountForm