import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {ThemeState} from "@/interfaces"
import {Theme} from "@/types";

const initialState: ThemeState = {
    theme: 'light',
    isInitialized: false,
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        initializeTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
            state.isInitialized = true;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === "light" ? "dark" : "light"
        }
    }
})

export const { initializeTheme, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;