'use client'
import React from "react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FruitTypeBody, FruitTypeBodyType } from '@/schemas/fruit.schema'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { FormInterface } from "@/interfaces"
import ComponentCard from "@/components/common/ComponentCard"
import InputField from "@/components/inputs/InputField"
import CustomButton from "@/components/buttons/CustomButton"

const CreateNewFruitTypeForm = ({
    className,
    onSubmit,
    onClose,
}: FormInterface<FruitTypeBodyType>) => {
    const form = useForm<FruitTypeBodyType>({
        resolver: zodResolver(FruitTypeBody),
        defaultValues: {
            type_name: '',
            type_desc: '',
        }
    });

    const handleSubmit = async (values: FruitTypeBodyType): Promise<void> => {
        const submitResult = await onSubmit(values);

        if (submitResult) {
            form.reset();
            onClose?.();
        }
    };

    return (
        <ComponentCard title="Thêm trạng thái trái cây mới" className={'w-full'}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className={` ${className}`}
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name={"type_name"}
                            render={({ field }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Trạng thái (Tiếng Anh viết hoa chữ cái)</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="text"
                                            placeholder="Ripe / Rot"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"type_desc"}
                            render={({ field }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Mô tả (Chú thích tiếng Việt)</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="text"
                                            placeholder="Chín / Thối"
                                            {...field}
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

export default CreateNewFruitTypeForm