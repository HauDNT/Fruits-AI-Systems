'use client'

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import React from "react";
import AppHeader from "@/layout/AppHeader";

export default function ContentPage({children}: { children: React.ReactNode }) {
    const { isExpanded, isHovered, isMobileOpen } = useSelector((state: RootState) => state.sidebar)

    const mainContentMargin = isMobileOpen
        ? "ml-0"
        : isExpanded || isHovered
            ? "lg:ml-[290px]"
            : "lg:ml-[90px]";

    return (
        <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
            <AppHeader/>
            <div className="p-4 mx-auto max-w-screen-2xl md:p-6 bg-gray-50 dark:bg-gray-900">
                {children}
            </div>
        </div>
    )
}