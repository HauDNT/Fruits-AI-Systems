import React from "react";

interface ComponentCardProps {
    title: string;
    actionBar?: React.ReactNode;
    children: React.ReactNode;
    className?: string; // Additional custom classes for styling
    desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
    title,
    actionBar,
    children,
    className = "",
}) => {
    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
        >
            {/* Card Header */}
            <div className={`w-100 px-6 py-5 flex items-center place-content-between `}>
                <h3 className={`text-base font-medium text-gray-800 dark:text-white/90`}>
                    {title}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {actionBar}
                </span>
            </div>

            {/* Card Body */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                <div className="space-y-6">{children}</div>
            </div>
        </div>
    );
};

export default ComponentCard;
