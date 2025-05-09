"use client"
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
import ClassifiResultsChart from "@/components/charts/ClassifiResultsChart";
import {useEffect, useState} from "react";
import axiosInstance, {handleAxiosError} from "@/utils/axiosInstance";
import {useToast} from "@/hooks/use-toast";

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
        } catch (e) {
            const errorMessage = handleAxiosError(error);
            console.log('Lỗi khi tải dữ liệu card dashboard: ', error)

            toast({
                title: "Tải dữ liệu card dashboard thất bại",
                description: errorMessage,
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        fetchCardDashboardData()
    }, [])

    return (
        <div className='grid grid-cols-12 gap-4 md:gap-6'>
            <div className="col-span-12 space-y-6">
                <div className="grid grid-cols-4 gap-4 md:gap-4">
                    <DashboardCard
                        item={{
                            name: "Tài khoản",
                            number: cardData.amountAccounts ?? 0,
                            icon: UserCircle,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "Loại trái cây",
                            number: cardData.amountFruits ?? 0,
                            icon: Apple,
                        }}
                    />
                    <DashboardCard
                        className="border-[3px] border-blue-500 p-5 dark:border-yellow-300"
                        item={{
                            name: "Số lượng đã phân loại",
                            number: cardData.amountResults ?? 0,
                            icon: ScanEye,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "Thiết bị",
                            number: cardData.amountDevices ?? 0,
                            icon: Cpu,
                        }}
                    />
                </div>

                <div className="grid grid-cols-4 gap-4 md:gap-4">
                    <DashboardCard
                        item={{
                            name: "Nhân viên",
                            number: cardData.amountEmployees ?? 0,
                            icon: Users,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "Tình trạng trái cây",
                            number: cardData.amountFruitTypes ?? 0,
                            icon: HeartPulse,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "Khu vực",
                            number: cardData.amountAreas ?? 0,
                            icon: Computer,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "Loại thiết bị",
                            number: cardData.amountDeviceTypes ?? 0,
                            icon: Zap,
                        }}
                    />
                </div>
            </div>

            {/*<div className="col-span-12 xl:col-span-5">*/}
            {/*    <MonthlyTargetChart/>*/}
            {/*</div>*/}

            {/*<div className="col-span-12">*/}
            {/*    <MonthlyAccountCreatedChart/>*/}
            {/*</div>*/}

            <div className="col-span-12">
                <ClassifiResultsChart
                    series={
                        [
                            {
                                name: "Táo chín",
                                data: [168, 450, 201, 298, 187, 550, 291, 110, 215, 390, 280, 120],
                            },
                            {
                                name: "Táo thối",
                                data: [68, 90, 101, 198, 57, 50, 35, 20, 25, 39, 20, 20],
                            },
                        ]
                    }
                />
            </div>
        </div>
    );
}