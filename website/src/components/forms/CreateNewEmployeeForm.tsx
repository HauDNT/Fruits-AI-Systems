'use client'
import React, {useEffect, useState} from "react";
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
import { Input } from "@/components/ui/input"
import CustomButton from "@/components/buttons/CustomButton"
import axiosInstance from "@/utils/axiosInstance";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Gender} from "@/enums";
import {EmployeeBody, EmployeeBodyType} from "@/schemas/employee.schema";
import InputField from "@/components/inputs/InputField";

const CreateNewEmployeeForm = ({
    className,
    onSubmit,
    onClose
}: FormInterface) => {
    const { toast } = useToast()
    const [areas, setAreas] = useState([])
    const form = useForm<EmployeeBodyType>({
        resolver: zodResolver(EmployeeBody),
        defaultValues: {
            fullname: undefined,
            gender: undefined,
            phone_number: undefined,
            areaId: undefined,
            employee_image: undefined,
        }
    })

    const fetchAreas = async () => {
        try {
            const resData = await axiosInstance.get('/areas/all')
            if (resData.data) {
                setAreas(resData.data)
            }
        } catch (error) {
            toast({
                title: 'Đã xảy ra lỗi khi lấy danh sách khu phân loại',
                description: error.message,
                variant: 'destructive'
            })
        }
    }

    const handleSubmit = (values: EmployeeBodyType) => {
        const formData = new FormData()
        formData.append('fullname', values.fullname)
        formData.append('gender', values.gender)
        formData.append('phone_number', values.phone_number)
        formData.append('areaId', values.areaId)
        formData.append('employee_image', values.employee_image)

        const submitResult = onSubmit(formData);
        if (submitResult) {
            form.reset()
            onClose()
        }
    }

    useEffect(() => {
        fetchAreas()
    }, [])

    return (
        <ComponentCard title="Thêm nhân viên mới" className={'w-full'}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className={` ${className}`}
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="fullname"
                            render={({field}) => (
                                <FormItem className="mb-0">
                                    <FormLabel>Họ và tên</FormLabel>
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
                            name="phone_number"
                            render={({field}) => (
                                <FormItem className="mb-0">
                                    <FormLabel>Số điện thoại</FormLabel>
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
                            name="gender"
                            render={({field}) => (
                                <FormItem className="mb-0">
                                    <FormLabel>Giới tính</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn giới tính"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem key={Gender.Male} value={Gender.Male}>
                                                <div className="flex justify-between w-full text-left cursor-pointer">
                                                    <span className="w-[130px] truncate">{'Nam'}</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem key={Gender.Female} value={Gender.Female}>
                                                <div className="flex justify-between w-full text-left cursor-pointer">
                                                    <span className="w-[130px] truncate">{'Nữ'}</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem key={Gender.Other} value={Gender.Other}>
                                                <div className="flex justify-between w-full text-left cursor-pointer">
                                                    <span className="w-[130px] truncate">{'Khác'}</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className={'mb-0'} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="areaId"
                            render={({field}) => (
                                <FormItem className="mb-0">
                                    <FormLabel>Khu vực lắp đặt</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn khu vực lắp đặt thiết bị"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {areas.map(area => (
                                                <SelectItem key={area.id} value={area.id}>
                                                    <div className="flex justify-between w-full text-left cursor-pointer">
                                                        <span className="w-[130px] truncate">{area.area_code}</span>
                                                        <span className="flex-1 truncate text-gray-600">{area.area_desc}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className={'mb-0'} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="employee_image"
                            render={({ field: { onChange, value, ...field } }) => (
                                <FormItem className="mb-0">
                                    <FormLabel>Hình ảnh</FormLabel>
                                    <FormControl className={'cursor-pointer'}>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            {...field}
                                            onChange={(e) => onChange(e.target.files?.[0] || null)}
                                        />
                                    </FormControl>
                                    <FormMessage className={'mb-0'} />
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

export default CreateNewEmployeeForm