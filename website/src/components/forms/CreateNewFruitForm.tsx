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
import CustomButton from "@/components/buttons/CustomButton"
import axiosInstance from "@/utils/axiosInstance";
import ListCheck from "@/components/common/ListCheck";

const CreateNewFruitForm = ({
    className,
    onSubmit,
}: FormInterface) => {
    const {toast} = useToast()
    const [fruitTypesData, setFruitTypesData] = useState([])
    const [storeFruitTypeChecked, setStoreFruitTypeChecked] = useState([])

    const fetchAllFruitTypes = async () => {
        const resData = (await axiosInstance.get('/fruit-types/all')).data;

        if (resData.length > 0) {
            setFruitTypesData(resData)
        } else {
            console.log('Error: ', e)
            toast({
                title: "Xảy ra lỗi khi lấy thông tin trạng thái",
                variant: "destructive",
            });
        }
    }

    const handleSubmit = (values: FruitBodyType) => {
        values.fruit_types = storeFruitTypeChecked;
        onSubmit(values);
    };

    const form = useForm<FruitBodyType>({
        resolver: zodResolver(FruitBody),
        defaultValues: {
            fruit_name: '',
            fruit_desc: '',
            fruit_types: [],
        }
    })

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