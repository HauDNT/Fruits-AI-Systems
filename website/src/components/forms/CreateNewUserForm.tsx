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
import {FormInterface} from "@/interfaces"
import ComponentCard from "@/components/common/ComponentCard"
import InputField from "@/components/inputs/InputField"
import CustomButton from "@/components/buttons/CustomButton"
import {UserBody, UserBodyType} from "@/schemas/user.schema"

const CreateNewUserForm = ({
    className,
    onSubmit,
    onClose,
}: FormInterface<UserBodyType>) => {
    const form = useForm<UserBodyType>({
        resolver: zodResolver(UserBody),
        defaultValues: {
            username: '',
            password: '',
        }
    })

    const handleSubmit = async (values: UserBodyType): Promise<void> => {
        const submitResult = await onSubmit(values);

        if (submitResult) {
            form.reset();
            onClose?.();
        }
    };

    return (
        <ComponentCard title="Thêm tài khoản người dùng mới" className={'w-full'}>
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
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"password"}
                            render={({field}) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Mật khẩu</FormLabel>
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
                            <CustomButton type="submit" className='!mt-6 w-full'>Thêm</CustomButton>
                        </div>
                    </div>
                </form>
            </Form>
        </ComponentCard>
    )
}

export default CreateNewUserForm