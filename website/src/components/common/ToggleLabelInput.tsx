'use client'
import React, { useEffect, useState } from 'react'
import { ToggleLabelInputInterface } from "@/interfaces";
import InputField from "@/components/inputs/InputField";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const ToggleLabelInput = ({
    fieldState = false,
    fieldName,
    fieldValue,
    fieldType,
    optionPlaceHolder = 'Chọn',
    dataForOptions,
    onFieldChange,
}: ToggleLabelInputInterface) => {
    const [state, setState] = useState(fieldState);
    const selectedOption = dataForOptions?.find(option => String(option.value) === String(fieldValue));

    useEffect(() => {
        setState(fieldState);
    }, [fieldState]);

    return (
        <>
            {state ? (
                fieldType === 'input' ? (
                    <InputField
                        name={fieldName}
                        type={typeof fieldValue}
                        defaultValue={dataForOptions?.length > 0 ? selectedOption?.label || fieldValue : fieldValue}
                        onChange={(e) => onFieldChange(e.target.value)}
                    />
                ) : fieldType === 'options' ? (
                    <Select
                        onValueChange={(value) => onFieldChange(value)}
                        defaultValue={selectedOption ? selectedOption.value : undefined}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={optionPlaceHolder} />
                        </SelectTrigger>
                        <SelectContent>
                            {dataForOptions?.map((item, index) => (
                                <SelectItem key={index} value={item.value}>
                                    <div className="flex justify-between w-full text-left cursor-pointer">
                                        <span className="w-[130px] truncate">{item.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : null
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {dataForOptions?.length > 0 ? selectedOption?.label || fieldValue : fieldValue}
                </p>
            )}
        </>
    );
};

export default ToggleLabelInput;