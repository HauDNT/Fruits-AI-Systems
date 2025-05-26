import {useEffect, useState, useCallback} from "react";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";
import {useToast} from "@/hooks/use-toast";

export const TIME_FRAMES = ["Tuần", "Tháng", "Năm"];

export function useDashboardData() {
    const {toast} = useToast();

    const [cardData, setCardData] = useState({
        amountAccounts: 0,
        amountFruits: 0,
        amountResults: 0,
        amountDevices: 0,
        amountEmployees: 0,
        amountFruitTypes: 0,
        amountAreas: 0,
        amountDeviceTypes: 0,
    });

    const [fruits, setFruits] = useState<string[]>([]);
    const [ratioFruits, setRatioFruits] = useState(null);
    const [employeesEachArea, setEmployeesEachArea] = useState(null);
    const [classifyChartTab, setClassifyChartTab] = useState({
        fruit: undefined,
        timeFrame: TIME_FRAMES[0],
    });
    const [chartData, setChartData] = useState({series: [], categories: []});

    const onSelectTab = (value: string, type: "fruit" | "timeFrame") => {
        setClassifyChartTab(prev => ({...prev, [type]: value}));
    };

    const fetchCardData = async () => {
        try {
            const [
                users, fruits, results, employees,
                fruitTypes, areas, devices, deviceTypes,
            ] = await Promise.all([
                axiosInstance.get("/statistical/amount-users"),
                axiosInstance.get("/statistical/amount-fruits"),
                axiosInstance.get("/statistical/amount-classify-result"),
                axiosInstance.get("/statistical/amount-employees"),
                axiosInstance.get("/statistical/amount-fruit-types"),
                axiosInstance.get("/statistical/amount-areas"),
                axiosInstance.get("/statistical/amount-devices"),
                axiosInstance.get("/statistical/amount-device-types"),
            ]);
            setCardData({
                amountAccounts: users.data,
                amountFruits: fruits.data,
                amountResults: results.data,
                amountEmployees: employees.data,
                amountFruitTypes: fruitTypes.data,
                amountAreas: areas.data,
                amountDevices: devices.data,
                amountDeviceTypes: deviceTypes.data,
            });
        } catch (err) {
            toast({
                title: "Tải dữ liệu card dashboard thất bại",
                description: handleAxiosError(err),
                variant: "destructive"
            });
        }
    };

    const fetchFruitList = async () => {
        try {
            const res = await axiosInstance.get("/fruits/all");
            const names = res.data?.map((f: any) => f.fruit_name) ?? [];
            setFruits(names);
            setClassifyChartTab(prev => ({...prev, fruit: names[0]}));
        } catch (err) {
            toast({
                title: "Tải danh sách trái cây thất bại",
                description: handleAxiosError(err),
                variant: "destructive"
            });
        }
    };

    const fetchChartData = async (fruit: string, timeFrame: string) => {
        try {
            const res = await axiosInstance.get(`/statistical/classify-chart?fruit=${fruit}&time_frame=${timeFrame}`);
            setChartData(res.data);
        } catch (err) {
            toast({title: "Tải biểu đồ thất bại", description: handleAxiosError(err), variant: "destructive"});
        }
    };

    const fetchRatioOfFruits = async () => {
        try {
            const res = await axiosInstance.get("/statistical/ratio-fruits");
            setRatioFruits(res.data);
        } catch (err) {
            toast({
                title: "Tải dữ liệu phân bổ trái cây thất bại",
                description: handleAxiosError(err),
                variant: "destructive"
            });
        }
    }

    const fetchEmployeesEachArea = async () => {
        try {
            const res = await axiosInstance.get("/statistical/employees-each-area");
            setEmployeesEachArea(res.data);
        } catch (err) {
            toast({
                title: "Tải dữ liệu nhân viên của từng khu phân loại thất bại",
                description: handleAxiosError(err),
                variant: "destructive"
            });
        }
    }

    useEffect(() => {
        fetchCardData();
        fetchFruitList();
        fetchRatioOfFruits();
        fetchEmployeesEachArea();
    }, []);

    useEffect(() => {
        if (classifyChartTab.fruit && classifyChartTab.timeFrame) {
            fetchChartData(classifyChartTab.fruit, classifyChartTab.timeFrame);
        }
    }, [classifyChartTab]);

    const onUpdateEventSocketListener = useCallback(async () => {
        await fetchChartData(classifyChartTab.fruit!, classifyChartTab.timeFrame);
        await fetchRatioOfFruits();
    }, [classifyChartTab.fruit, classifyChartTab.timeFrame]);

    return {
        cardData,
        fruits,
        ratioFruits,
        employeesEachArea,
        chartData,
        classifyChartTab,
        onSelectTab,
        setCardData,
        onUpdateEventSocketListener,
    };
}
