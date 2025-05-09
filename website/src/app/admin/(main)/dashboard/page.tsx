import {UserCircleIcon} from "@/assets/icons"
import DashboardCard from "@/components/cards/DashboardCard"
import MonthlyTargetChart from "@/components/charts/MonthlyTargetChart";
import MonthlyAccountCreatedChart from "@/components/charts/MonthlyAccountCreatedChart";
import StatisticsChart from "@/components/charts/StatisticsChart";
import ClassifiResultsChart from "@/components/charts/ClassifiResultsChart";

export default function AdminDashboard() {







    return (
        <div className='grid grid-cols-12 gap-4 md:gap-6'>
            <div className="col-span-12 space-y-6">
                <div className="grid grid-cols-4 gap-4 md:gap-4">
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
                    <DashboardCard
                        item={{
                            name: "Khu",
                            number: 1000,
                            icon: UserCircleIcon,
                            upOrDown: false,
                            diffRatio: 12.53,
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