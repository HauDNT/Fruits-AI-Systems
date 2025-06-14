export interface FormDetailInterface<T> {
    data: T;
    onUpdateSuccess?: (formData: T) => Promise<void>;
}