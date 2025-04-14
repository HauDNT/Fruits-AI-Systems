"use client"
import {Provider} from 'react-redux'
import store from '@/redux/store'
import React from 'react'
import {ThemeReduxProvider} from "@/redux/ThemeReduxProvider";
import {AuthReduxProvider} from "@/redux/AuthReduxProvider";

const RootReduxProvider = ({children}: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <AuthReduxProvider/>
            <ThemeReduxProvider>
                {children}
            </ThemeReduxProvider>
        </Provider>
    )
}

export default RootReduxProvider