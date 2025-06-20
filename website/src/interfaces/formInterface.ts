export interface FormInterface<T = any> {
  onSubmit: (formData: T) => Promise<void>;
  className?: string;
  onClose?: () => void;
}
