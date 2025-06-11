import React, {useState} from "react";
import {ChartTabInterface} from "@/interfaces";

const ChartTab = ({
    options = [],
    defaultOptions,
    onTabClicked,
}: ChartTabInterface) => {
    const [selected, setSelected] = useState(options[defaultOptions]);

    const getButtonClass = (option: string) =>
        selected === option
            ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
            : "text-gray-500 dark:text-gray-400";

    const handleSelectOption = async (option: string) => {
        setSelected(option);
        onTabClicked?.(option);
    }

    return (
        <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            {
                options.length > 0 ? (
                    options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelectOption(option)}
                            className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
                                option
                            )}`}
                        >
                            {option}
                        </button>
                    ))
                ) : 'Không có tuỳ chọn'
            }
        </div>
    );
};

export default ChartTab;
