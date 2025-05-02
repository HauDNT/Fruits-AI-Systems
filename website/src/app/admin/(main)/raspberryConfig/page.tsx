'use client'
import Image from "next/image";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Select} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React, {useEffect, useState} from "react";
import {useToast} from "@/hooks/use-toast";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";

export default function RaspberryConfig() {
    const {toast} = useToast()
    const [raspberries, setRaspberries] = useState([])

    const fetchRaspberryList = async () => {
        try {
            const resData = await axiosInstance.get('/devices/raspberry-all')
            if (resData.data) {
                setRaspberries(resData.data)
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            console.log('Lỗi khi tải danh sách Raspberry: ', error)

            toast({
                title: "Tải danh sách raspberry thất bại",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }


    useEffect(() => {
        fetchRaspberryList()
    }, [])

    return (
        <>
            <PageBreadcrumb pageTitle={'Cấu hình máy chủ Raspberry'} pageTitleSmall={'Raspberry'}/>
            <div className="space-y-6">
                <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}>
                    <div className="grid grid-cols-12 gap-4 p-4">
                        <div className="col-span-4">
                            <Image
                                src="/images/raspberry.png"
                                alt=" grid"
                                className="w-full border border-gray-200 rounded-xl dark:border-gray-800 mb-3"
                                width={517}
                                height={295}
                            />
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn Raspberry cần cấu hình"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        raspberries.length > 0 ? (
                                            raspberries.map(rasp => (
                                                <SelectItem className={'cursor-pointer'} value={rasp.id}>
                                                    {rasp.device_code}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem className={'cursor-pointer'} value={NaN}>-</SelectItem>
                                        )
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-8">
                            Form
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}