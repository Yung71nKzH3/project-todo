import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Todo } from '../hooks/useTodos';
import type { Subscription } from '../hooks/useSubscriptions';
import { Check, Trash2, Search, CreditCard, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface HistoryViewProps {
    todos: Todo[];
    subscriptions: Subscription[];
    removeTodo: (id: string) => void;
}

type LogEntry = {
    id: string;
    type: 'todo' | 'subscription';
    title: string;
    description?: string;
    timestamp: number;
    amount?: number;
    originalId: string;
};

export function HistoryView({ todos, subscriptions, removeTodo }: HistoryViewProps) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'todo' | 'subscription'>('all');

    const logs = useMemo(() => {
        const todoLogs: LogEntry[] = todos
            .filter(t => t.completed)
            .map(t => ({
                id: `todo-${t.id}`,
                type: 'todo',
                title: t.title,
                description: t.description,
                timestamp: t.completedAt || t.createdAt,
                originalId: t.id
            }));

        const subLogs: LogEntry[] = subscriptions.map(s => ({
            id: `sub-${s.id}`,
            type: 'subscription',
            title: `${s.name} Subscription`,
            description: `Billed ${s.frequency}`,
            timestamp: s.createdAt,
            amount: s.amount,
            originalId: s.id
        }));

        const combined = [...todoLogs, ...subLogs].sort((a, b) => b.timestamp - a.timestamp);
        
        return combined.filter(log => {
            const matchesSearch = log.title.toLowerCase().includes(search.toLowerCase()) || 
                                 log.description?.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = filter === 'all' || log.type === filter;
            return matchesSearch && matchesFilter;
        });
    }, [todos, subscriptions, search, filter]);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search logs..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500/30 dark:text-white"
                    />
                </div>

                <div className="flex gap-2">
                    {(['all', 'todo', 'subscription'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                                filter === f 
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-none" 
                                    : "bg-white/40 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-white/60"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {logs.length === 0 && (
                        <div className="text-center py-12 text-gray-400 italic text-sm">
                            No logs found matching your criteria.
                        </div>
                    )}

                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="group flex items-center gap-4 p-4 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl"
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                                log.type === 'todo' ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            )}>
                                {log.type === 'todo' ? <Check size={20} /> : <CreditCard size={20} />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 dark:text-white truncate">{log.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock size={12} className="text-gray-400" />
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">
                                        {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            {log.type === 'todo' && (
                                <button
                                    onClick={() => removeTodo(log.originalId)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}

                            {log.amount && (
                                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                                    ${log.amount}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
