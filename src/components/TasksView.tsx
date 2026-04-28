import { useState } from 'react';
import { Plus, Trash2, Check, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import type { Todo } from '../hooks/useTodos';

interface TasksViewProps {
    todos: Todo[];
    addTodo: (title: string, description?: string, dueDate?: number) => void;
    toggleTodo: (id: string) => void;
    removeTodo: (id: string) => void;
}

export function TasksView({ todos, addTodo, toggleTodo, removeTodo }: TasksViewProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [showDescriptionInput, setShowDescriptionInput] = useState(false);

    const pendingTodos = todos.filter(t => !t.completed);

    const handleAddTodo = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!title.trim()) return;
        addTodo(title, description, dueDate ? new Date(dueDate).getTime() : undefined);
        setTitle('');
        setDescription('');
        setDueDate('');
        setShowDescriptionInput(false);
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleAddTodo} className="space-y-2">
                <div className="relative group">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task title..."
                        className="w-full pl-6 pr-24 py-4 bg-white/50 backdrop-blur-sm rounded-2xl border-none outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-medium text-gray-700 placeholder:text-gray-500 shadow-inner"
                    />
                    <div className="absolute right-2 top-2 bottom-2 flex gap-1">
                        <button
                            type="button"
                            onClick={() => setShowDescriptionInput(!showDescriptionInput)}
                            className={cn(
                                "aspect-square rounded-xl flex items-center justify-center transition-all",
                                showDescriptionInput ? "bg-violet-100 text-violet-600" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {showDescriptionInput ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim()}
                            className="aspect-square bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-violet-200"
                        >
                            <Plus size={20} className="stroke-[3]" />
                        </button>
                    </div>
                </div>
                
                <AnimatePresence>
                    {showDescriptionInput && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-2"
                        >
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add more details (optional)..."
                                className="w-full p-4 bg-white/40 backdrop-blur-sm rounded-xl border-none outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm text-gray-700 placeholder:text-gray-500 shadow-inner min-h-[80px] resize-none"
                            />
                            <div className="flex items-center gap-2 p-3 bg-white/30 dark:bg-black/20 rounded-xl border border-white/40 dark:border-white/10">
                                <Calendar size={16} className="text-violet-500" />
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Due Date:</span>
                                <input 
                                    type="date" 
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="bg-transparent text-sm font-medium text-foreground outline-none"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {pendingTodos.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-12"
                        >
                            <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                <Check size={32} />
                            </div>
                            <p className="text-muted-foreground">All caught up! ✨</p>
                        </motion.div>
                    )}

                    {pendingTodos.map((todo) => (
                        <motion.div
                            key={todo.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group flex items-start gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur-sm transition-all"
                        >
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className="w-6 h-6 rounded-full border-2 border-muted-foreground/40 text-transparent hover:border-violet-500 flex items-center justify-center transition-colors flex-shrink-0 mt-1"
                            >
                                <Check size={14} strokeWidth={3} />
                            </button>

                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground break-words">
                                    {todo.title}
                                </p>
                                {todo.description && (
                                    <p className="text-sm mt-1 text-muted-foreground break-words">
                                        {todo.description}
                                    </p>
                                )}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                        Added {new Date(todo.createdAt).toLocaleDateString()}
                                    </span>
                                    {todo.dueDate && (
                                        <span className="text-[10px] text-violet-500 dark:text-violet-400 uppercase tracking-wider font-bold flex items-center gap-1">
                                            <Calendar size={10} />
                                            Due {new Date(todo.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => removeTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all flex-shrink-0"
                            >
                                <Trash2 size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
