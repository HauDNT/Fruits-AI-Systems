import React from "react";
import {FaCirclePlus, FaTrash} from "react-icons/fa6";
import {FaTrashRestoreAlt} from "react-icons/fa";

type ActionButtonType = 'Create' | 'Delete' | 'Restore'

interface ActionButtonProps {
    action: ActionButtonType;
    icon?: React.ReactNode;
    handleAction?: () => void;
    classNames?: string;
}

export default function ActionButton({
    action,
    icon = <FaCirclePlus size={20} color={'#ffffff'}/>,
    handleAction,
    classNames = '',
}: ActionButtonProps) {
    let className = classNames;

    switch (action) {
        case "Create":
            className += 'bg-green-500 dark:border-white/[0.05] '
            icon = <FaCirclePlus size={20} color={'#ffffff'}/>
            break
        case "Delete":
            className += 'bg-red-400 dark:border-white/[0.05] '
            icon = <FaTrash size={20} color={'#ffffff'}/>
            break
        case "Restore":
            className += 'bg-blue-500 dark:border-white/[0.05] '
            icon = <FaTrashRestoreAlt size={20} color={'#ffffff'}/>
            break
        default:
            break
    }

    return (
        <div
            className={`${className} rounded-[100vw] border border-gray-200 text-sm p-3 cursor-pointer`}
            onClick={handleAction}
        >
            {icon}
        </div>
    )
}