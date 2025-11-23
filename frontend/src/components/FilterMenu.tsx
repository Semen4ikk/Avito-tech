import React, { useState } from 'react';
import '../styles/FilterMenu.css';

export const FilterMenu: React.FC<{
    currentFilters: {
        status: string[];
        minPrice: string;
        maxPrice: string;
    };
    sortBy: 'createdAt' | 'price' | 'priority';
    sortOrder: 'asc' | 'desc';
    onStatusChange: (statuses: string[]) => void;
    onPriceChange: (field: 'min' | 'max', value: string) => void;
    onSortChange: (field: 'createdAt' | 'price' | 'priority', order: 'asc' | 'desc') => void;
    onReset: () => void;
}> = ({ currentFilters, sortBy, sortOrder, onStatusChange, onPriceChange, onSortChange, onReset }) => {
    const [minPriceInput, setMinPriceInput] = useState(currentFilters.minPrice);
    const [maxPriceInput, setMaxPriceInput] = useState(currentFilters.maxPrice);
    React.useEffect(() => {
        setMinPriceInput(currentFilters.minPrice);
        setMaxPriceInput(currentFilters.maxPrice);
    }, [currentFilters.minPrice, currentFilters.maxPrice]);

    return (
        <div className="filter-menu">
            <div className="filter-menu__section">
                <h3 className="filter-menu__title">Фильтры</h3>
                <button type="button" onClick={onReset} className="filter-menu__reset">
                    Сбросить всё
                </button>
            </div>
            <div className="filter-menu__group">
                <label className="filter-menu__label">Статус:</label>
                <div className="filter-menu__checkboxes">
                    {(['pending', 'approved', 'rejected'] as const).map((s) => (
                        <label key={s} className="filter-menu__checkbox">
                            <input
                                type="checkbox"
                                checked={currentFilters.status.includes(s)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        onStatusChange([...currentFilters.status, s]);
                                    } else {
                                        onStatusChange(currentFilters.status.filter((st) => st !== s));
                                    }
                                }}
                            />
                            <span>
                {s === 'pending'
                    ? 'На модерации'
                    : s === 'approved'
                        ? 'Одобрено'
                        : s === 'rejected'
                            ? 'Отклонено'
                            : ''}
              </span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="filter-menu__group">
                <label className="filter-menu__label">Цена:</label>
                <div className="filter-menu__price">
                    <input
                        type="number"
                        placeholder="От"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        onBlur={(e) => onPriceChange('min', e.target.value)}
                        min="0"
                        className="filter-menu__input"
                    />
                    <span className="filter-menu__dash">–</span>
                    <input
                        type="number"
                        placeholder="До"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        onBlur={(e) => onPriceChange('max', e.target.value)}
                        min="0"
                        className="filter-menu__input"
                    />
                </div>
            </div>
            <div className="filter-menu__group">
                <label className="filter-menu__label">Сортировка:</label>
                <div className="filter-menu__sort">
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value as any, sortOrder)}
                        className="filter-menu__select"
                    >
                        <option value="createdAt">По дате</option>
                        <option value="price">По цене</option>
                        <option value="priority">По приоритету</option>
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(e) => onSortChange(sortBy, e.target.value as any)}
                        className="filter-menu__select"
                    >
                        <option value="desc">По убыванию</option>
                        <option value="asc">По возрастанию</option>
                    </select>
                </div>
            </div>
        </div>
    );
};