export interface SearchBarProps {
    displayCategories: readonly string[];
    onSearch: (query: string) => void;
    onCategorySelect: (displayName: string | null) => void;
    onStatusChange: (statuses: string[]) => void;
    onPriceChange: (field: 'min' | 'max', value: string) => void;
    onSortChange: (field: 'createdAt' | 'price' | 'priority', order: 'asc' | 'desc') => void;
    onReset: () => void;
    currentFilters: {
        status: string[];
        categoryId: number | null;
        minPrice: string;
        maxPrice: string;
        search: string;
    };
    sortBy: 'createdAt' | 'price' | 'priority';
    sortOrder: 'asc' | 'desc';
}