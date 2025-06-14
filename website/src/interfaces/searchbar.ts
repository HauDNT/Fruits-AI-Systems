export interface SearchbarInterface {
    placeholder?: string;
    onSearch: (query: string, searchFields?: string[]) => void;
    debounceTime?: number;
}