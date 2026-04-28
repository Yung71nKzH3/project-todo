import { useState } from 'react';
import { LavaLampBackground } from './LavaLampBackground';
import { Plus, Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useTodos } from '../hooks/useTodos';

export function TodoApp() {
    const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodos();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showDescriptionInput, setShowDescriptionInput] = useState(false);

    const handleAddTodo = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!title.trim()) return;
        addTodo(title, description);
        setTitle('');
        setDescription('');
        setShowDescriptionInput(false);
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

                        <form onSubmit={handleAddTodo} className="mb-8 space-y-2">
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
                                        title="Add description"
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
                                        className="overflow-hidden"
                                    >
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Add more details (optional)..."
                                            className="w-full p-4 bg-white/40 backdrop-blur-sm rounded-xl border-none outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm text-gray-700 placeholder:text-gray-500 shadow-inner min-h-[80px] resize-none"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>

                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
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
                                            "group flex items-start gap-4 p-4 rounded-2xl transition-all border backdrop-blur-sm",
                                            todo.completed
                                                ? "bg-gray-50/30 border-transparent opacity-60"
                                                : "bg-white/60 border-white/40 shadow-sm hover:shadow-md hover:bg-white/80"
                                        )}
                                    >
                                        <button
                                            onClick={() => toggleTodo(todo.id)}
                                            className={cn(
                                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-1",
                                                todo.completed
                                                    ? "bg-violet-500 border-violet-500 text-white"
                                                    : "border-gray-400 text-transparent hover:border-violet-500"
                                            )}
                                        >
                                            <Check size={14} strokeWidth={3} />
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <p
                                                className={cn(
                                                    "font-semibold transition-all break-words",
                                                    todo.completed ? "text-gray-500 line-through" : "text-gray-800"
                                                )}
                                            >
                                                {todo.title}
                                            </p>
                                            {todo.description && (
                                                <p className={cn(
                                                    "text-sm mt-1 break-words",
                                                    todo.completed ? "text-gray-400" : "text-gray-600"
                                                )}>
                                                    {todo.description}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                                                    Added {new Date(todo.createdAt).toLocaleDateString()}
                                                </span>
                                                {todo.completedAt && (
                                                    <span className="text-[10px] text-violet-400 uppercase tracking-wider font-bold">
                                                        • Done {new Date(todo.completedAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeTodo(todo.id)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all focus:opacity-100 flex-shrink-0"
                                            aria-label="Delete task"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="bg-white/30 p-4 px-6 flex items-center justify-between text-xs text-gray-500 border-t border-white/20">
                        <span>{todos.filter(t => !t.completed).length} items left</span>
                        {todos.some(t => t.completed) && (
                            <button
                                onClick={clearCompleted}
                                className="hover:text-violet-600 transition-colors font-medium"
                            >
                                Clear Completed
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
