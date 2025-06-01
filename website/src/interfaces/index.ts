import {Theme, ToggleLabelInputFieldType, ToggleLabelInputOptionsDataType} from "@/types";
import React from "react";

// Authen
export interface LoginResponseInterface {
    userId: string,
    username: string,
    accessToken: string,
}

// Redux for auth
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


// Toggle label input
export interface ToggleLabelInputInterface {
    fieldState: boolean;
    fieldName: string;
    fieldValue: string | number;
    fieldType: ToggleLabelInputFieldType;
    optionPlaceHolder?: string;
    dataForOptions?: ToggleLabelInputOptionsDataType[];
    onFieldChange: () => void;
}

// Classify result
export interface ClassifyResultInterface {
    confidence_level: number;
    image_url: string;
    area: string;
    fruit: string;
    fruitType: string;
    created_at: string;
}

// Chart tab
export interface ChartTabInterface {
    options: string[];
    defaultOptions: number;
    onTabClicked?: (option: string) => void;
}

// Employee detail
export interface EmployeeDetailInterface {
    id: number;
    employee_code: string;
    fullname: string;
    gender: number;
    phone_number: string;
    avatar_url: string;
    created_at: string;
    updated_at: string;
}

// User info props
export interface UserInfo {
    id: number;
    username: string;
    created_at: string;
    updated_at: string;
}