import { useState, useEffect } from 'react';

export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: number;
    completedAt?: number;
}

const STORAGE_KEY = 'todo-app-data';

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Migration: handle old format where 'text' was used instead of 'title'
                return parsed.map((todo: any) => ({
                    ...todo,
                    title: todo.title || todo.text || '',
                }));
            } catch {
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    const addTodo = (title: string, description?: string) => {
        if (!title.trim()) return;

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            title: title.trim(),
            description: description?.trim(),
            completed: false,
            createdAt: Date.now(),
        };

        setTodos([newTodo, ...todos]);
    };

    const toggleTodo = (id: string) => {
        setTodos(prev => prev.map(t =>
            t.id === id 
                ? { 
                    ...t, 
                    completed: !t.completed, 
                    completedAt: !t.completed ? Date.now() : undefined 
                  } 
                : t
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
