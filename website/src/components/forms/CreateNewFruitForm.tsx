'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FruitBody, FruitBodyType } from '@/schemas/fruit.schema'
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
import { Input } from "@/components/ui/input"
import CustomButton from "@/components/buttons/CustomButton"
import axiosInstance, { handleAxiosError } from "@/utils/axiosInstance";
import ListCheck from "@/components/common/ListCheck";
import { FruitTypeSelect } from "@/types/fruitTypeSelect";
import { error } from "console";

const CreateNewFruitForm = ({
    className,
    onSubmit,
    onClose,
}: FormInterface<FormData>) => {
    const { toast } = useToast();
    const [images, setImages] = useState<string[]>([]);
    const [fruitTypesData, setFruitTypesData] = useState<FruitTypeSelect[]>([]);
    const [storeFruitTypeChecked, setStoreFruitTypeChecked] = useState<number[]>([]);
    const form = useForm<FruitBodyType>({
        resolver: zodResolver(FruitBody),
        defaultValues: {
            fruit_name: '',
            fruit_desc: '',
            fruit_types: [],
            fruit_images: [],
        }
    });

    const fetchAllFruitTypes = async (): Promise<void> => {
        try {
            const resData = (await axiosInstance.get<FruitTypeSelect[]>('/fruit-types/all')).data;

            if (resData.length > 0) {
                setFruitTypesData(resData);
            } else {
                toast({
                    title: "Không có dữ liệu loại trái cây",
                    variant: "warning",
                });
            }
        } catch (e) {
            toast({
                title: "Lỗi khi lấy danh sách loại trái cây",
                description: handleAxiosError(e),
                variant: "destructive",
            });
        }
    };

    const handleSubmit = async (values: FruitBodyType): Promise<void> => {
        const formData = new FormData();
        formData.append('fruit_name', values.fruit_name);
        formData.append('fruit_desc', values.fruit_desc);
        formData.append('fruit_types', JSON.stringify(storeFruitTypeChecked));

        if (Array.isArray(values.fruit_images)) {
            values.fruit_images.forEach((file) => {
                formData.append(`fruit_image`, file);
            });
        }

        const submitResult = await onSubmit(formData);
        if (submitResult) {
            form.reset();
            setStoreFruitTypeChecked([]);
            onClose?.();
        }
    };

    const onSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const imagePromises = files.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(reader.error);
            });
        });

        Promise
            .all(imagePromises)
            .then((imgUrls) => {
                setImages((prev) => [...prev, ...imgUrls]);
            })
            .catch((error) => {
                toast({
                    title: "Lỗi khi tải ảnh",
                    variant: "destructive",
                });
            })
    };

    useEffect(() => {
        fetchAllFruitTypes();
    }, []);

    return (
        <ComponentCard title="Thêm trạng thái trái cây mới" className={'w-full'}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className={` ${className}`}
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                        <FormField
                            control={form.control}
                            name={"fruit_name"}
                            render={({ field }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Tên trái cây (Tiếng Anh)</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="text"
                                            placeholder="Apple (Táo) / Pear (Lê) / Grapes (Nho)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={"fruit_desc"}
                            render={({ field }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <InputField
                                            type="text"
                                            placeholder="Mô tả trái cây (nếu có)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fruit_images"
                            render={({ field: { onChange, value, ...field } }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Hình ảnh</FormLabel>
                                    <FormControl className={'cursor-pointer'}>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            {...field}
                                            onChange={(e) => {
                                                onSelectImages(e);
                                                const files = Array.from(e.target.files || []);
                                                onChange(files);
                                            }}
                                            multiple
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            images &&
                            <div className="flex w-full">
                                {images.map((imgSrc) => (
                                    <div className="mr-3 overflow-hidden border border-gray-200 rounded-sm dark:border-gray-800">
                                        <Image
                                            width={100}
                                            height={100}
                                            src={imgSrc}
                                            alt="Fruit image"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>
                        }
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