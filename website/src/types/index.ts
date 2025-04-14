import React from "react";

export type SidebarType = 'Admin' | 'Student' | 'Teacher';

export type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export type Theme = "light" | "dark";

export type DashboardCardItem = {
    name: string;
    number: number;
    icon: React.ReactNode;
    upOrDown: boolean;
    diffRatio: number;
}
