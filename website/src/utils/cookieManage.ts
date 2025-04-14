'use server'
import { cookies } from "next/headers";

export const setCookie = async (name: string, value: any, options = {}) => {
    const cookieStore = cookies();

    cookieStore.set({
        name: name,
        value: value,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
        ...options,
    });
}

export const getCookie = async (name: string) => {
    const cookieStore = cookies();
    return cookieStore.get(name);
}

const checkExistCookie = async (name: string) => { }