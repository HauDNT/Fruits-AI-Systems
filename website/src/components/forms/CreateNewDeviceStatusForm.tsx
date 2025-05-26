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
import { DeviceStatusBody, DeviceStatusBodyType } from "@/schemas/device.schema"

const CreateNewDeviceStatusForm = ({
    className,
    onSubmit,
    onClose,
}: FormInterface) => {
    const form = useForm<DeviceStatusBodyType>({
        resolver: zodResolver(DeviceStatusBody),
        defaultValues: {
            status_name: '',
        }
    })

    const handleSubmit = (values: DeviceStatusBodyType) => {
        const formData = new FormData();
        formData.append('status_name', values.status_name);

        const submitResult = onSubmit(formData);
        if (submitResult) {
            form.reset();
        }
    };

    return (
        <ComponentCard title="Thêm loại thiết bị mới" className={'w-full'}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className={` ${className}`}
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name={"status_name"}
                            render={({field}) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Tên trạng thái</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="text"
                                            placeholder="VD: Đang hoạt động, tắt, bảo trì,..."
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

export default CreateNewDeviceStatusForm