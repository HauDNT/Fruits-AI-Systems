import React from "react";
import LandingPageHeader from "@/app/(customer)/landing/components/header";
import LandingPageFooter from "@/app/(customer)/landing/components/footer";

export default function LadingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <LandingPageHeader/>
            { children }
            <LandingPageFooter/>
        </main>
    )
}