import React from 'react';
import { Link } from 'react-router-dom';
import type { CardTypes } from '../types/Card.types';
import dayjs from 'dayjs';
import '../styles/Card.css';

const statusLabels: Record<CardTypes['status'], string> = {
    pending: 'На модерации',
    approved: 'Одобрено',
    rejected: 'Отклонено',
} as const;

const priorityLabels: Record<CardTypes['priority'], string> = {
    normal: 'Обычный',
    urgent: 'Срочный',
} as const;

const statusClass: Record<CardTypes['status'], string> = {
    pending: 'status-pending',
    approved: 'status-approved',
    rejected: 'status-rejected',
} as const;

const priorityClass: Record<CardTypes['priority'], string> = {
    normal: 'priority-normal',
    urgent: 'priority-urgent',
} as const;

export const Card: React.FC<{ ad: CardTypes }> = ({ ad }) => {
    return (
        <Link to={`/item/${ad.id}`} className="ad-card">
            <div className="ad-image-placeholder">
                <span>Изображение</span>
            </div>
            <h3 className="ad-title">{ad.title}</h3>
            <p className="ad-price">{ad.price} ₽</p>
            <p className="ad-category">Категория: {ad.category}</p>
            <p className="ad-date">
                Дата: {dayjs(ad.createdAt).format('DD.MM.YYYY')}
            </p>
            <div className="ad-footer">
        <span className={`status-badge ${statusClass[ad.status]}`}>
          {statusLabels[ad.status]}
        </span>
                <span className={`priority-badge ${priorityClass[ad.priority]}`}>
          {priorityLabels[ad.priority]}
        </span>
            </div>
        </Link>
    );
};