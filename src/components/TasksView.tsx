import { useState } from 'react';
import { Plus, Trash2, Check, ChevronDown, ChevronUp, Calendar, Sparkles } from 'lucide-react';
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
        <div className="space-y-5">
            <form onSubmit={handleAddTodo} className="space-y-2">
                <div className="relative group">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className="w-full pl-5 pr-24 py-3.5 bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 transition-all font-medium text-foreground placeholder:text-muted-foreground shadow-sm"
                    />
                    <div className="absolute right-2 top-2 bottom-2 flex gap-1 items-center">
                        <button
                            type="button"
                            onClick={() => setShowDescriptionInput(!showDescriptionInput)}
                            className={cn(
                                "h-8 w-8 rounded-xl flex items-center justify-center transition-all",
                                showDescriptionInput 
                                    ? "bg-violet-500/15 text-violet-600 dark:text-violet-400" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                            )}
                            title={showDescriptionInput ? "Hide details" : "Add details & due date"}
                            aria-label={showDescriptionInput ? "Hide details" : "Add details & due date"}
                        >
                            {showDescriptionInput ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim()}
                            className="h-8 w-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:hover:from-violet-600 disabled:hover:to-indigo-600 text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-violet-500/25 active:scale-95"
                            title="Add Task"
                            aria-label="Add Task"
                        >
                            <Plus size={18} className="stroke-[2.5]" />
                        </button>
                    </div>
                </div>
                
                <AnimatePresence>
                    {showDescriptionInput && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden space-y-2 pt-1"
                        >
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add extra details or notes (optional)..."
                                className="w-full p-3.5 bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-xl border border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-violet-500/40 transition-all text-sm text-foreground placeholder:text-muted-foreground shadow-sm min-h-[75px] resize-none"
                            />
                            <div className="flex items-center gap-2.5 p-3 bg-white/60 dark:bg-white/5 rounded-xl border border-white/60 dark:border-white/10 backdrop-blur-md">
                                <Calendar size={16} className="text-violet-500 flex-shrink-0" />
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Due Date:</span>
                                <input 
                                    type="date" 
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="bg-transparent text-sm font-semibold text-foreground outline-none cursor-pointer flex-1"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1.5 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {pendingTodos.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center py-12 px-4 rounded-3xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-md"
                        >
                            <div className="w-16 h-16 bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3.5 text-violet-600 dark:text-violet-400 shadow-inner">
                                <Sparkles size={28} className="stroke-[2.2]" />
                            </div>
                            <p className="font-bold text-foreground text-base mb-1">All caught up!</p>
                            <p className="text-sm text-muted-foreground">No tasks remaining. Enjoy your day or add a new goal above ✨</p>
                        </motion.div>
                    )}

                    {pendingTodos.map((todo) => (
                        <motion.div
                            key={todo.id}
                            layout
                            initial={{ opacity: 0, y: 15, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group flex items-start gap-3.5 p-4 rounded-2xl bg-white/65 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-sm hover:shadow-md hover:bg-white/85 dark:hover:bg-white/10 backdrop-blur-md transition-all"
                        >
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className="group/check w-6 h-6 rounded-full border-2 border-muted-foreground/35 hover:border-violet-500 hover:bg-violet-500/10 flex items-center justify-center transition-all flex-shrink-0 mt-0.5"
                                title="Mark as completed"
                                aria-label={`Mark "${todo.title}" as completed`}
                            >
                                <Check size={13} strokeWidth={3} className="text-transparent group-hover/check:text-violet-500 transition-colors" />
                            </button>

                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-foreground text-sm sm:text-base break-words leading-snug">
                                    {todo.title}
                                </p>
                                {todo.description && (
                                    <p className="text-xs sm:text-sm mt-1 text-muted-foreground break-words leading-relaxed">
                                        {todo.description}
                                    </p>
                                )}
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                        Added {new Date(todo.createdAt).toLocaleDateString()}
                                    </span>
                                    {todo.dueDate && (
                                        <span className="text-[10px] text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider font-bold flex items-center gap-1">
                                            <Calendar size={11} className="stroke-[2.2]" />
                                            Due {new Date(todo.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => removeTodo(todo.id)}
                                className="opacity-80 sm:opacity-0 sm:group-hover:opacity-100 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 p-2 rounded-xl transition-all flex-shrink-0"
                                title="Delete Task"
                                aria-label="Delete Task"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
