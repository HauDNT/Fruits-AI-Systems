'use client'
import React, {useEffect, useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {FruitClassifyBody, FruitClassifyBodyType} from '@/schemas/fruit-classify.schema'
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

const CreateNewFruitClassifyForm = ({
    className,
    onSubmit,
}: FormInterface) => {
    const {toast} = useToast()
    const [fruitTypesData, setFruitTypesData] = useState([])
    const form = useForm<FruitClassifyBodyType>({
        resolver: zodResolver(FruitClassifyBody),
        defaultValues: {
            confidence_level: 0,
            fruitId: undefined,
            typeId: undefined,
            areaId: undefined,
            batchId: undefined,
            classify_image: undefined,
        }
    })

    const fetchAllFruitTypes = async () => {
        try {
            const resData = (await axiosInstance.get('/fruit-types/all')).data;

            if (resData.length > 0) {
                setFruitTypesData(resData);
            } else {
                toast({
                    title: "Không có dữ liệu loại trái cây",
                    variant: "warning",
                });
            }
        } catch (error) {
            console.error('Error fetching fruit types:', error);
            toast({
                title: "Lỗi khi lấy danh sách loại trái cây",
                variant: "destructive",
            });
        }
    }

    const handleSubmit = (values: FruitClassifyBodyType) => {
        const formData = new FormData();
        formData.append('confidence_level', values.confidence_level);
        formData.append('fruitId', values.fruitId);
        formData.append('typeId', values.typeId);
        formData.append('areaId', values.areaId);
        formData.append('batchId', values.batchId);
        formData.append('classify_image', values.classify_image);

        const submitResult = onSubmit(formData);
        // if (submitResult) {
        //     form.reset();
        // }
    };

    useEffect(() => {
        fetchAllFruitTypes();
    }, [])

    return (
        <ComponentCard title="Thêm kết quả thủ công" className={'w-full'}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className={` ${className}`}
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name={"confidence_level"}
                            render={({field}) => (
                                <FormItem className="col-span-full mb-0">
                                    <FormLabel>Độ tin cậy</FormLabel>
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
                            name={"fruitId"}
                            render={({field}) => (
                                <FormItem className="mb-0">
                                    <FormLabel>Trái cây</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="text"
                                            placeholder="Mô tả trái cây (nếu có)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"typeId"}
                            render={({field}) => (
                                <FormItem className="mb-0">
                                    <FormLabel>Tình trạng</FormLabel>
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
                            name={"areaId"}
                            render={({field}) => (
                                <FormItem className="mb-0">
                                    <FormLabel>Khu vực phân loại</FormLabel>
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
                            name={"batchId"}
                            render={({field}) => (
                                <FormItem className="mb-0">
                                    <FormLabel>Lô</FormLabel>
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
                            name="classify_image"
                            render={({ field: { onChange, value, ...field } }) => (
                                <FormItem className="col-span-full mb-0">
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
                            <CustomButton type="submit" className='!mt-0 w-full'>Thêm</CustomButton>
                        </div>
                    </div>
                </form>
            </Form>
        </ComponentCard>
    )
}

export default CreateNewFruitClassifyForm