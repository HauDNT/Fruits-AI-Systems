'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    CheckCircle,
    Edit
} from "lucide-react";
import { EmployeeDetailInterface, FormDetailInterface } from "@/interfaces";
import { Gender } from "@/enums";
import ToggleLabelInput from "@/components/common/ToggleLabelInput";
import axiosInstance, { handleAxiosError } from "@/utils/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { ToggleLabelInputOptionsDataType } from "@/types";
import { onChangeDataEachFieldChange } from "@/utils/onChangeDataEachFieldChange";
import { getValidImageUrl } from "@/utils/displayImageUrlSwitchBlob";
import { Input } from "@/components/ui/input";

const ChangeEmployeeInfoForm = ({
    data: initialData,
    onUpdateSuccess,
}: FormDetailInterface<EmployeeDetailInterface>) => {
    const { toast } = useToast();
    const [editState, setEditState] = useState<boolean>(false);
    const [areas, setAreas] = useState<ToggleLabelInputOptionsDataType[]>([]);
    const [formData, setFormData] = useState<EmployeeDetailInterface>(initialData);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);

    const fetchAreas = async () => {
        try {
            const resData = await axiosInstance.get('/areas/all');
            if (resData.data) {
                const formattedAreasData = resData.data.map((area: any) => ({
                    label: area.area_desc,
                    value: area.id
                }));
                setAreas(formattedAreasData);
            }
        } catch (e) {
            toast({
                title: "Tải dữ liệu khu làm việc thất bại",
                description: handleAxiosError(e),
                variant: "destructive",
            });
        }
    };

    const updateProfile = async (): Promise<void> => {
        try {
            const form = new FormData();
            form.append('employee_code', formData.employee_code);
            form.append('fullname', formData.fullname);
            form.append('gender', formData.gender + '');
            form.append('phone_number', formData.phone_number);
            form.append('area_id', formData.area_id + '');

            if (newImageFile) {
                form.append('avatar_url', newImageFile);
            };

            const resData = await axiosInstance.put(
                `/employees/update/`,
                form,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );

            if (resData.data) {
                toast({
                    title: `Cập nhật thông tin nhân viên ${formData.fullname} thành công`,
                    variant: "success",
                });

                await onUpdateSuccess?.(formData);
            };
        } catch (error) {
            toast({
                title: "Cập nhật thông tin nhân viên thất bại",
                description: handleAxiosError(error),
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        fetchAreas();
    }, []);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    return (
        <div>
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                Thông tin nhân viên
            </h3>
            <div className="space-y-6">
                <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                                <Image
                                    width={100}
                                    height={100}
                                    src={getValidImageUrl(formData?.avatar_url)}
                                    alt="Employee avatar"
                                    unoptimized
                                />
                            </div>
                            <div className="order-3 xl:order-2">
                                <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                    {formData.fullname}
                                </h4>
                                <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formData.employee_code}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {
                            editState ? (
                                <button
                                    onClick={async () => {
                                        if (editState) {
                                            await updateProfile();
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
                                        Họ và tên
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        <ToggleLabelInput
                                            fieldState={editState}
                                            fieldName={'fullname'}
                                            fieldValue={formData.fullname}
                                            fieldType={'input'}
                                            onFieldChange={(value) => onChangeDataEachFieldChange(
                                                'fullname',
                                                value,
                                                (field, value) => setFormData(prev => ({
                                                    ...prev,
                                                    [field]: value
                                                }))
                                            )}
                                        />
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                        Giới tính
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        <ToggleLabelInput
                                            fieldState={editState}
                                            fieldName={'gender'}
                                            fieldValue={formData.gender}
                                            fieldType={'options'}
                                            optionPlaceHolder={'Chọn giới tính'}
                                            dataForOptions={[
                                                {
                                                    label: 'Nam',
                                                    value: Gender.Male
                                                },
                                                {
                                                    label: 'Nữ',
                                                    value: Gender.Female
                                                },
                                                {
                                                    label: 'Khác',
                                                    value: Gender.Other
                                                },
                                            ]}
                                            onFieldChange={(value) => onChangeDataEachFieldChange(
                                                'gender',
                                                value,
                                                (field, value) => setFormData(prev => ({
                                                    ...prev,
                                                    [field]: +value
                                                }))
                                            )}
                                        />
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                        Số điện thoại
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        <ToggleLabelInput
                                            fieldState={editState}
                                            fieldName={'phone_number'}
                                            fieldValue={formData.phone_number}
                                            fieldType={'input'}
                                            onFieldChange={(value) => onChangeDataEachFieldChange(
                                                'phone_number',
                                                value,
                                                (field, value) => setFormData(prev => ({
                                                    ...prev,
                                                    [field]: value
                                                }))
                                            )}
                                        />
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                        Khu làm việc
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        <ToggleLabelInput
                                            fieldState={editState}
                                            fieldName={'area_id'}
                                            fieldValue={formData.area_id}
                                            fieldType={'options'}
                                            optionPlaceHolder={'Chọn khu vực làm việc'}
                                            dataForOptions={areas}
                                            onFieldChange={(value) => onChangeDataEachFieldChange(
                                                'area_id',
                                                value,
                                                (field, value) => setFormData(prev => ({
                                                    ...prev,
                                                    [field]: +value
                                                }))
                                            )}
                                        />
                                    </p>
                                </div>
                            </div>
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
                                                avatar_url: URL.createObjectURL(file)
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
    );
};

export default ChangeEmployeeInfoForm;