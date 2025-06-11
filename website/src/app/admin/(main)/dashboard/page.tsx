"use client";
import {
    Apple, Cpu, Users, HeartPulse, ScanEye,
    Computer, Zap, UserCircle,
} from "lucide-react";
import {useSocketFruitClassify} from "@/hooks/useSocketFruitClassify";
import {useDashboardData, TIME_FRAMES} from "@/hooks/useDashboardData";
import DashboardCard from "@/components/cards/DashboardCard";
import ClassifyResultsChart from "@/components/charts/ClassifyResultsChart";
import {ClassifyResultInterface} from "@/interfaces";
import MonthlySalesChart from "@/components/charts/EmployeesEachAreaChart";
import PieChartFruitDistribution from "@/components/charts/PieChartFruitDistribution";
import { DashboardCardItem } from "@/types";

export default function AdminDashboard() {
    const {
        cardData, fruits, ratioFruits, employeesEachArea,
        chartData, classifyChartTab, onSelectTab, setCardData,
        onUpdateEventSocketListener,
    } = useDashboardData();

    const cardItems: DashboardCardItem[] = [
        {name: "Tài khoản", number: cardData.amountAccounts, icon: UserCircle, disableAnimation: false},
        {name: "Loại trái cây", number: cardData.amountFruits, icon: Apple, disableAnimation: false},
        {
            name: "Số lượng đã phân loại",
            number: cardData.amountResults,
            icon: ScanEye,
            disableAnimation: true,
            className: "border-[3px] border-blue-500 p-5 dark:border-yellow-300"
        },
        {name: "Thiết bị", number: cardData.amountDevices, icon: Cpu, disableAnimation: false},
        {name: "Nhân viên", number: cardData.amountEmployees, icon: Users, disableAnimation: false},
        {name: "Tình trạng trái cây", number: cardData.amountFruitTypes, icon: HeartPulse, disableAnimation: false},
        {name: "Khu vực", number: cardData.amountAreas, icon: Computer, disableAnimation: false},
        {name: "Loại thiết bị", number: cardData.amountDeviceTypes, icon: Zap, disableAnimation: false},
    ];

    useSocketFruitClassify( async (newResult: ClassifyResultInterface) => {
        if (newResult.fruit === classifyChartTab.fruit) {
            setCardData(prev => ({...prev, amountResults: prev.amountResults + 1}));
            await onUpdateEventSocketListener();
        }
    });

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6">
                {[0, 4].map(i => (
                    <div key={i} className="grid grid-cols-4 gap-4 md:gap-4">
                        {cardItems.slice(i, i + 4).map((item, index) => (
                            <DashboardCard key={index} item={item} />
                        ))}
                    </div>
                ))}
            </div>

            <div className="col-span-12 space-y-6">
                {classifyChartTab.fruit && (
                    <ClassifyResultsChart
                        series={chartData.series}
                        categories={chartData.categories}
                        chartTabs1={fruits}
                        chartTabs2={TIME_FRAMES}
                        defaultTab1={0}
                        defaultTab2={0}
                        onChartTab1Selected={(val) => onSelectTab(val, "fruit")}
                        onChartTab2Selected={(val) => onSelectTab(val, "timeFrame")}
                    />
                )}
            </div>

            {
                employeesEachArea ? (
                    <div className="col-span-8 space-y-6">
                        <MonthlySalesChart
                            chartName={'Số lượng nhân viên tại các khu'}
                            data={employeesEachArea}
                        />
                    </div>
                ) : (
                    <div className="col-span-8 space-y-6">
                        Không tải được dữ liệu nhân viên tại các khu phân loại
                    </div>
                )
            }

            {
                ratioFruits ? (
                    <div className="col-span-4 space-y-6">
                        <PieChartFruitDistribution
                            chartName={"Tỉ lệ các loại trái cây"}
                            data={ratioFruits}/>
                    </div>
                ) : (
                    <div className="col-span-4 space-y-6">
                        Không tải được dữ liệu phân bổ các loại trái cây
                    </div>
                )
            }
        </div>
    );
}
