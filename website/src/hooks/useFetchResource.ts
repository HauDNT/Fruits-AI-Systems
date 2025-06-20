import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

type FetchResourceParams = {
  resource: string;
  page?: number;
  limit?: number;
  queryString?: string;
  searchFields?: string;
};

export const useFetchResource = ({
  resource,
  page = 1,
  limit = 10,
  queryString = '',
  searchFields = '',
}: FetchResourceParams) => {
  return useQuery({
    queryKey: [resource, page, limit, queryString, searchFields],
    queryFn: async () => {
      const response = await axiosInstance.get(`/${resource}`, {
        params: { page, limit, queryString, searchFields },
      });

      return response.data;
    },
    staleTime: 5 * 1000, // 5 seconds
  });
};
