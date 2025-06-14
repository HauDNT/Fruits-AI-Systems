export interface ChartTabInterface {
    options: string[];
    defaultOptions: number;
    onTabClicked?: (option: string) => void;
}