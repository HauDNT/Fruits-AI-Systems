import { CustomTableColumn } from "@/interfaces/table"

export const renderCellValues = (col: CustomTableColumn, value: any): string => {
    // Nếu có Value Mapping trong dữ liệu trả về thì ưu tiên sử dụng
    if (col.valueMapping) {
        const key = value.toString()
        return col.valueMapping[key] || value.toString()
    }

    switch (col.type) {
        case "boolean":
            return value ? "Có" : "Không";
        case "date":
            return value ? new Date(value).toLocaleDateString("vi-VN") : "-";
        case "number":
            return value !== undefined && value !== null ? value.toString() : "-";
        case "string":
        default:
            return value || "-";
    }
}