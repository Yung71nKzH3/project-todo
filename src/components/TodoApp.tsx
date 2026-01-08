import { useState, useEffect } from 'react';
import { LavaLampBackground } from './LavaLampBackground';
import { Plus, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

export function TodoApp() {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem('todo-app-data');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [];
            }
        }
        return [];
    });
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        localStorage.setItem('todo-app-data', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text: inputValue.trim(),
            completed: false,
            createdAt: Date.now(),
        };

        setTodos([newTodo, ...todos]);
        setInputValue('');
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    const removeTodo = (id: string) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 isolate overflow-hidden">
            <LavaLampBackground />

            <div className="w-full max-w-md z-10">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/60"
                >
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-sm">My Tasks</h1>
                        <p className="text-gray-600 mb-8 font-medium">Let's get things done! ✨</p>

                        <form onSubmit={addTodo} className="relative mb-8 group">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Add a new task..."
                                className="w-full pl-6 pr-14 py-4 bg-white/50 backdrop-blur-sm rounded-2xl border-none outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-medium text-gray-700 placeholder:text-gray-500 shadow-inner"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="absolute right-2 top-2 bottom-2 aspect-square bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-violet-200"
                            >
                                <Plus size={20} className="stroke-[3]" />
                            </button>
                        </form>

                        <div className="space-y-3">
                            <AnimatePresence mode='popLayout'>
                                {todos.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <Check size={32} />
                                        </div>
                                        <p className="text-gray-500">No tasks yet. Add one above!</p>
                                    </motion.div>
                                )}

                                {todos.map((todo) => (
                                    <motion.div
                                        key={todo.id}
                                        layout
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        className={cn(
                                            "group flex items-center gap-4 p-4 rounded-2xl transition-all border backdrop-blur-sm",
                                            todo.completed
                                                ? "bg-gray-50/50 border-transparent"
                                                : "bg-white/60 border-white/40 shadow-sm hover:shadow-md hover:bg-white/80"
                                        )}
                                    >
                                        <button
                                            onClick={() => toggleTodo(todo.id)}
                                            className={cn(
                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
                                                todo.completed
                                                    ? "bg-violet-500 border-violet-500 text-white"
                                                    : "border-gray-400 text-transparent hover:border-violet-500"
                                            )}
                                        >
                                            <Check size={14} strokeWidth={3} />
                                        </button>

                                        <span
                                            className={cn(
                                                "flex-1 font-medium transition-all truncate",
                                                todo.completed ? "text-gray-500 line-through" : "text-gray-800"
                                            )}
                                        >
                                            {todo.text}
                                        </span>

                                        <button
                                            onClick={() => removeTodo(todo.id)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all focus:opacity-100"
                                            aria-label="Delete task"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="bg-white/30 p-4 text-center text-xs text-gray-500 border-t border-white/20">
                        {todos.filter(t => !t.completed).length} items left
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
