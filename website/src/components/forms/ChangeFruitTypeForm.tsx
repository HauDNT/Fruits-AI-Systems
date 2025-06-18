'use client';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Edit } from 'lucide-react';
import { FormDetailInterface, FruitType } from '@/interfaces/index';
import ToggleLabelInput from '@/components/common/ToggleLabelInput';
import { onChangeDataEachFieldChange } from '@/utils/onChangeDataEachFieldChange';
import axiosInstance, { handleAxiosError } from '@/utils/axiosInstance';

const ChangeFruitTypeForm = ({
  data: fruitTypeData,
  onUpdateSuccess,
}: FormDetailInterface<FruitType>) => {
  const { toast } = useToast();
  const [editState, setEditState] = useState<boolean>(false);
  const [formData, setFormData] = useState<FruitType>(fruitTypeData);

  const handleSubmit = async (): Promise<void> => {
    try {
      const form = new FormData();
      form.append('type_name', formData.type_name);
      form.append('type_desc', formData.type_desc);

      const resData = await axiosInstance.put(`/fruit-types/update/${formData.id}`, formData);

      if (resData.data) {
        toast({
          title: `Cập nhật thành công`,
          variant: 'success',
        });

        await onUpdateSuccess?.(formData);
      }
    } catch (error) {
      toast({
        title: 'Cập nhật tình trạng trái cây thất bại',
        description: handleAxiosError(error),
        variant: 'destructive',
      });
    }
  };

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
                  fieldName={'type_name'}
                  fieldValue={formData.type_name}
                  fieldType={'input'}
                  onFieldChange={(value) =>
                    onChangeDataEachFieldChange('type_name', value, (field, value) =>
                      setFormData((prev) => ({ ...prev, [field]: value })),
                    )
                  }
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm text-gray-500 dark:text-gray-400">Mô tả</label>
              <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                <ToggleLabelInput
                  fieldState={editState}
                  fieldName={'type_desc'}
                  fieldValue={formData.type_desc}
                  fieldType={'input'}
                  onFieldChange={(value) =>
                    onChangeDataEachFieldChange('type_desc', value, (field, value) =>
                      setFormData((prev) => ({ ...prev, [field]: value })),
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-9">
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
  );
};

export default ChangeFruitTypeForm;
