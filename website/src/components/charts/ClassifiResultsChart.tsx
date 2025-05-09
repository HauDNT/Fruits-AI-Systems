"use client";
import React from "react";
import {ApexOptions} from "apexcharts";
import ChartTab from "@/components/common/ChartTab";
import dynamic from "next/dynamic";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

interface ClassifiResultsChartSeriesInterface {
    name: string,
    data: number[],
}

interface ClassifiResultsChartInterface {
    chartName?: string,
    series: ClassifiResultsChartSeriesInterface[],
}

export default function ClassifiResultsChart({
    chartName = 'Kết quả phân loại trái cây',
    series,
}: ClassifiResultsChartInterface) {
    const options: ApexOptions = {
        legend: {
            show: false, // Hide legend
            position: "top",
            horizontalAlign: "left",
        },
        colors: ["#57aef6", "#ff6b6b"], // Define line colors
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "line", // Set the chart type to 'line'
            toolbar: {
                show: false, // Hide chart toolbar
            },
        },
        stroke: {
            curve: "straight", // Define the line style (straight, smooth, or step)
            width: [2, 2], // Line width for each dataset
        },

        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0, // Size of the marker points
            strokeColors: "#fff", // Marker border color
            strokeWidth: 2,
            hover: {
                size: 6, // Marker size on hover
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false, // Hide grid lines on x-axis
                },
            },
            yaxis: {
                lines: {
                    show: true, // Show grid lines on y-axis
                },
            },
        },
        dataLabels: {
            enabled: false, // Disable data labels
        },
        tooltip: {
            enabled: true, // Enable tooltip
            x: {
                format: "dd MMM yyyy", // Format for x-axis tooltip
            },
        },
        xaxis: {
            type: "category", // Category-based x-axis
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            axisBorder: {
                show: false, // Hide x-axis border
            },
            axisTicks: {
                show: false, // Hide x-axis ticks
            },
            tooltip: {
                enabled: false, // Disable tooltip for x-axis points
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px", // Adjust font size for y-axis labels
                    colors: ["#6B7280"], // Color of the labels
                },
            },
            title: {
                text: "", // Remove y-axis title
                style: {
                    fontSize: "0px",
                },
            },
        },
    };

    return (
        series.length > 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                    <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            { chartName }
                        </h3>
                    </div>
                    <div className="flex items-start w-full gap-3 sm:justify-end">
                        <ChartTab
                            options = {['Táo', 'Nho', 'Lê']}
                            onTabClicked={(optionSelected) => console.log(optionSelected)}
                        />
                        <ChartTab
                            options = {['Ngày', 'Tuần', 'Tháng']}
                            onTabClicked={(optionSelected) => console.log(optionSelected)}
                        />
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1000px] xl:min-w-full">
                        <ReactApexChart
                            options={options}
                            series={series}
                            type="area"
                            height={310}
                        />
                    </div>
                </div>
            </div>
        ) : (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                    <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            { chartName }
                        </h3>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1000px] xl:min-w-full">
                        Không có dữ liệu
                    </div>
                </div>
            </div>
        )
    );
}
