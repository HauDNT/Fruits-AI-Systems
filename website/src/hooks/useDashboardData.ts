import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import axiosInstance, { handleAxiosError } from '@/utils/axiosInstance';

export const TIME_FRAMES = ['Tuần', 'Tháng', 'Năm'];

export function useDashboardData() {
  const queryClient = useQueryClient();

  const [classifyChartTab, setClassifyChartTab] = useState({
    fruit: undefined as string | undefined,
    timeFrame: TIME_FRAMES[0],
  });

  const onSelectTab = (value: string, type: 'fruit' | 'timeFrame') => {
    setClassifyChartTab((prev) => ({ ...prev, [type]: value }));
  };

  // Fetch useQuery 1: Card data
  const cardDataQuery = useQuery({
    queryKey: ['dashboard', 'cardData'],
    queryFn: async () => {
      const [users, fruits, results, employees, fruitTypes, areas, devices, deviceTypes] =
        await Promise.all([
          axiosInstance.get('/statistical/amount-users'),
          axiosInstance.get('/statistical/amount-fruits'),
          axiosInstance.get('/statistical/amount-classify-result'),
          axiosInstance.get('/statistical/amount-employees'),
          axiosInstance.get('/statistical/amount-fruit-types'),
          axiosInstance.get('/statistical/amount-areas'),
          axiosInstance.get('/statistical/amount-devices'),
          axiosInstance.get('/statistical/amount-device-types'),
        ]);
      return {
        amountAccounts: users.data,
        amountFruits: fruits.data,
        amountResults: results.data,
        amountEmployees: employees.data,
        amountFruitTypes: fruitTypes.data,
        amountAreas: areas.data,
        amountDevices: devices.data,
        amountDeviceTypes: deviceTypes.data,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 phút
  });

  // Fetch useQuery 2: Fruit list
  const fruitsQuery = useQuery<string[]>({
    queryKey: ['dashboard', 'fruits'],
    queryFn: async (): Promise<string[]> => {
      const res = await axiosInstance.get('/fruits/all');
      return res.data?.map((f: any) => f.fruit_name) ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (fruitsQuery.data && fruitsQuery.data.length > 0) {
      setClassifyChartTab((prev) => ({
        ...prev,
        fruit: fruitsQuery.data![0],
      }));
    }
  }, [fruitsQuery.data]);

  // Fetch useQuery 3: Ratio fruits
  const ratioFruitsQuery = useQuery({
    queryKey: ['dashboard', 'ratioFruits'],
    queryFn: async () => {
      const res = await axiosInstance.get('/statistical/ratio-fruits');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch useQuery 4: Employees each area
  const employeesEachAreaQuery = useQuery({
    queryKey: ['dashboard', 'employeesEachArea'],
    queryFn: async () => {
      const res = await axiosInstance.get('/statistical/employees-each-area');
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch useQuery 5: Chart fruit & timeFrame
  const chartDataQuery = useQuery({
    queryKey: ['dashboard', 'classifyChart', classifyChartTab.fruit, classifyChartTab.timeFrame],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/statistical/classify-chart?fruit=${classifyChartTab.fruit}&time_frame=${classifyChartTab.timeFrame}`,
      );
      return res.data;
    },
    enabled: !!classifyChartTab.fruit, // không chạy nếu chưa có fruit
    staleTime: 5 * 60 * 1000,
  });

  const onUpdateEventSocketListener = useCallback(async () => {
    await queryClient.refetchQueries({
      queryKey: ['dashboard', 'classifyChart', classifyChartTab.fruit, classifyChartTab.timeFrame],
    });
    await queryClient.refetchQueries({ queryKey: ['dashboard', 'ratioFruits'] });
    await queryClient.invalidateQueries({ queryKey: ['dashboard', 'cardData'] });
  }, [classifyChartTab]);

  return {
    cardData: cardDataQuery.data ?? {
      amountAccounts: 0,
      amountFruits: 0,
      amountResults: 0,
      amountEmployees: 0,
      amountFruitTypes: 0,
      amountAreas: 0,
      amountDevices: 0,
      amountDeviceTypes: 0,
    },
    fruits: fruitsQuery.data ?? [],
    ratioFruits: ratioFruitsQuery.data,
    employeesEachArea: employeesEachAreaQuery.data,
    chartData: chartDataQuery.data ?? { series: [], categories: [] },
    classifyChartTab,
    onSelectTab,
    setCardData: (callback: (prev: any) => any) => {
      const current = cardDataQuery.data;
      if (current) {
        const updated = callback(current);
        queryClient.setQueryData(['dashboard', 'cardData'], updated);
      }
    },
    onUpdateEventSocketListener,
  };
}
