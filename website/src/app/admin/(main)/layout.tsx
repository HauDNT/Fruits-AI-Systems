import React from "react";
import ContentPage from "@/app/admin/(main)/content";
import AppSidebar from "@/layout/AppSidebar";

export default function AdminLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main>
            <div className="min-h-screen xl:flex bg-white dark:bg-gray-900">
                {/* Sidebar */}
                <AppSidebar/>
                {/* Main Content Area */}
                <ContentPage>
                    {children}
                </ContentPage>
            </div>
        </main>
    );
}