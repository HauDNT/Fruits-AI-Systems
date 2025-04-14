import {UserCircleIcon} from "@/assets/icons"
import DashboardCard from "@/components/cards/DashboardCard"
import MonthlyTargetChart from "@/components/charts/MonthlyTargetChart";
import MonthlyAccountCreatedChart from "@/components/charts/MonthlyAccountCreatedChart";
import StatisticsChart from "@/components/charts/StatisticsChart";

export default function AdminDashboard() {
    return (
        <div className='grid grid-cols-12 gap-4 md:gap-6'>
            <div className="col-span-12 space-y-6 xl:col-span-7">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                    <DashboardCard
                        item={{
                            name: "Nhân viên",
                            number: 1000,
                            icon: UserCircleIcon,
                            upOrDown: true,
                            diffRatio: 11.31,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "Khu",
                            number: 1000,
                            icon: UserCircleIcon,
                            upOrDown: false,
                            diffRatio: 12.53,
                        }}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                    <DashboardCard
                        item={{
                            name: "Lô trái cây",
                            number: 1000,
                            icon: UserCircleIcon,
                            upOrDown: true,
                            diffRatio: 11.31,
                        }}
                    />
                    <DashboardCard
                        item={{
                            name: "???",
                            number: 1000,
                            icon: UserCircleIcon,
                            upOrDown: false,
                            diffRatio: 12.53,
                        }}
                    />
                </div>
            </div>

            <div className="col-span-12 xl:col-span-5">
                <MonthlyTargetChart/>
            </div>

            <div className="col-span-12">
                <MonthlyAccountCreatedChart/>
            </div>

            <div className="col-span-12">
                <StatisticsChart/>
            </div>
        </div>
    );
}