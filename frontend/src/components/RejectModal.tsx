import React, {useState} from 'react';
import '../styles/RejectModal.css';
import {REASONS, type RejectModalProps} from "../types/Reject.types.ts";



export const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, onReject }) => {
    const [reason, setReason] = useState<string>(REASONS[0]);
    const [comment, setComment] = useState<string>('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!reason) {
            alert('Выберите причину');
            return;
        }
        onReject(reason, comment);
        onClose();
    };

    return (
        <div className="reject-modal-overlay" onClick={onClose}>
            <div className="reject-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Причина отклонения</h2>
                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="reject-modal__select"
                >
                    {REASONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
                <textarea
                    placeholder="Комментарий (необязательно)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="reject-modal__textarea"
                />
                <div className="reject-modal__buttons">
                    <button
                        onClick={handleSubmit}
                        className="reject-modal__btn reject-modal__btn--reject"
                    >
                        Отклонить
                    </button>
                    <button
                        onClick={onClose}
                        className="reject-modal__btn reject-modal__btn--cancel"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};