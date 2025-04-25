'use client'
import React from "react";
import {useToast} from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input"
import CustomButton from "@/components/buttons/CustomButton"
import axiosInstance from "@/utils/axiosInstance";
import {AreaBody, AreaBodyType} from "@/schemas/area.schema";

const CreateNewAreaForm = ({
    className,
    onSubmit,
}: FormInterface) => {
    const {toast} = useToast()
    const form = useForm<AreaBodyType>({
        resolver: zodResolver(AreaBody),
        defaultValues: {
            area_desc: '',
            area_image: undefined,
        }
    })

    const handleSubmit = (values: AreaBodyType) => {
        const formData = new FormData();
        formData.append('area_desc', values.area_desc);
        formData.append('area_image', values.area_image);

        const submitResult = onSubmit(formData);
        if (submitResult) {
            form.reset();
        }
    };

    return (
        <ComponentCard title="Thêm khu phân loại mới" className={'w-full'}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className={` ${className}`}
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name={"area_desc"}
                            render={({field}) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Mô tả khu</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="text"
                                            placeholder="VD: Khu phân loại số 1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="area_image"
                            render={({ field: { onChange, value, ...field } }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Hình ảnh</FormLabel>
                                    <FormControl className={'cursor-pointer'}>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            {...field}
                                            onChange={(e) => onChange(e.target.files?.[0] || null)}
                                        />
                                    </FormControl>
                                    <FormMessage />
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

export default CreateNewAreaForm