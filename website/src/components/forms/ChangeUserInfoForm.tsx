'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormDetailInterface, UserInfo } from '@/interfaces';
import ComponentCard from '@/components/common/ComponentCard';
import InputField from '@/components/inputs/InputField';
import CustomButton from '@/components/buttons/CustomButton';
import { ChangeUserInfoBody, ChangeUserInfoBodyType } from '@/schemas/user.schema';
import axiosInstance, { handleAxiosError } from '@/utils/axiosInstance';
import { useToast } from '@/hooks';

const ChangeUserInfoForm = ({ data: userData, onUpdateSuccess }: FormDetailInterface<UserInfo>) => {
  const { toast } = useToast();
  const form = useForm<ChangeUserInfoBodyType>({
    resolver: zodResolver(ChangeUserInfoBody),
    defaultValues: {
      password: '',
      re_password: '',
    },
  });

  const handleSubmit = async (values: ChangeUserInfoBodyType): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('password', values.password);
      formData.append('re_password', values.re_password);
      formData.append('username', userData?.username);

      const resData = await axiosInstance.put('user/update', formData);

      if (resData.status === 200) {
        toast({ title: 'Cập nhật tài khoản thành công', variant: 'success' });
        await onUpdateSuccess?.(userData);
      }
    } catch (error) {
      toast({
        title: 'Cập nhật tài khoản khu thất bại',
        description: handleAxiosError(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <ComponentCard title={`Đổi thông tin của tài khoản ${userData?.username}`} className={'w-full'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={'password'}
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <InputField type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={'re_password'}
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Nhập lại mật khẩu mới</FormLabel>
                  <FormControl>
                    <InputField type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-full">
              <CustomButton type="submit" className="!mt-6 w-full">
                Thay đổi
              </CustomButton>
            </div>
          </div>
        </form>
      </Form>
    </ComponentCard>
  );
};

export default ChangeUserInfoForm;
