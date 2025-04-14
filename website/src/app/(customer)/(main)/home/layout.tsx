import React from 'react'
import AppSidebar from "@/layout/AppSidebar";
import {AdminSidebarItems} from "@/layout/AppSidebarItems";
import ContentPage from "@/app/admin/(main)/content";

export default function HomeLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen xl:flex">
            {/* Sidebar */}
            <AppSidebar navItems={AdminSidebarItems} sidebarType={'admin'}/>
            {/* Main Content Area */}
            <ContentPage>
                {children}
            </ContentPage>
        </div>
    )
}
