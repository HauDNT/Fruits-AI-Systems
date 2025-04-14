import { Theme} from "@/types";
import React from "react";

// Authen
export interface LoginResponseInterface {
    userId: string,
    username: string,
    accessToken: string,
}

// Redux
interface ReduxUserState {
    userId: string,
    username: string,
}

export interface ReduxAuthState {
    user: ReduxUserState | null,
    token: string | null,
}

// Reset password forms steps
export interface StepResetForm {
    id: string | number,
    name: string,
    fieldsName: string[],
}

// Theme
export interface ThemeState {
    theme: Theme;
    isInitialized: boolean;
}

// Form
export interface FormInterface {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    className?: string;
    onClose: () => void;
}

// Model layer
export interface ModelLayerInterface {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    maxWidth?: string;
}

export interface SearchbarInterface {
    placeholder?: string;
    onSearch: (query: string, searchFields?: string[]) => void;
    debounceTime?: number;
}