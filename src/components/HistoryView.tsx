import { motion, AnimatePresence } from 'framer-motion';
import type { Todo } from '../hooks/useTodos';
import { Check, Trash2, Calendar } from 'lucide-react';

interface HistoryViewProps {
    todos: Todo[];
    removeTodo: (id: string) => void;
}

export function HistoryView({ todos, removeTodo }: HistoryViewProps) {
    const completedTodos = todos.filter(t => t.completed).sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Completed Tasks</h2>
                <span className="bg-violet-100 text-violet-600 px-3 py-1 rounded-full text-xs font-bold">
                    {completedTodos.length} total
                </span>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {completedTodos.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Calendar size={32} />
                            </div>
                            <p className="text-gray-500">No history yet. Get some tasks done!</p>
                        </motion.div>
                    ) : (
                        completedTodos.map((todo) => (
                            <motion.div
                                key={todo.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="group flex items-start gap-4 p-4 rounded-2xl bg-white/40 border border-white/60 backdrop-blur-sm"
                            >
                                <div className="w-6 h-6 rounded-full bg-violet-500 text-white flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check size={14} strokeWidth={3} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-500 line-through truncate">
                                        {todo.title}
                                    </p>
                                    <div className="flex flex-col gap-1 mt-2">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                                            Added {new Date(todo.createdAt).toLocaleString()}
                                        </span>
                                        <span className="text-[10px] text-violet-500 uppercase tracking-wider font-bold">
                                            Completed {new Date(todo.completedAt || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeTodo(todo.id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all flex-shrink-0"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
