import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type SidebarState = {
    isExpanded: boolean,
    isMobile: boolean,
    isMobileOpen: boolean,
    isHovered: boolean,
    activeItem: string | null,
    openMenu: string | null,
}

const initialState: SidebarState = {
    isExpanded: true,
    isMobile: false,
    isMobileOpen: false,
    isHovered: false,
    activeItem: null,
    openMenu: null,
}

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isExpanded = !state.isExpanded
        },
        toggleMobileSidebar: (state) => {
            state.isMobileOpen = !state.isMobileOpen
        },
        setIsMobile: (state, action: PayloadAction<boolean>) => {
            state.isMobile = action.payload
        },
        setIsHovered: (state, action: PayloadAction<boolean>) => {
            state.isHovered = action.payload
        },
        setActiveItem: (state, action: PayloadAction<string | null>) => {
            state.activeItem = action.payload
        },
        toggleSubmenu: (state, action: PayloadAction<string>) => {
            state.openMenu = state.openMenu === action.payload ? null : action.payload
        },
    },
})

export const {
    toggleSidebar,
    toggleMobileSidebar,
    setIsMobile,
    setIsHovered,
    setActiveItem,
    toggleSubmenu,
} = sidebarSlice.actions

export default sidebarSlice.reducer