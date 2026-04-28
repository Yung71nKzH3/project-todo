import { useState, useEffect } from 'react';

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    currency: string;
    frequency: 'monthly' | 'yearly';
    nextBillingDate: number;
    category?: string;
    createdAt: number;
}

const STORAGE_KEY = 'todo-subscriptions-data';

export function useSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    }, [subscriptions]);

    const addSubscription = (sub: Omit<Subscription, 'id' | 'createdAt'>) => {
        const newSub: Subscription = {
            ...sub,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };
        setSubscriptions([newSub, ...subscriptions]);
    };

    const removeSubscription = (id: string) => {
        setSubscriptions(prev => prev.filter(s => s.id !== id));
    };

    const updateSubscription = (id: string, updates: Partial<Subscription>) => {
        setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    return {
        subscriptions,
        addSubscription,
        removeSubscription,
        updateSubscription
    };
}
