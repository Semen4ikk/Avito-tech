import React, { useState } from 'react';
import '../styles/CategoryMenu.css';

export const CategoryMenu: React.FC<{
    categories: readonly string[];
    onSelect: (displayName: string | null) => void;
}> = ({ categories, onSelect }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleCategoryClick = (name: string) => {
        if (name === 'Все категории') {
            onSelect(null);
            setSelectedCategory(null);
            return;
        }

        onSelect(name);
        setSelectedCategory(null);
    };

    return (
        <div className="category-menu">
            {selectedCategory ? (
                <>
                    <div className="category-menu__header">
                        <button onClick={() => setSelectedCategory(null)} className="category-menu__back-btn">
                            ← {selectedCategory}
                        </button>
                    </div>
                    <div className="category-menu__content">
                        <div
                            className="category-menu__item"
                            onClick={() => handleCategoryClick(selectedCategory)}
                        >
                            {selectedCategory}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="category-menu__header">
                        <h3>Все категории</h3>
                    </div>
                    <div className="category-menu__content">
                        {categories.map((name) => (
                            <div
                                key={name}
                                className="category-menu__item"
                                onClick={() => handleCategoryClick(name)}
                            >
                                {name}
                            </div>
                        ))}
                        <div
                            className="category-menu__item category-menu__item--all"
                            onClick={() => handleCategoryClick('Все категории')}
                        >
                            Все категории
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};