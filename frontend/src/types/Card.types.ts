export type CardStatus = 'pending' | 'approved' | 'rejected';
export type CardPriority = 'normal' | 'urgent';

export interface CardTypes {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    categoryId: number;
    status: CardStatus;
    priority: CardPriority;
    createdAt: string;
    updatedAt: string;
    images: string[];
    seller: Seller;
    characteristics: Record<string, string>;
    moderationHistory: ModerationHistory[];
}

export interface Seller {
    id: number;
    name: string;
    rating: string;
    totalAds: number;
    registeredAt: string;
}

export interface ModerationHistory {
    id: number;
    moderatorId: number;
    moderatorName: string;
    action: 'approved' | 'rejected' | 'requestChanges';
    reason: string | null;
    comment: string;
    timestamp: string;
}