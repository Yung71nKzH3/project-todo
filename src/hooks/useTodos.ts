import { useState, useEffect } from 'react';

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

const STORAGE_KEY = 'todo-app-data';

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>(() => {
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
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    const addTodo = (text: string) => {
        if (!text.trim()) return;

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text: text.trim(),
            completed: false,
            createdAt: Date.now(),
        };

        setTodos([newTodo, ...todos]);
    };

    const toggleTodo = (id: string) => {
        setTodos(prev => prev.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    const removeTodo = (id: string) => {
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    const clearCompleted = () => {
        setTodos(prev => prev.filter(t => !t.completed));
    };

    return {
        todos,
        addTodo,
        toggleTodo,
        removeTodo,
        clearCompleted
    };
}
