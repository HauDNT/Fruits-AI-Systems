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
import PieChartFruitDistribution from "@/components/charts/PieChartFruitDistribution";

export default function AdminDashboard() {
    const {
        cardData, fruits, ratioFruits, chartData,
        classifyChartTab, onSelectTab, setCardData,
    } = useDashboardData();

    const cardItems = [
        {name: "Tài khoản", number: cardData.amountAccounts, icon: UserCircle},
        {name: "Loại trái cây", number: cardData.amountFruits, icon: Apple},
        {
            name: "Số lượng đã phân loại", number: cardData.amountResults, icon: ScanEye,
            className: "border-[3px] border-blue-500 p-5 dark:border-yellow-300"
        },
        {name: "Thiết bị", number: cardData.amountDevices, icon: Cpu},
        {name: "Nhân viên", number: cardData.amountEmployees, icon: Users},
        {name: "Tình trạng trái cây", number: cardData.amountFruitTypes, icon: HeartPulse},
        {name: "Khu vực", number: cardData.amountAreas, icon: Computer},
        {name: "Loại thiết bị", number: cardData.amountDeviceTypes, icon: Zap},
    ];

    useSocketFruitClassify((newResult: ClassifyResultInterface) => {
        if (newResult.fruit === classifyChartTab.fruit) {
            setCardData(prev => ({...prev, amountResults: prev.amountResults + 1}));
        }
    });

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6">
                {[0, 4].map(i => (
                    <div key={i} className="grid grid-cols-4 gap-4 md:gap-4">
                        {cardItems.slice(i, i + 4).map((item, idx) => (
                            <DashboardCard key={idx} item={item} className={item.className} />
                        ))}
                    </div>
                ))}
            </div>

            <div className="col-span-8">
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
                ratioFruits ? (
                    <div className="col-span-4">
                        <PieChartFruitDistribution
                            chartName={"Tỉ lệ các loại trái cây"}
                            data={ratioFruits}/>
                    </div>
                ) : (
                    <div className="col-span-4">
                        Không tải được dữ liệu phân bổ các loại trái cây
                    </div>
                )
            }
        </div>
    );
}
