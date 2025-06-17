'use client'
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    CheckCircle,
    Edit,
} from "lucide-react";
import { onChangeDataEachFieldChange } from "@/utils/onChangeDataEachFieldChange";
import { Input } from "@/components/ui/input";
import axiosInstance, { handleAxiosError } from "@/utils/axiosInstance";
import { FormDetailInterface } from "@/interfaces";
import { FruitDetailInterface } from "@/interfaces/fruitDetail";
import ToggleLabelInput from "@/components/common/ToggleLabelInput";
import { FruitTypeSelect } from "@/types/fruitTypeSelect";
import { ImageFrameInterface } from "@/interfaces/imageFrame";
import ImageFrames from "@/components/common/ImageFrames";
import { Checkbox } from "@/components/ui/checkbox";

const ChangeFruitInfoForm = ({
    data: initialData,
    onUpdateSuccess,
}: FormDetailInterface<FruitDetailInterface>) => {
    const { toast } = useToast();
    const [editState, setEditState] = useState<boolean>(false);
    const [formData, setFormData] = useState<FruitDetailInterface>(initialData);
    const [fruitImages, setFruitImages] = useState<ImageFrameInterface[]>([]);
    const [storeFruitTypeChecked, setStoreFruitTypeChecked] = useState<number[]>([]);
    const [fruitTypesData, setFruitTypesData] = useState<FruitTypeSelect[]>([]);

    const fetchFruitImages = async (): Promise<void> => {
        try {
            const resData = await axiosInstance.get(`/fruit-images/${initialData.id}`);
            if (resData.data) {
                const images = resData.data.map((image: ImageFrameInterface) => ({ ...image, willDelete: false }))
                setFruitImages(images);
            }
        } catch (e) {
            toast({
                title: "Tải dữ liệu ảnh trái cây thất bại",
                description: handleAxiosError(e),
                variant: "destructive",
            });
        }
    };

    const fetchAllFruitTypes = async (): Promise<void> => {
        try {
            const resData = (await axiosInstance.get<FruitTypeSelect[]>('/fruit-types/all'));

            if (resData.data.length > 0) {
                setFruitTypesData(resData.data);
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

    const fetchTypesOfFruit = async (): Promise<void> => {
        try {
            const resData = await axiosInstance.get(`/fruit-types/getTypesOfFruit/${initialData.id}`);
            if (resData.data) {
                setStoreFruitTypeChecked(resData.data);
            }
        } catch (e) {
            toast({
                title: "Lỗi khi lấy danh sách các trạng thái trái cây",
                description: handleAxiosError(e),
                variant: "destructive",
            });
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

        Promise.all(imagePromises).then((imgUrls) => {
            const newImages: ImageFrameInterface[] = imgUrls.map((imgUrl: string) => ({
                id: `${Date.now()}-${Math.random()}`,
                image_url: imgUrl,
                willDelete: false,
            }));

            setFruitImages(prev => [...prev, ...newImages]);
        });

        e.target.value = '';
    };

    const handleSubmit = async () => {
        try {
            const form = new FormData();

            form.append('fruit_name', formData.fruit_name);
            form.append('fruit_desc', formData.fruit_desc);
            form.append('fruit_types', JSON.stringify(storeFruitTypeChecked));
            fruitImages.forEach((image) => {
                if (typeof image.id === 'string') {
                    // Ảnh mới thêm (từ frontend)
                    // Nếu là base64: cần convert sang File hoặc Blob
                    if (image.image_url?.startsWith("data:image")) {
                        const arr = image.image_url.split(',');
                        const mime = arr[0].match(/:(.*?);/)?.[1] || '';
                        const bstr = atob(arr[1]);
                        let n = bstr.length;
                        const u8arr = new Uint8Array(n);
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }

                        const file = new File([u8arr], `image_${Date.now()}.png`, { type: mime });
                        form.append("fruit_image", file);
                    }
                } else if (image.id != null && typeof image.id !== 'string' && !image.willDelete) {
                    // Ảnh cũ: chỉ giữ id hoặc url để báo backend
                    form.append("kept_image_ids", image.id.toString());
                }
            });

            const resData = await axiosInstance.put(
                `/fruits/update/${initialData.id}`,
                form,
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );

            if (resData.data) {
                toast({
                    title: 'Cập nhật thông tin thành công',
                    variant: "success",
                });

                await onUpdateSuccess?.(formData);
            };
        } catch (e) {
            toast({
                title: "Lỗi khi cập nhật thông tin trái cây",
                description: handleAxiosError(e),
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        fetchFruitImages();
        fetchAllFruitTypes();
        fetchTypesOfFruit();
    }, []);

    return (
        <div>
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                Thông tin trái cây
            </h3>

            <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 text-sm text-gray-500 dark:text-gray-400">
                                Tên trái cây (Nhãn)
                            </label>
                            <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                                <ToggleLabelInput
                                    fieldState={editState}
                                    fieldName={'fruit_name'}
                                    fieldValue={formData.fruit_name}
                                    fieldType={'input'}
                                    onFieldChange={(value) =>
                                        onChangeDataEachFieldChange('fruit_name', value, (field, value) =>
                                            setFormData((prev) => ({ ...prev, [field]: value }))
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm text-gray-500 dark:text-gray-400">
                                Mô tả
                            </label>
                            <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                                <ToggleLabelInput
                                    fieldState={editState}
                                    fieldName={'fruit_desc'}
                                    fieldValue={formData.fruit_desc}
                                    fieldType={'input'}
                                    onFieldChange={(value) =>
                                        onChangeDataEachFieldChange('fruit_desc', value, (field, value) =>
                                            setFormData((prev) => ({ ...prev, [field]: value }))
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    {editState && (
                        <div className="mt-6">
                            <label className="block mb-1 text-sm text-gray-500 dark:text-gray-400">
                                Chọn hình ảnh mới
                            </label>
                            <Input
                                type="file"
                                accept="image/*"
                                className="w-full mt-3"
                                onChange={(e) => {
                                    onSelectImages(e);
                                }}
                                multiple
                            />
                        </div>
                    )}
                    <div className="mt-6 flex">
                        <ImageFrames
                            images={fruitImages}
                            onDelete={editState}
                            onImageDelete={(imageId) => {
                                setFruitImages(prevImages =>
                                    typeof imageId === 'string'
                                        ? prevImages.filter(image => image.id !== imageId)
                                        : prevImages.map(image =>
                                            image.id === imageId ? { ...image, willDelete: true } : image
                                        )
                                );
                            }}

                        />
                    </div>
                    <div className="mt-6">
                        <label className="block mb-1 text-sm text-gray-500 dark:text-gray-400">
                            Chọn tình trạng
                        </label>

                        {fruitTypesData.map((type) => {
                            const typeIdStr = String(type.id);
                            const isChecked = storeFruitTypeChecked.includes(type.id);

                            return (
                                <div key={typeIdStr} className="flex items-center space-x-2 my-2">
                                    <Checkbox
                                        id={typeIdStr}
                                        checked={isChecked}
                                        onCheckedChange={(checked: boolean) => {
                                            setStoreFruitTypeChecked((prev) =>
                                                checked
                                                    ? [...prev, type.id]
                                                    : prev.filter((id) => id !== type.id)
                                            );
                                        }}
                                        className="cursor-pointer"
                                    />
                                    <label htmlFor={typeIdStr} className="cursor-pointer">
                                        {`${type.type_name} - ${type.type_desc}`}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 flex justify-end">
                        {editState ? (
                            <button
                                onClick={async () => {
                                    await handleSubmit();
                                    setEditState(false);
                                }}
                                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Lưu
                            </button>
                        ) : (
                            <button
                                onClick={() => setEditState(true)}
                                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <Edit className="w-4 h-4" />
                                Sửa
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeFruitInfoForm;