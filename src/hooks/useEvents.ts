import { useState, useEffect } from 'react';

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startDate: number;
    endDate?: number;
    allDay: boolean;
    category?: string;
    createdAt: number;
}

const STORAGE_KEY = 'todo-events-data';

export function useEvents() {
    const [events, setEvents] = useState<CalendarEvent[]>(() => {
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }, [events]);

    const addEvent = (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
        const newEvent: CalendarEvent = {
            ...event,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };
        setEvents([newEvent, ...events]);
    };

    const removeEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
        setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    };

    return {
        events,
        addEvent,
        removeEvent,
        updateEvent
    };
}
