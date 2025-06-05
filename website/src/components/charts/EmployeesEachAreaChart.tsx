"use client";
import {ApexOptions} from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

interface EmployeeEachAreaData {
    area_name: string;
    count: number;
}

interface EmployeeEachAreaChart {
    chartName: string;
    data: EmployeeEachAreaData[];
}

export default function MonthlySalesChart({ chartName, data }: EmployeeEachAreaChart) {
    const categories = data.map(item => item.area_name)
    const employeesAmount = data.map(item => +item.count)
    const options: ApexOptions = {
        colors: ["#465fff", "#FADB14"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "bar",
            height: 350,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "39%",
                borderRadius: 5,
                borderRadiusApplication: "end",
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 4,
            colors: ["transparent"],
        },
        xaxis: {
            categories: categories,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
            fontFamily: "Outfit",
        },
        yaxis: {
            title: {
                text: undefined,
            },
        },
        grid: {
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        fill: {
            opacity: 1,
        },

        tooltip: {
            x: {
                show: false,
            },
            y: {
                formatter: (val: number) => `${val}`,
            },
        },
    };
    const series = [
        {
            name: "Số lượng nhân viên",
            data: employeesAmount,
        },
    ];

    return (
        <div
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    { chartName }
                </h3>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="bar"
                        height={377}
                    />
                </div>
            </div>
        </div>
    );
}
