"use client";
import InputField from "@/components/inputs/InputField"
import CustomButton from "@/components/buttons/CustomButton"
import {
    ChevronLeftIcon,
    EyeIcon,
    EyeClosedIcon
} from 'lucide-react'
import Link from "next/link";
import React, {useState} from "react";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon/>
                    Trở lại landing page
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Đăng nhập
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Nhập tên tài khoản và mật khẩu để truy cập trang quản trị
                        </p>
                    </div>
                    <div>
                        <form>
                            <div className="space-y-6">
                                <div>
                                    <p>
                                        Email <span className="text-error-500">*</span>{" "}
                                    </p>
                                    <InputField placeholder="info@gmail.com" type="email"/>
                                </div>
                                <div>
                                    <p>
                                        Password <span className="text-error-500">*</span>{" "}
                                    </p>
                                    <div className="relative">
                                        <InputField
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                          {showPassword ? (
                                              <EyeIcon className="fill-gray-500 dark:fill-gray-400"/>
                                          ) : (
                                              <EyeClosedIcon className="fill-gray-500 dark:fill-gray-400"/>
                                          )}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <CustomButton className="w-full" size="sm">
                                        Đăng nhập
                                    </CustomButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm