import { useEffect, useRef } from 'react';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import type { Todo } from './useTodos';
import type { Subscription } from './useSubscriptions';
import type { CalendarEvent } from './useEvents';
import { isSameDay, startOfDay, addHours } from 'date-fns';

const SENT_NOTIFICATIONS_KEY = 'todo-sent-notifications';

export function useNotifications(todos: Todo[], subscriptions: Subscription[], events: CalendarEvent[]) {
    const sentNotifications = useRef<Record<string, number[]>>({});

    useEffect(() => {
        const saved = localStorage.getItem(SENT_NOTIFICATIONS_KEY);
        if (saved) {
            try {
                sentNotifications.current = JSON.parse(saved);
            } catch {
                sentNotifications.current = {};
            }
        }
    }, []);

    const checkAndNotify = async () => {
        const permission = await isPermissionGranted();
        if (!permission) {
            const res = await requestPermission();
            if (res !== 'granted') return;
        }

        const now = Date.now();

        // Helper to check if we should notify for a specific target time
        const processItem = (id: string, targetTime: number, title: string, body: string) => {
            const diffMs = targetTime - now;
            const diffMins = Math.floor(diffMs / (60 * 1000));

            // Increments in minutes
            const increments = [
                { mins: 7 * 24 * 60, label: 'is due in 1 week' },
                { mins: 24 * 60, label: 'is due tomorrow' },
                { mins: 60, label: 'is due in 1 hour' },
                { mins: 30, label: 'is due in 30 mins' },
                { mins: 0, label: 'is due now!' }
            ];

            // Special cases: Morning of (9 AM) and Mid-day (1 PM)
            const morningOf = addHours(startOfDay(new Date(targetTime)), 9).getTime();
            const midDayOf = addHours(startOfDay(new Date(targetTime)), 13).getTime();

            // Check standard increments
            increments.forEach(inc => {
                if (diffMins <= inc.mins && diffMins > inc.mins - 5) { // 5 minute window
                    trigger(id, inc.mins, title, `${body} ${inc.label}`);
                }
            });

            // Check Morning/Mid-day
            if (isSameDay(now, morningOf) && Math.abs(now - morningOf) < 5 * 60 * 1000) {
                trigger(id, 900, title, `${body} - Good morning! It's due today.`);
            }
            if (isSameDay(now, midDayOf) && Math.abs(now - midDayOf) < 5 * 60 * 1000) {
                trigger(id, 1300, title, `${body} - Mid-day reminder!`);
            }
        };

        const trigger = (id: string, increment: number, title: string, body: string) => {
            if (!sentNotifications.current[id]) sentNotifications.current[id] = [];
            if (sentNotifications.current[id].includes(increment)) return;

            sendNotification({ title, body });
            sentNotifications.current[id].push(increment);
            localStorage.setItem(SENT_NOTIFICATIONS_KEY, JSON.stringify(sentNotifications.current));
        };

        // Process Todos
        todos.forEach(todo => {
            if (todo.dueDate && !todo.completed) {
                processItem(todo.id, todo.dueDate, 'Task Reminder', todo.title);
            }
        });

        // Process Events
        events.forEach(event => {
            processItem(event.id, event.startDate, 'Event Starting', event.title);
        });

        // Process Subscriptions
        subscriptions.forEach(sub => {
            processItem(sub.id, sub.nextBillingDate, 'Subscription Alert', `${sub.name} payment`);
        });
    };

    useEffect(() => {
        // Run check every minute
        const interval = setInterval(checkAndNotify, 60 * 1000);
        checkAndNotify(); // Initial check
        return () => clearInterval(interval);
    }, [todos, subscriptions, events]);
}
