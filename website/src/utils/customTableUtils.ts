import { CustomTableColumn } from "@/interfaces/table"
import {Gender} from "@/enums";

export const renderCellValues = (col: CustomTableColumn, value: any): string => {
    if (col.valueMapping) {
        const key = value.toString()
        return col.valueMapping[key] || value.toString()
    }

    switch (col.type) {
        case "boolean":
            return value ? "Có" : "Không";
        case "date":
            return value ? (new Date(value).toLocaleTimeString("vi-VN") + ' ' + new Date(value).toLocaleDateString("vi-VN")) : "-";
        case "number":
            return value !== undefined && value !== null ? value.toString() : "-";
        case "gender":
            switch (parseInt(value)) {
                case Gender.Male: return "Nam";
                case Gender.Female: return "Nữ";
                case Gender.Other: return "Khác";
                default: return "Không xác định";
            }
        case "string":
        default:
            return value || "-";
    }
}