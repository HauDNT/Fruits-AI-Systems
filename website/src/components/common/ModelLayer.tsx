'use client';
import { useEffect } from "react";
import {ModelLayerInterface} from "@/interfaces";

const ModelLayer = ({
    isOpen,
    onClose,
    children,
    className,
    maxWidth = "max-w-xl",
}: ModelLayerInterface) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Ngăn cuộn trang khi modal mở
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={` ${className} fixed inset-0 flex items-center justify-center z-999999`}>
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full mx-4 ${maxWidth}`}>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}

export default ModelLayer