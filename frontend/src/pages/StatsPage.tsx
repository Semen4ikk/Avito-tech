import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import '../styles/StatsPage.css';
import type {ActivityData, CategoriesData, DecisionsData, StatsSummary} from "../types/Stats.types.ts";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, Title);

export const StatsPage: React.FC = () => {
    const [stats, setStats] = useState<StatsSummary | null>(null);
    const [activity, setActivity] = useState<ActivityData[]>([]);
    const [decisions, setDecisions] = useState<DecisionsData | null>(null);
    const [categories, setCategories] = useState<CategoriesData>({});
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('week');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const params: Record<string, any> = { period };
                if (period === 'custom') {
                    params.startDate = startDate;
                    params.endDate = endDate;
                }

                const summaryRes = await axios.get<StatsSummary>('/api/v1/stats/summary', { params });
                const activityRes = await axios.get<ActivityData[]>('/api/v1/stats/chart/activity', { params });
                const decisionsRes = await axios.get<DecisionsData>('/api/v1/stats/chart/decisions', { params });
                const categoriesRes = await axios.get<CategoriesData>('/api/v1/stats/chart/categories', { params });

                setStats(summaryRes.data);
                setActivity(activityRes.data);
                setDecisions(decisionsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error('Ошибка загрузки статистики', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [period, startDate, endDate]);

    if (loading) {
        return <div className="stats-page">Загрузка...</div>;
    }
    if (!stats || !decisions) {
        return <div className="stats-page">Не удалось загрузить статистику</div>;
    }
    const activityData = {
        labels: activity.map(day => new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })),
        datasets: [
            {
                label: 'Одобрено',
                data: activity.map(day => day.approved),
                backgroundColor: '#4CAF50',
            },
            {
                label: 'Отклонено',
                data: activity.map(day => day.rejected),
                backgroundColor: '#f44336',
            },
            {
                label: 'На доработке',
                data: activity.map(day => day.requestChanges),
                backgroundColor: '#FFC107',
            },
        ],
    };
    const decisionsData = {
        labels: ['Одобрено', 'Отклонено', 'На доработке'],
        datasets: [
            {
                data: [decisions.approved, decisions.rejected, decisions.requestChanges],
                backgroundColor: ['#4CAF50', '#f44336', '#FFC107'],
                borderWidth: 0,
            },
        ],
    };
    const topCategories = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    const categoriesData = {
        labels: topCategories.map(([name]) => name),
        datasets: [
            {
                label: 'Количество',
                data: topCategories.map(([, count]) => count),
                backgroundColor: '#2196F3',
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: false },
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true, beginAtZero: true },
        },
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const },
        },
    };

    const categoryOptions = {
        indexAxis: 'y' as const,
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { beginAtZero: true },
        },
    };
    return (
        <div className="stats-page">
            <h1>Аналитика</h1>
            <div className="stats-page__period-selector">
                <span>Период:</span>
                <button onClick={() => setPeriod('today')} className={period === 'today' ? 'active' : ''}>
                    Сегодня
                </button>
                <button onClick={() => setPeriod('week')} className={period === 'week' ? 'active' : ''}>
                    7д
                </button>
                <button onClick={() => setPeriod('month')} className={period === 'month' ? 'active' : ''}>
                    30д
                </button>
                <button onClick={() => setPeriod('custom')} className={period === 'custom' ? 'active' : ''}>
                    🗓️
                </button>
            </div>
            {period === 'custom' && (
                <div className="stats-page__custom-period">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span>—</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            )}
            <div className="stats-page__summary-grid">
                <div className="stats-card">
                    <h3>Проверено</h3>
                    <div className="stats-card__value">{stats.totalReviewed}</div>
                </div>
                <div className="stats-card">
                    <h3>Одобрено</h3>
                    <div className="stats-card__value">{Math.round(stats.approvedPercentage)}%</div>
                </div>
                <div className="stats-card">
                    <h3>Отклонено</h3>
                    <div className="stats-card__value">{Math.round(stats.rejectedPercentage)}%</div>
                </div>
                <div className="stats-card">
                    <h3>Ср. время</h3>
                    <div className="stats-card__value">{stats.averageReviewTime} мин</div>
                </div>
            </div>
            <div className="stats-section">
                <h3>Активность по дням</h3>
                <div className="chart-container">
                    <Bar data={activityData} options={barOptions} />
                </div>
            </div>
            <div className="stats-section">
                <h3>Распределение решений</h3>
                <div className="chart-container chart-container--small">
                    <Pie data={decisionsData} options={pieOptions} />
                </div>
            </div>
            <div className="stats-section">
                <h3>Топ-8 категорий</h3>
                <div className="chart-container">
                    <Bar data={categoriesData} options={categoryOptions} />
                </div>
            </div>
        </div>
    );
};