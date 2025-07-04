"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

interface FruitDistribution {
    fruit: string;
    count: number;
}

interface Props {
    chartName: string;
    data: FruitDistribution[];
}

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

export default function PieChartFruitDistribution({ chartName, data }: Props) {
    const labels = data.map(item => item.fruit);
    const series = data.map(item => Number(item.count ?? 0));
    const options: ApexOptions = {
        chart: {
            type: "pie",
        },
        labels: labels,
        colors: ["#FF4D4F", "#1890FF", "#FADB14"], // Cập nhật tông màu
        legend: {
            position: "bottom",
        },
        tooltip: {
            y: {
                formatter: (val: number) => val.toString(),
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
        plotOptions: {
            pie: {},
        },
        noData: {
            text: "Không có dữ liệu",
            align: "center",
            verticalAlign: "middle",
            style: {
                color: '#ccc',
                fontSize: '14px',
            }
        }
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        {chartName}
                    </h3>
                </div>
            </div>
            <Chart options={options} series={series} type="pie" height={350} />
        </div>
    );
}