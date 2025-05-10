"use client"
import {useEffect, useState} from "react";
import {useToast} from "@/hooks/use-toast";
import {
    UserCircle,
    Apple,
    Cpu,
    Users,
    HeartPulse,
    ScanEye,
    Computer,
    Zap,
} from "lucide-react";
import DashboardCard from "@/components/cards/DashboardCard"
import ClassifyResultsChart from "@/components/charts/ClassifyResultsChart";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";
import { useSocketFruitClassify } from "@/hooks/useSocketFruitClassify";
import {ClassifyResultInterface} from "@/interfaces";

export default function AdminDashboard() {
    const {toast} = useToast()
    const [cardData, setCardData] = useState({
        amountAccounts: 0,
        amountFruits: 0,
        amountResults: 0,
        amountDevices: 0,
        amountEmployees: 0,
        amountFruitTypes: 0,
        amountAreas: 0,
        amountDeviceTypes: 0,
    })
    const [fruits, setFruits] = useState([])
    const [classifyChartData, setClassifyChartData] = useState([])
    const [classifyChartTab, setClassifyChartTab] = useState({
        fruit: fruits[0],
        timeFrame: "Tuần",
    })
    const dashboardCartItems = [
        {
            name: "Tài khoản",
            number: cardData.amountAccounts,
            icon: UserCircle
        },
        {
            name: "Loại trái cây",
            number: cardData.amountFruits,
            icon: Apple,
        },
        {
            name: "Số lượng đã phân loại",
            number: cardData.amountResults,
            icon: ScanEye,
            className: "border-[3px] border-blue-500 p-5 dark:border-yellow-300",
            disableAnimation: true,
        },
        {
            name: "Thiết bị",
            number: cardData.amountDevices,
            icon: Cpu,
        },
        {
            name: "Nhân viên",
            number: cardData.amountEmployees,
            icon: Users,
        },
        {
            name: "Tình trạng trái cây",
            number: cardData.amountFruitTypes,
            icon: HeartPulse,
        },
        {
            name: "Khu vực",
            number: cardData.amountAreas ?? 0,
            icon: Computer,
        },
        {
            name: "Loại thiết bị",
            number: cardData.amountDeviceTypes ?? 0,
            icon: Zap,
        },
    ]

    const onUpdateClassifyChartTabSelect = async (option: number, type: string) => {
        if (type === 'fruit') {
            setClassifyChartTab((prev) => ({...prev, fruit: option}))
        }
        else if (type === 'timeFrame') {
            setClassifyChartTab((prev) => ({...prev, timeFrame: option}))
        } else {
            toast({
                title: "Xảy ra lỗi khi chọn tab thống kê biểu đồ. Hãy tải lại trang!",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    const fetchCardDashboardData = async () => {
        try {
            const [
                resAmountAccounts,
                resAmountFruits,
                resAmountResults,
                resAmountEmployees,
                resAmountFruitTypes,
                resAmountAreas,
                resAmountDevices,
                resAmountDeviceTypes,
            ] = await Promise.all([
                axiosInstance.get('/statistical/amount-users'),
                axiosInstance.get('/statistical/amount-fruits'),
                axiosInstance.get('/statistical/amount-classify-result'),
                axiosInstance.get('/statistical/amount-employees'),
                axiosInstance.get('/statistical/amount-fruit-types'),
                axiosInstance.get('/statistical/amount-areas'),
                axiosInstance.get('/statistical/amount-devices'),
                axiosInstance.get('/statistical/amount-device-types'),
            ])

            if (fetchCardDashboardData) {
                setCardData({
                    amountAccounts: resAmountAccounts.data,
                    amountFruits: resAmountFruits.data,
                    amountResults: resAmountResults.data,
                    amountEmployees: resAmountEmployees.data,
                    amountFruitTypes: resAmountFruitTypes.data,
                    amountAreas: resAmountAreas.data,
                    amountDevices: resAmountDevices.data,
                    amountDeviceTypes: resAmountDeviceTypes.data,
                })
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            console.log('Lỗi khi tải dữ liệu card dashboard: ', error)

            toast({
                title: "Tải dữ liệu card dashboard thất bại",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    const fetchFruitsList = async () => {
        try {
            const resData = await axiosInstance.get('/fruits/all')
            if (resData.data) {
                const tabFruitsList = resData.data.map(fruit => fruit.fruit_name);
                setFruits(tabFruitsList);
                setClassifyChartTab((prev) => ({...prev, fruit: tabFruitsList[0]}))
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            console.log('Lỗi khi tải danh sách trái cây: ', error)

            toast({
                title: "Tải danh sách trái cây thất bại",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    const fetchSeriesForClassifyDataChart = async (fruit: string, timeFrame: string) => {
        try {
            const resData = await axiosInstance.get(`/statistical/classify-chart?fruit=${fruit}&time_frame=${timeFrame}`)
            if (resData.data) {
                setClassifyChartData({
                    series: resData.data.series,
                    categories: resData.data.categories,
                })
            }
        } catch (error) {
            const errorMessage = handleAxiosError(error);
            console.log('Lỗi khi tải dữ liệu cho biểu đồ thống kê kết quả phân loại: ', error)

            toast({
                title: "Tải dữ liệu biểu đồ thống kê kết quả phân loại thất bại",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        fetchCardDashboardData()
        fetchFruitsList()
    }, [])

    useEffect(() => {
        fetchSeriesForClassifyDataChart(classifyChartTab.fruit, classifyChartTab.timeFrame)
    }, [classifyChartTab])

    useSocketFruitClassify((newResult: ClassifyResultInterface) => {
        if (newResult.fruit === classifyChartTab.fruit) {
            setCardData(prev => ({
                ...prev,
                amountResults: prev.amountResults + 1,
            }))

            fetchSeriesForClassifyDataChart(classifyChartTab.fruit, classifyChartTab.timeFrame)
        }
    });

    return (
        <div className='grid grid-cols-12 gap-4 md:gap-6'>
            <div className="col-span-12 space-y-6">
                <div className="grid grid-cols-4 gap-4 md:gap-4">
                    {
                        dashboardCartItems.slice(0, 4).map((item, index) => (
                            <DashboardCard
                                key={index}
                                item={item}
                                className={item.className}
                                disableAnimation={item.disableAnimation}
                            />
                        ))
                    }
                </div>

                <div className="grid grid-cols-4 gap-4 md:gap-4">
                    {
                        dashboardCartItems.slice(4, 8).map((item, index) => (
                            <DashboardCard
                                key={index}
                                item={item}
                                className={item.className}
                                disableAnimation={item.disableAnimation}
                            />
                        ))
                    }
                </div>
            </div>

            <div className="col-span-12">
                <ClassifyResultsChart
                    series={classifyChartData.series ?? []}
                    categories={classifyChartData.categories}
                    chartTabs1={fruits}
                    chartTabs2={['Tuần', 'Tháng']}
                    defaultTab1={0}
                    defaultTab2={0}
                    onChartTab1Selected={(optionSelected) => onUpdateClassifyChartTabSelect(optionSelected, 'fruit')}
                    onChartTab2Selected={(optionSelected) => onUpdateClassifyChartTabSelect(optionSelected, 'timeFrame')}
                />
            </div>
        </div>
    );
}