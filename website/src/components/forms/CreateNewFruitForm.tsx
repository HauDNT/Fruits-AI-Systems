'use client'
import React, {useEffect, useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {FruitBody, FruitBodyType} from '@/schemas/fruit.schema'
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
import ListCheck from "@/components/common/ListCheck";

const CreateNewFruitForm = ({
    className,
    onSubmit,
}: FormInterface) => {
    const {toast} = useToast()
    const [fruitTypesData, setFruitTypesData] = useState([])
    const [storeFruitTypeChecked, setStoreFruitTypeChecked] = useState<string[]>([]);
    const form = useForm<FruitBodyType>({
        resolver: zodResolver(FruitBody),
        defaultValues: {
            fruit_name: '',
            fruit_desc: '',
            fruit_types: [],
            fruit_image: undefined,
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

    const handleSubmit = (values: FruitBodyType) => {
        const formData = new FormData();
        formData.append('fruit_name', values.fruit_name);
        formData.append('fruit_desc', values.fruit_desc);
        formData.append('fruit_types', JSON.stringify(storeFruitTypeChecked));
        formData.append('fruit_image', values.fruit_image);

        const submitResult = onSubmit(formData);
        if (submitResult) {
            form.reset();
            setStoreFruitTypeChecked([]);
        }
    };

    useEffect(() => {
        fetchAllFruitTypes();
    }, [])

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
                            name={"fruit_name"}
                            render={({field}) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Tên trái cây (Tiếng Anh)</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="text"
                                            placeholder="Apple (Táo) / Pear (Lê) / Grapes (Nho)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"fruit_desc"}
                            render={({field}) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Mô tả</FormLabel>
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
                            name="fruit_image"
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

                        <ListCheck
                            title={'Chọn tình trạng của loại trái này'}
                            data={fruitTypesData}
                            onCheck={(itemSelected) => setStoreFruitTypeChecked(itemSelected)}
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

export default CreateNewFruitForm