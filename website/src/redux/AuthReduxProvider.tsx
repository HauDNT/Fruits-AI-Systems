"use client"
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getCookie} from '@/utils/cookieManage'
import {setReduxAuthToken} from '@/redux/authSlice'

export const AuthReduxProvider: React.FC = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        Promise
            .all([
                getCookie('eduflexhub-authentication'),
            ])
            .then((values) => {
                if (values.length > 0 && values[0]?.value) {
                    let valueParse;

                    if (values.length > 0 && values[0]?.value) {
                        valueParse = JSON.parse(values[0]?.value ?? 'Not found token');
                    }

                    if (valueParse) {
                        dispatch(setReduxAuthToken(valueParse))
                    }
                }
            })
    }, [dispatch])

    return <></>
}