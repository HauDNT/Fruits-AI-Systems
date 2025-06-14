export interface ListCheckInterface<T> {
    title?: string;
    data: T[];
    onCheck?: (itemsChecked: number[]) => void;
}