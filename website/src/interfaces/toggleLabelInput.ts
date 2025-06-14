import { ToggleLabelInputFieldType, ToggleLabelInputOptionsDataType } from "@/types";

export interface ToggleLabelInputInterface {
    fieldState: boolean;
    fieldName: string;
    fieldValue: string | number;
    fieldType: ToggleLabelInputFieldType;
    optionPlaceHolder?: string;
    dataForOptions?: ToggleLabelInputOptionsDataType[];
    onFieldChange: (item: any) => void;
}