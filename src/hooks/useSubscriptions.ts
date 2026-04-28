import { useState, useEffect } from 'react';

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    currency: string;
    frequency: 'monthly' | 'quarterly' | 'yearly';
    nextBillingDate: number;
    lastChecked: number;
    url?: string;
    category?: string;
    createdAt: number;
}

const STORAGE_KEY = 'todo-subscriptions-data';

export function useSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migration: add lastChecked if missing
                return parsed.map((s: any) => ({
                    ...s,
                    lastChecked: s.lastChecked || s.createdAt || Date.now(),
                    frequency: s.frequency || 'monthly'
                }));
            } catch {
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    }, [subscriptions]);

    const addSubscription = (sub: Omit<Subscription, 'id' | 'createdAt' | 'lastChecked'>) => {
        const newSub: Subscription = {
            ...sub,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            lastChecked: Date.now(),
        };
        setSubscriptions([newSub, ...subscriptions]);
    };

    const removeSubscription = (id: string) => {
        setSubscriptions(prev => prev.filter(s => s.id !== id));
    };

    const updateSubscription = (id: string, updates: Partial<Subscription>) => {
        setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...updates, lastChecked: Date.now() } : s));
    };

    const markAsChecked = (id: string) => {
        setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, lastChecked: Date.now() } : s));
    };

    return {
        subscriptions,
        addSubscription,
        removeSubscription,
        updateSubscription,
        markAsChecked
    };
}
