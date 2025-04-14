import React from "react";

export default function AppSidebarWidget() {
    return (
        <div
            className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center text-xl dark:bg-white/[0.03]`}
        >
            <h1 className="mb-2 font-semibold text-gray-900 dark:text-white">
                <span className="text-blue-600">Edu</span>FlexHub
            </h1>
            <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
                Hơn 1000+ khoá học đang chờ bạn khám phá trong tính năng  <span className="font-bold">PRO</span>
            </p>
            <a
                href="https://tailadmin.com/pricing"
                target="_blank"
                rel="nofollow"
                className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
            >
                Tìm hiểu thêm
            </a>
        </div>
    );
}
