export const REASONS = [
    'Запрещенный товар',
    'Неверная категория',
    'Некорректное описание',
    'Проблемы с фото',
    'Подозрение на мошенничество',
    'Другое',
] as const;

export interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReject: (reason: string, comment: string) => void;
}