'use client';
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeviceBody, DeviceBodyType } from '@/schemas/device.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormInterface } from '@/interfaces';
import ComponentCard from '@/components/common/ComponentCard';
import { Input } from '@/components/ui/input';
import CustomButton from '@/components/buttons/CustomButton';
import axiosInstance from '@/utils/axiosInstance';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AreaSelect, DeviceStatusSelect, DeviceTypeSelect } from '@/types/index';

const CreateNewDeviceForm = ({ className, onSubmit, onClose }: FormInterface<FormData>) => {
  const { toast } = useToast();
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeSelect[]>([]);
  const [deviceStatuses, setDeviceStatuses] = useState<DeviceStatusSelect[]>([]);
  const [areas, setAreas] = useState<AreaSelect[]>([]);
  const form = useForm<DeviceBodyType>({
    resolver: zodResolver(DeviceBody),
    defaultValues: {
      type_id: undefined,
      area_id: undefined,
      status_id: undefined,
      device_image: undefined,
    },
  });

  const fetchFormData = async (): Promise<void> => {
    Promise.all([
      axiosInstance.get<DeviceStatusSelect[]>('/device-status/all'),
      axiosInstance.get<DeviceTypeSelect[]>('/device-types/all'),
      axiosInstance.get<AreaSelect[]>('/areas/all'),
    ])
      .then(([resStatuses, resTypes, resAreas]) => {
        setDeviceStatuses(resStatuses.data);
        setDeviceTypes(resTypes.data);
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

  const handleSubmit = async (values: DeviceBodyType): Promise<void> => {
    const formData = new FormData();
    formData.append('type_id', values.type_id);
    formData.append('area_id', values.area_id);
    formData.append('status_id', values.status_id);
    formData.append('device_image', values.device_image);

    const submitResult = await onSubmit(formData);
    if (submitResult) {
      form.reset();
      onClose?.();
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  return (
    <ComponentCard title="Thêm thiết bị mới" className={'w-full'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={` ${className}`}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className={'text-blue-500 italic col-span-full'}>(Mã/Tên thiết bị tự sinh)</div>
            <FormField
              control={form.control}
              name="type_id"
              render={({ field }) => (
                <FormItem className="mb-0">
                  <FormLabel>Loại thiết bị</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại thiết bị" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={'text-black'}>
                      {deviceTypes.map((type, index) => (
                        <SelectItem key={index} className={'cursor-pointer'} value={type.id + ''}>
                          {type.type_name}
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
              name="status_id"
              render={({ field }) => (
                <FormItem className="mb-0">
                  <FormLabel>Trạng thái thiết bị</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái thiết bị" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deviceStatuses.map((status, index) => (
                        <SelectItem key={index} className={'cursor-pointer'} value={status.id + ''}>
                          {status.status_name}
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
              name="area_id"
              render={({ field }) => (
                <FormItem className="mb-0">
                  <FormLabel>Khu vực lắp đặt</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khu vực lắp đặt thiết bị" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areas.map((area, index) => (
                        <SelectItem key={index} value={area.id + ''}>
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
              name="device_image"
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
              <CustomButton type="submit" className="!mt-0 w-full">
                Thêm
              </CustomButton>
            </div>
          </div>
        </form>
      </Form>
    </ComponentCard>
  );
};

export default CreateNewDeviceForm;
