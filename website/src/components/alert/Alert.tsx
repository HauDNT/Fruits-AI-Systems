import Link from "next/link";
import React, {useState} from "react";

interface AlertProps {
    className?: string;
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: React.ReactNode;
    showLink?: boolean;
    linkHref?: string;
    linkText?: string;
    dismissible?: boolean; // có thể đóng alert hay không
}

const Alert: React.FC<AlertProps> = ({
    className = "",
    variant,
    title,
    message,
    showLink = false,
    linkHref = "#",
    linkText = "Learn more",
    dismissible = false,
}) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    const variantClasses = {
        success: {
            container: "border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/20 dark:text-green-300",
            icon: "text-green-500",
        },
        error: {
            container: "border-red-500 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-900/20 dark:text-red-300",
            icon: "text-red-500",
        },
        warning: {
            container: "border-yellow-500 bg-yellow-50 text-yellow-700 dark:border-yellow-400 dark:bg-yellow-900/20 dark:text-yellow-300",
            icon: "text-yellow-500",
        },
        info: {
            container: "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300",
            icon: "text-blue-500",
        },
    };

    const icon = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
    };

    return (
        <div
            className={`relative w-full rounded-lg border p-4 flex items-start gap-3 ${variantClasses[variant].container} ${className}`}
            role="alert"
        >
            <div className="text-xl">{icon[variant]}</div>

            <div className="flex-1">
                <div className="font-semibold text-lg mb-3">{title}</div>
                <div className="text-sm">{message}</div>
                {showLink && (
                    <Link href={linkHref} className="text-sm font-medium underline mt-1 inline-block">
                        {linkText}
                    </Link>
                )}
            </div>

            {dismissible && (
                <button
                    className="absolute top-2 right-2 text-lg hover:text-opacity-80"
                    onClick={() => setVisible(false)}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default Alert;
