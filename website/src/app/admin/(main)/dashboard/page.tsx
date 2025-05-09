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

export default function AdminDashboard() {







    return (
        <div className='grid grid-cols-12 gap-4 md:gap-6'>
            <div className="col-span-12 space-y-6">
                <div className="grid grid-cols-4 gap-4 md:gap-4">
                    <DashboardCard
                        item={{
                            name: "Tài khoản",
                            number: 5,
                            icon: UserCircle,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "Loại trái cây",
                            number: 4,
                            icon: Apple,
                        }}
                    />
                    <DashboardCard
                        className="border-[3px] border-blue-500 p-5 dark:border-yellow-300"
                        item={{
                            name: "Số lượng đã phân loại",
                            number: 4,
                            icon: ScanEye,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "Thiết bị",
                            number: 18,
                            icon: Cpu,
                        }}
                    />
                </div>

                <div className="grid grid-cols-4 gap-4 md:gap-4">
                    <DashboardCard
                        item={{
                            name: "Nhân viên",
                            number: 10,
                            icon: Users,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "Tình trạng trái cây",
                            number: 4,
                            icon: HeartPulse,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "Khu vực",
                            number: 4,
                            icon: Computer,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "Trạng thái thiết bị",
                            number: 2,
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