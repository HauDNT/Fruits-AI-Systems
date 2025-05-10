import React from "react"
import CountUp from 'react-countup'
import {DashboardCardItem} from "@/types";

const DashboardCard: React.FC<{
    item: DashboardCardItem,
    className: string,
    disableAnimation: boolean,
}> = ({item, className = '', disableAnimation= false}) => {
    const Icon = item.icon;

    return (
        <>
            <div className={`rounded-2xl border bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 ${className}`}>
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <Icon className="text-gray-800 size-6 dark:text-white/90"/>
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {item.name}
            </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {
                                disableAnimation ? (
                                    <>{item.number}</>
                                ) : (
                                    <CountUp end={item.number} duration={3} />
                                )
                            }
                        </h4>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardCard