"use client";
import React from "react";
import {ApexOptions} from "apexcharts";
import ChartTab from "@/components/common/ChartTab";
import dynamic from "next/dynamic";

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
    categories: any[],
    defaultTab1: number,
    defaultTab2: number,
    chartTabs1: string[],
    chartTabs2: string[],
    onChartTab1Selected?: (option: string) => void,
    onChartTab2Selected?: (option: string) => void,
}

export default function ClassifyResultsChart({
    chartName = 'Kết quả phân loại trái cây',
    series,
    categories = [],
    defaultTab1,
    defaultTab2,
    chartTabs1,
    chartTabs2,
    onChartTab1Selected,
    onChartTab2Selected,
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
            curve: "smooth", // Define the line style (straight, smooth, or step)
            width: [1, 1], // Line width for each dataset
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
            categories: categories,
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
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        { chartName }
                    </h3>
                </div>
                <div className="flex items-start w-full gap-3 sm:justify-end">
                    <ChartTab
                        defaultOptions={defaultTab1}
                        options = {chartTabs1}
                        onTabClicked={(optionSelected) => onChartTab1Selected?.(optionSelected)}
                    />
                    <ChartTab
                        defaultOptions={defaultTab2}
                        options = {chartTabs2}
                        onTabClicked={(optionSelected) => onChartTab2Selected?.(optionSelected)}
                    />
                </div>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[1000px] xl:min-w-full">
                    {
                        series.length > 0 ? (
                            <ReactApexChart
                                options={options}
                                series={series}
                                type="area"
                                height={310}
                            />
                        ) : (
                            <span>Không có dữ liệu</span>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
