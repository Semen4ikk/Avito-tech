import React, { useState } from 'react';
import '../styles/SearchBar.css';
import { CategoryMenu } from './CategoryMenu';
import { FilterMenu } from './FilterMenu';
import type {SearchBarProps} from "../types/SearchBar.types.ts";



export const SearchBar: React.FC<SearchBarProps> = ({
                                                        displayCategories,
                                                        onSearch,
                                                        onCategorySelect,
                                                        onStatusChange,
                                                        onPriceChange,
                                                        onSortChange,
                                                        onReset,
                                                        currentFilters,
                                                        sortBy,
                                                        sortOrder,
                                                    }) => {
    const [searchQuery, setSearchQuery] = useState(currentFilters.search);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const toggleCategoryMenu = () => {
        setIsCategoryMenuOpen(!isCategoryMenuOpen);
        if (isFilterMenuOpen) setIsFilterMenuOpen(false);
    };

    const toggleFilterMenu = () => {
        setIsFilterMenuOpen(!isFilterMenuOpen);
        if (isCategoryMenuOpen) setIsCategoryMenuOpen(false);
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit} className="search-bar__form">
                <button
                    type="button"
                    onClick={toggleCategoryMenu}
                    className={`search-bar__btn search-bar__category-btn ${
                        isCategoryMenuOpen ? 'active' : ''
                    }`}
                >
                    ≡ Все категории
                </button>
                <button
                    type="button"
                    onClick={toggleFilterMenu}
                    className={`search-bar__btn search-bar__filters-btn ${
                        isFilterMenuOpen ? 'active' : ''
                    }`}
                >
                    Фильтры
                </button>
                <input
                    type="text"
                    placeholder="Поиск по объявлениям..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar__input"
                />
                <button type="submit" className="search-bar__btn search-bar__search-btn">
                    Найти
                </button>
            </form>
            {isCategoryMenuOpen && (
                <>
                    <div className="search-bar__overlay" onClick={() => setIsCategoryMenuOpen(false)} />
                    <div className="search-bar__dropdown">
                        <CategoryMenu
                            categories={displayCategories}
                            onSelect={(name) => {
                                onCategorySelect(name);
                                setIsCategoryMenuOpen(false);
                            }}
                        />
                    </div>
                </>
            )}
            {isFilterMenuOpen && (
                <>
                    <div className="search-bar__overlay" onClick={() => setIsFilterMenuOpen(false)} />
                    <div className="search-bar__dropdown">
                        <FilterMenu
                            currentFilters={currentFilters}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onStatusChange={onStatusChange}
                            onPriceChange={onPriceChange}
                            onSortChange={onSortChange}
                            onReset={onReset}
                        />
                    </div>
                </>
            )}
        </div>
    );
};