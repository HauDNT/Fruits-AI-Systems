"use client";

import React, { useEffect } from "react";
import { useThemeSelector, useThemeDispatch } from "@/hooks/useTheme";
import { initializeTheme } from "@/redux/themeSlice";

export const ThemeReduxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useThemeDispatch()
    const { theme, isInitialized } = useThemeSelector((state) => state.theme)

    // Lấy theme state từ localStorage khi load lần đầu
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const initialTheme = savedTheme || "light";
        dispatch(initializeTheme(initialTheme));
    }, [dispatch]);

    // Update localStorage & class khi theme thay đổi
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("theme", theme);
            if (theme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, [theme, isInitialized]);

    return <>{children}</>;
}