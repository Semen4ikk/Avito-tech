import React, { useEffect, useState } from 'react';
import type { CardTypes } from '../types/Card.types';
import { Card } from '../components/Card';
import axios from 'axios';
import '../styles/MainPage.css';
import { Pagination } from '../components/Pagination';
import { SearchBar } from '../components/SearchBar';

const AVITO_DISPLAY_CATEGORIES = [
    "Электроника",
    'Недвижимость',
    'Авто',
    'Одежда, обувь, аксессуары',
    'Работа',
    'Животные',
    'Товары для детей',
    'Услуги',
] as const;

const DISPLAY_TO_CATEGORY_ID: Record<string, number> = {
    "Электроника": 0,
    'Недвижимость': 1,
    'Авто': 2,
    'Одежда, обувь, аксессуары': 6,
    'Работа': 3,
    'Животные': 5,
    'Товары для детей': 7,
    'Услуги': 4,
};

export const MainPage: React.FC = () => {
    const [ads, setAds] = useState<CardTypes[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const [filters, setFilters] = useState({
        status: [] as string[],
        categoryId: null as number | null,
        minPrice: '',
        maxPrice: '',
        search: '',
    });

    const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'priority'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const fetchAds = async (page: number) => {
        setLoading(true);
        try {
            const params: Record<string, any> = {
                page,
                limit: itemsPerPage,
                sortBy,
                sortOrder,
            };

            if (filters.status.length > 0) params.status = filters.status;
            if (filters.categoryId !== null) params.categoryId = filters.categoryId;
            if (filters.minPrice) params.minPrice = Number(filters.minPrice);
            if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
            if (filters.search) params.search = filters.search;

            const response = await axios.get<{
                ads: CardTypes[];
                pagination: { totalPages: number };
            }>('/api/v1/ads', { params });

            setAds(response.data.ads);
            setTotalPages(response.data.pagination.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Ошибка загрузки объявлений:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds(1);
    }, [filters, sortBy, sortOrder]);

    useEffect(() => {
        fetchAds(currentPage);
    }, [currentPage]);

    const handleStatusChange = (statuses: string[]) => {
        setFilters((prev) => ({ ...prev, status: statuses }));
    };

    const handleCategorySelect = (displayName: string | null) => {
        const categoryId = displayName ? DISPLAY_TO_CATEGORY_ID[displayName] : null;
        setFilters((prev) => ({ ...prev, categoryId }));
    };

    const handlePriceChange = (field: 'min' | 'max', value: string) => {
        setFilters((prev) => ({ ...prev, [`${field}Price`]: value }));
    };

    const handleSearchChange = (value: string) => {
        setFilters((prev) => ({ ...prev, search: value }));
    };

    const handleSortChange = (
        field: 'createdAt' | 'price' | 'priority',
        order: 'asc' | 'desc'
    ) => {
        setSortBy(field);
        setSortOrder(order);
    };

    const handleResetFilters = () => {
        setFilters({
            status: [],
            categoryId: null,
            minPrice: '',
            maxPrice: '',
            search: '',
        });
        setSortBy('createdAt');
        setSortOrder('desc');
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return <div className="main-page">Загрузка...</div>;
    }

    return (
        <div className="main-page">
            <h1>Список объявлений</h1>

            <SearchBar
                displayCategories={AVITO_DISPLAY_CATEGORIES}
                onSearch={handleSearchChange}
                onCategorySelect={handleCategorySelect}
                onStatusChange={handleStatusChange}
                onPriceChange={handlePriceChange}
                onSortChange={handleSortChange}
                onReset={handleResetFilters}
                currentFilters={filters}
                sortBy={sortBy}
                sortOrder={sortOrder}
            />

            {ads.length === 0 ? (
                <p>Нет объявлений</p>
            ) : (
                <>
                    <div className="ads-grid">
                        {ads.map((ad) => (
                            <Card key={ad.id} ad={ad} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};