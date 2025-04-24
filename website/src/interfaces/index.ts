import {Theme} from "@/types";
import React from "react";

// Authen
export interface LoginResponseInterface {
    userId: string,
    username: string,
    accessToken: string,
}

// Redux
export interface ReduxUserState {
    userId: string;
    username: string;
    email?: string;
    role?: number;
}

export interface ReduxAuthState {
    user: ReduxUserState | null;
    token: string | null;
}

// Reset password forms steps
export interface StepResetForm {
    id: string | number;
    name: string;
    fieldsName: string[];
}

// Theme
export interface ThemeState {
    theme: Theme;
    isInitialized: boolean;
}

// Form
export interface FormInterface {
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean>;
    className?: string;
    onClose?: () => void;
}

// Model layer
export interface ModelLayerInterface {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    maxWidth?: string;
}

// Search bar
export interface SearchbarInterface {
    placeholder?: string;
    onSearch: (query: string, searchFields?: string[]) => void;
    debounceTime?: number;
}

// List check
export interface ListCheckInterface<T> {
    title?: string;
    data: T[];
    onCheck?: (itemsChecked: number[]) => void;
}