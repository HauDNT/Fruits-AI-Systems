'use client'
import Image from "next/image";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {Select} from "@radix-ui/react-select";
import {SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React, {useEffect, useState} from "react";
import {useToast} from "@/hooks/use-toast";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";
import {Checkbox} from "@/components/ui/checkbox";
import CustomButton from "@/components/buttons/CustomButton";
import {HttpStatusCode} from "axios";

export default function RaspberryConfig() {
    const {toast} = useToast()
    const [raspberries, setRaspberries] = useState([])
    const [raspberryCode, setRaspberryCode] = useState(null)
    const [raspberryConfig, setRaspberryConfig] = useState(null)
    const [labels, setLabels] = useState([])

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

    const getAvailableLabels = async () => {
        try {
            const resData = await axiosInstance.get('/raspberry/raspberry-fruit-types')
            if (resData) {
                setLabels(resData.data)
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            console.log('Tải danh sách nhãn thất bại: ', error)

            toast({
                title: "Tải danh sách nhãn thất bại",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    const getRaspberryConfig = async () => {
        try {
            const resData = await axiosInstance.get(`/raspberry/config/${encodeURIComponent(raspberryCode)}?isParseJSON=false`)

            if (resData) {
                const config = resData.data

                if (typeof config.labels === 'string') {
                    try {
                        config.labels = JSON.parse(config.labels)
                    } catch (error) {
                        toast({
                            title: "Không thể parse labels từ JSON string",
                            variant: "warning",
                        })
                        config.labels = [];
                    }
                }
                setRaspberryConfig(config)
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            console.log('Tải cấu hình Raspberry thất bại: ', error)

            toast({
                title: "Tải cấu hình Raspberry thất bại",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    const handleCheckboxChange = (checked, label) => {
        setRaspberryConfig((prev) => {
            if (!prev) return prev;

            const existingLabels = prev.labels || [];
            const exists = existingLabels.some(
                (item) => item.fruit_id === label.fruit_id && item.type_id === label.type_id
            );

            let updatedLabels;

            if (checked && !exists) {
                updatedLabels = [...existingLabels, {fruit_id: label.fruit_id, type_id: label.type_id}];
            } else if (!checked && exists) {
                updatedLabels = existingLabels.filter(
                    (item) =>
                        !(item.fruit_id === label.fruit_id && item.type_id === label.type_id)
                );
            } else {
                updatedLabels = existingLabels;
            }

            return {
                ...prev,
                labels: updatedLabels,
            };
        });
    };

    const handleUpdateRaspberryConfig = async () => {
        try {
            const data = {
                ...raspberryConfig,
                device_code: raspberryCode,
            }
            const resData = await axiosInstance.post(
                `/raspberry/update-config`,
                data
            )

            if (resData.status === HttpStatusCode.Created) {
                toast({
                    title: "Cập nhật cấu hình Raspberry thành công",
                    variant: "success",
                })
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            console.log('Cập nhật cấu hình Raspberry thất bại: ', error)

            toast({
                title: "Cập nhật cấu hình Raspberry thất bại",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        fetchRaspberryList()
        getAvailableLabels()
    }, [])

    useEffect(() => {
        if (raspberryCode) {
            getRaspberryConfig()
        }
    }, [raspberryCode])

    return (
        <>
            <PageBreadcrumb pageTitle={'Cấu hình máy chủ Raspberry'} pageTitleSmall={'Raspberry'}/>
            <div className="space-y-6">
                <div
                    className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}>
                    <div className="grid grid-cols-12 gap-4 p-4">
                        <div className="col-span-4">
                            <Image
                                src="/images/raspberry.png"
                                alt=" grid"
                                className="w-full border border-gray-200 rounded-xl dark:border-gray-800 mb-3"
                                width={517}
                                height={295}
                            />
                            <Select
                                onValueChange={(value) => {
                                    const selectedRasp = raspberries.find(rasp => rasp.id === value);
                                    if (selectedRasp) {
                                        setRaspberryCode(selectedRasp.device_code)
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn Raspberry cần cấu hình"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        raspberries.length > 0 ? (
                                            raspberries.map(rasp => (
                                                <SelectItem
                                                    className={'cursor-pointer'}
                                                    value={rasp.id}
                                                >
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
                            {
                                raspberryCode ? (
                                    <h1 className={'text-xl'}>Raspberry: {raspberryCode}</h1>
                                ) : (
                                    <h1 className={'text-xl'}>Chọn Raspberry để cấu hình</h1>
                                )
                            }
                            {
                                labels && Array.isArray(labels) && raspberryConfig && raspberryConfig.labels ? (
                                    <div className="mt-4 space-y-2">
                                        <h1 className={'text-md font-bold'}>Chọn các nhãn chính xác để sử dụng cho mô hình máy học trên Raspberry</h1>
                                        {labels.map((label, index) => {
                                            const isChecked = Array.isArray(raspberryConfig?.labels) &&
                                                raspberryConfig.labels.some(
                                                    (item) =>
                                                        item.fruit_id === label.fruit_id &&
                                                        item.type_id === label.type_id
                                                );

                                            const checkboxValue = `${label.fruit_id}-${label.type_id}`;

                                            return (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={checkboxValue}
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) =>
                                                            handleCheckboxChange(checked, label)
                                                        }
                                                        className="cursor-pointer"
                                                    />
                                                    <label htmlFor={checkboxValue} className="cursor-pointer">
                                                        {label.label}
                                                    </label>
                                                </div>
                                            );
                                        })}

                                        <CustomButton
                                            type="button"
                                            className='!mt-12 w-full'
                                            onClick={() => handleUpdateRaspberryConfig()}
                                        >
                                            Áp dụng cấu hình
                                        </CustomButton>
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}