'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axiosInstance, { handleAxiosError } from '@/utils/axiosInstance';
import ToggleLabelInput from '@/components/common/ToggleLabelInput';
import { onChangeDataEachFieldChange } from '@/utils/onChangeDataEachFieldChange';
import { Input } from '@/components/ui/input';
import { getValidImageUrl } from '@/utils/displayImageUrlSwitchBlob';
import { DeviceDetail, FormDetailInterface } from '@/interfaces';
import { AreaSelect, DeviceStatusSelect, DeviceTypeSelect } from '@/types/index';
import { isIntegerString } from '@/utils/isIntegerString';
import { convertStringToIdInSelectOptions } from '@/utils/convertStringToIdInSelectOptions';

const ChangeDeviceInfoForm = ({
  data: deviceData,
  onUpdateSuccess,
}: FormDetailInterface<DeviceDetail>) => {
  const { toast } = useToast();
  const [editState, setEditState] = useState<boolean>(false);
  const [saveData, setSaveData] = useState<DeviceDetail>(deviceData);
  const [formData, setFormData] = useState<DeviceDetail>(deviceData);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatusSelect[]>([]);
  const [areas, setAreas] = useState<AreaSelect[]>([]);

  const fetchFormData = async (): Promise<void> => {
    Promise.all([
      axiosInstance.get<DeviceStatusSelect[]>('/device-status/all'),
      axiosInstance.get<AreaSelect[]>('/areas/all'),
    ])
      .then(([resStatuses, resAreas]) => {
        setDeviceStatuses(resStatuses.data);
        setAreas(resAreas.data);
      })
      .catch((error) => {
        toast({
          title: 'Đã xảy ra lỗi khi lấy dữ liệu',
          description: error.message,
          variant: 'destructive',
        });
      });
  };

  const updateFruitTypeData = async (): Promise<void> => {
    try {
      if (isIntegerString(formData.area) && isIntegerString(formData.deviceStatus)) {
        const form = new FormData();
        form.append('area', formData.area);
        form.append('deviceStatus', formData.deviceStatus);

        if (newImageFile) {
          form.append('image_url', newImageFile);
        }

        const resData = await axiosInstance.put(`/devices/update/${formData.id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (resData.data) {
          toast({
            title: `Cập nhật thiết bị ${formData.device_code} thành công`,
            variant: 'success',
          });

          const formatData: any = {
            ...formData,
            deviceStatus: resData.data.deviceStatus,
            area: resData.data.area,
          };

          await onUpdateSuccess?.(formatData);
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        title: `Cập nhật thiết bị ${formData.device_code} thất bại`,
        variant: 'destructive',
      });

      await onUpdateSuccess?.(saveData);
    }
  };

  const convertFieldToIndexOption = () => {
    setFormData((prev) => ({
      ...prev,
      area: convertStringToIdInSelectOptions<string>(prev.area, areas, 'id', 'area_desc'),
      deviceStatus: convertStringToIdInSelectOptions<string>(
        prev.deviceStatus,
        deviceStatuses,
        'id',
        'status_name',
      ),
    }));
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  useEffect(() => {
    if (editState && areas.length > 0 && deviceStatuses.length > 0) {
      convertFieldToIndexOption();
    }
  }, [editState, areas, deviceStatuses]);

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
                  src={getValidImageUrl(formData?.image_url)}
                  alt="device image"
                  unoptimized
                />
              </div>
              <div className="order-3 xl:order-2">
                <p className="mb-2 text-lg leading-normal black dark:white">Thiết bị</p>
                <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                  {formData.device_code}
                </h4>
              </div>
            </div>
            {editState ? (
              <button
                onClick={async () => {
                  if (editState) {
                    await updateFruitTypeData();
                  }

                  setEditState((prev) => !prev);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                <CheckCircle />
              </button>
            ) : (
              <button
                onClick={() => setEditState((prev) => !prev)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                <Edit />
              </button>
            )}
          </div>
        </div>
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="w-full">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Trạng thái thiết bị
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    <ToggleLabelInput
                      fieldState={editState}
                      fieldName={'deviceStatus'}
                      fieldValue={formData.deviceStatus}
                      fieldType={'options'}
                      dataForOptions={deviceStatuses.map((status) => ({
                        label: status.status_name,
                        value: status.id,
                      }))}
                      onFieldChange={(value) =>
                        onChangeDataEachFieldChange('deviceStatus', value, (field, value) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field]: value,
                          })),
                        )
                      }
                    />
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                    Khu vực lắp đặt
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    <ToggleLabelInput
                      fieldState={editState}
                      fieldName={'area'}
                      fieldValue={formData.area}
                      fieldType={'options'}
                      dataForOptions={areas.map((area) => ({
                        label: area.area_desc,
                        value: area.id,
                      }))}
                      onFieldChange={(value) =>
                        onChangeDataEachFieldChange('area', value, (field, value) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field]: value,
                          })),
                        )
                      }
                    />
                  </p>
                </div>
              </div>
              {editState && (
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
                          setFormData((prev) => ({
                            ...prev,
                            image_url: URL.createObjectURL(file),
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeDeviceInfoForm;
