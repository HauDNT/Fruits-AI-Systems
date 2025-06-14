'use client'
import React, { useState } from "react";
import Image from "next/image";
import {
    CheckCircle,
    Edit
} from "lucide-react";
import { AreaDetail, FormDetailInterface } from "@/interfaces"
import { useToast } from "@/hooks/use-toast";
import axiosInstance, { handleAxiosError } from "@/utils/axiosInstance";
import ToggleLabelInput from "@/components/common/ToggleLabelInput";
import { onChangeDataEachFieldChange } from "@/utils/onChangeDataEachFieldChange";
import { Input } from "@/components/ui/input";
import { displayImageUrlSwitchBlob } from "@/utils/displayImageUrlSwitchBlob";

const ChangeAreaInfoForm = ({
    data: areaData,
    onUpdateSuccess,
}: FormDetailInterface<AreaDetail>) => {
    const { toast } = useToast();
    const [editState, setEditState] = useState<boolean>(false);
    const [formData, setFormData] = useState<AreaDetail>(areaData);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

    const updateAreaData = async (): Promise<void> => {
        try {
            const form = new FormData();
            form.append('area_code', formData.area_code);
            form.append('area_desc', formData.area_desc);

            if (newImageFile) {
                form.append('image_url', newImageFile);
            };

            console.log('Form data: ', form);

            const resData = await axiosInstance.put(
                '/areas/update',
                form,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );

            if (resData.data) {
                toast({
                    title: `Cập nhật thông tin ${formData.area_desc} thành công`,
                    variant: "success",
                });
                
                await onUpdateSuccess?.(formData);
            }

            setNewImageFile(null);
        } catch (error) {
            toast({
                title: "Cập nhật thông tin khu thất bại",
                description: handleAxiosError(error),
                variant: "destructive",
            });
        }
    };

    return (
        <div>
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                Thông tin khu phân loại
            </h3>
            <div className="space-y-6">
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                            <div className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-sm">
                                <Image
                                    width={300}
                                    height={300}
                                    src={displayImageUrlSwitchBlob(formData?.image_url)}
                                    alt="area image"
                                    unoptimized
                                />
                            </div>
                            <div className="order-3 xl:order-2">
                                <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                    {formData.area_code}
                                </h4>
                                <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formData.area_desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {
                            editState ? (
                                <button
                                    onClick={async () => {
                                        if (editState) {
                                            await updateAreaData();
                                        }

                                        setEditState(prev => !prev);
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                                >
                                    <CheckCircle />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setEditState(prev => !prev)}
                                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                                >
                                    <Edit />
                                </button>
                            )
                        }
                    </div>
                </div>
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="w-full">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                <div>
                                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                        Mã khu
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        <ToggleLabelInput
                                            fieldState={false}
                                            fieldName={'area_code'}
                                            fieldValue={formData.area_code}
                                            fieldType={'input'}
                                            onFieldChange={() => { }}
                                        />
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                        Mô tả khu
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        <ToggleLabelInput
                                            fieldState={editState}
                                            fieldName={'area_desc'}
                                            fieldValue={formData.area_desc}
                                            fieldType={'input'}
                                            onFieldChange={(value) => onChangeDataEachFieldChange(
                                                'area_desc',
                                                value,
                                                (field, value) => setFormData(prev => ({
                                                    ...prev,
                                                    [field]: value
                                                }))
                                            )}
                                        />
                                    </p>
                                </div>
                            </div>
                            {
                                editState &&
                                <div className="mt-6 grid grid-cols-1">
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Chọn hình ảnh mới
                                        </p>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="w-full mb-0"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];

                                                if (file) {
                                                    setNewImageFile(file);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        image_url: URL.createObjectURL(file)
                                                    }));
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeAreaInfoForm