import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Advertisement } from '../types/DetailsCard.types.ts';
import { RejectModal } from '../components/RejectModal';
import '../styles/ItemPage.css';

export const ItemPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ad, setAd] = useState<Advertisement | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [adsList, setAdsList] = useState<Advertisement[]>([]);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);

    useEffect(() => {
        const fetchAd = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const res = await axios.get<Advertisement>(`/api/v1/ads/${id}`);
                setAd(res.data);

                const listRes = await axios.get<{ ads: Advertisement[] }>(`/api/v1/ads`, {
                    params: { page: 1, limit: 100 },
                });
                setAdsList(listRes.data.ads);
                const index = listRes.data.ads.findIndex(a => a.id === Number(id));
                setCurrentIndex(index);
            } catch (err) {
                console.error('Не удалось загрузить объявление', err);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [id, navigate]);

    if (loading) {
        return <div className="item-page">Загрузка...</div>;
    }

    if (!ad) {
        return <div className="item-page">Объявление не найдено</div>;
    }

    const handleApprove = async () => {
        try {
            const res = await axios.post<{ ad: Advertisement }>(`/api/v1/ads/${ad.id}/approve`);
            setAd(res.data.ad);
        } catch (err) {
            console.error('Ошибка при одобрении', err);
        }
    };

    const openRejectModal = () => setShowRejectModal(true);
    const handleRejectSubmit = async (reason: string, comment: string) => {
        try {
            const res = await axios.post<{ ad: Advertisement }>(
                `/api/v1/ads/${ad.id}/reject`,
                { reason, comment }
            );
            setAd(res.data.ad);
        } catch (err) {
            console.error('Ошибка при отклонении', err);
        }
    };

    const openRequestChangesModal = () => setShowRequestChangesModal(true);
    const handleRequestChangesSubmit = async (reason: string, comment: string) => {
        try {
            const res = await axios.post<{ ad: Advertisement }>(
                `/api/v1/ads/${ad.id}/request-changes`,
                { reason, comment }
            );
            setAd(res.data.ad);
        } catch (err) {
            console.error('Ошибка при запросе изменений', err);
        }
    };

    const goToPrev = () => {
        if (currentIndex > 0) {
            navigate(`/item/${adsList[currentIndex - 1].id}`);
        }
    };

    const goToNext = () => {
        if (currentIndex < adsList.length - 1) {
            navigate(`/item/${adsList[currentIndex + 1].id}`);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getActionLabel = (action: string) => {
        switch (action) {
            case 'approved': return '✓ Одобрено';
            case 'rejected': return '✗ Отклонено';
            case 'requestChanges': return '↻ Запрошены изменения';
            default: return action;
        }
    };

    return (
        <div className="item-page">
            <h1>{ad.title}</h1>
            <div className="item-page__content">
                <div className="item-page__gallery">
                    <h3>Изображения ({ad.images.length})</h3>
                    <div className="item-page__images">
                        {ad.images.map((src, i) => (
                            <img key={i} src={src} alt={`Изображение ${i + 1}`} />
                        ))}
                    </div>
                </div>
                <div className="item-page__moderation">
                    <h3>История модерации</h3>
                    {ad.moderationHistory.length > 0 ? (
                        <ul>
                            {ad.moderationHistory.map((h, i) => (
                                <li key={i}>
                                    <strong>{h.moderatorName}</strong><br />
                                    <span className="item-page__timestamp">{formatDate(h.timestamp)}</span><br />
                                    <span className="item-page__action">{getActionLabel(h.action)}</span>
                                    {h.reason && <span> — {h.reason}</span>}
                                    {h.comment && <p className="item-page__comment">{h.comment}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="item-page__empty">Нет записей</p>
                    )}
                </div>
            </div>
            <div className="item-page__section">
                <h3>Описание</h3>
                <p>{ad.description}</p>
            </div>
            <div className="item-page__section">
                <h3>Характеристики</h3>
                <table className="item-page__table">
                    <tbody>
                    {Object.entries(ad.characteristics).map(([key, value]) => (
                        <tr key={key}>
                            <td>{key}:</td>
                            <td>{value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="item-page__section">
                <h3>Продавец</h3>
                <div className="item-page__seller">
                    <strong>{ad.seller.name}</strong><br />
                    ⭐ {ad.seller.rating} | {ad.seller.totalAds} объявлений<br />
                    На Avito с {new Date(ad.seller.registeredAt).getFullYear()}
                </div>
            </div>
            <div className="item-page__actions">
                {ad.status === 'draft' ? (
                    <div className="item-page__status-info">
                        Объявление в черновике — недоступно для модерации
                    </div>
                ) : (
                    <>
                        <button className="item-page__btn item-page__btn--approve" onClick={handleApprove}>
                            ✓ Одобрить
                        </button>
                        <button className="item-page__btn item-page__btn--reject" onClick={openRejectModal}>
                            ✗ Отклонить
                        </button>
                        <button
                            className="item-page__btn item-page__btn--changes"
                            onClick={openRequestChangesModal}
                        >
                            ↻ Доработка
                        </button>
                    </>
                )}
            </div>
            <RejectModal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                onReject={handleRejectSubmit}
            />
            <RejectModal
                isOpen={showRequestChangesModal}
                onClose={() => setShowRequestChangesModal(false)}
                onReject={handleRequestChangesSubmit}
            />
            <div className="item-page__footer">
                <div className="item-page__footer-left">
                    <button className="item-page__back" onClick={() => navigate('/')}>
                        ← К списку
                    </button>
                </div>
                <div className="item-page__footer-right">
                    <div className="item-page__nav-arrows">
                        <button
                            onClick={goToPrev}
                            disabled={currentIndex <= 0}
                            className={`item-page__nav-btn ${currentIndex <= 0 ? 'disabled' : ''}`}
                        >
                            ◀ Пред
                        </button>
                        <span className="item-page__nav-separator">|</span>
                        <button
                            onClick={goToNext}
                            disabled={currentIndex >= adsList.length - 1}
                            className={`item-page__nav-btn ${currentIndex >= adsList.length - 1 ? 'disabled' : ''}`}
                        >
                            След ▶
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};