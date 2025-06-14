export interface FormInterface<T = any> {
    onSubmit: (formData: T) => Promise<boolean>;
    className?: string;
    onClose?: () => void;
}