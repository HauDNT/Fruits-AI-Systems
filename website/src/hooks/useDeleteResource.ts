import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

export const useDeleteResource = (
  resource: string,
  idsColumnName: string = 'itemIds',
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: any) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemIds: string[]) => {
      await axiosInstance.delete(`/${resource}/delete`, {
        data: { [idsColumnName]: itemIds },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      onErrorCallback?.(error);
    },
  });
};
