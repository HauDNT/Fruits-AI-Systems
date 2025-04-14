import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/redux/store"

export const useThemeDispatch = () => useDispatch<AppDispatch>();
export const useThemeSelector: TypedUseSelectorHook<RootState> = useSelector;