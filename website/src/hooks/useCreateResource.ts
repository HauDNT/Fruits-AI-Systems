import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

export const useCreateResource = (
  resource: string,
  typeForm: 'json' | 'formdata',
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: any) => void,
) => {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const headers =
        typeForm === 'formdata'
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' };
      const response = await axiosInstance.post(`/${resource}/create`, data, { headers });
      return response.data;
    },
    onSuccess() {
      queryclient.invalidateQueries({ queryKey: [resource] }), onSuccessCallback?.();
    },
    onError: (error: any) => {
      onErrorCallback?.(error);
    },
  });
};
