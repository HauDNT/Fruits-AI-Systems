'use client'
import React from "react"
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {UserInfo} from "@/interfaces"
import ComponentCard from "@/components/common/ComponentCard"
import InputField from "@/components/inputs/InputField"
import CustomButton from "@/components/buttons/CustomButton"
import {ChangeUserInfoBody, ChangeUserInfoBodyType} from "@/schemas/user.schema"

const ChangeUserInfoForm = ({
    className,
    userData,
    onSubmit,
}: {
    className?: string,
    userData: UserInfo,
    onSubmit?: () => boolean,
}) => {
    const form = useForm<ChangeUserInfoBodyType>({
        resolver: zodResolver(ChangeUserInfoBody),
        defaultValues: {
            password: '',
            re_password: '',
        }
    })

    const handleSubmit = (values: ChangeUserInfoBodyType) => {
        const formValue = {
            ...values,
            username: userData.username,
        }
        
        const submitResult = onSubmit(formValue);

        if (submitResult) {
            form.reset();
        }
    };

    return (
        <ComponentCard title={`Đổi thông tin của tài khoản ${userData?.username}`} className={'w-full'}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className={` ${className}`}
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name={"password"}
                            render={({field}) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Mật khẩu mới</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"re_password"}
                            render={({field}) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Nhập lại mật khẩu mới</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="col-span-full">
                            <CustomButton type="submit" className='!mt-6 w-full'>Thay đổi</CustomButton>
                        </div>
                    </div>
                </form>
            </Form>
        </ComponentCard>
    )
}

export default ChangeUserInfoForm