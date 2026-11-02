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
        <div className="space-y-5">
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search logs & achievements..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500/40 text-foreground placeholder:text-muted-foreground text-sm font-medium backdrop-blur-md shadow-sm"
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
                                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25" 
                                    : "bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-white/10"
                            )}
                        >
                            {f === 'all' ? 'All Activity' : f === 'todo' ? 'Completed Tasks' : 'Subscriptions'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1.5 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {logs.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground italic text-sm">
                            No logs found matching your criteria.
                        </div>
                    )}

                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            layout
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 15 }}
                            className="group flex items-center gap-3.5 p-4 bg-white/65 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl backdrop-blur-md shadow-sm hover:shadow-md transition-all"
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                                log.type === 'todo' 
                                    ? "bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20" 
                                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            )}>
                                {log.type === 'todo' ? <Check size={19} className="stroke-[2.5]" /> : <CreditCard size={19} className="stroke-[2.2]" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-foreground truncate text-sm sm:text-base">{log.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Clock size={12} className="text-muted-foreground flex-shrink-0" />
                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                        {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            {log.type === 'todo' && (
                                <button
                                    onClick={() => removeTodo(log.originalId)}
                                    className="opacity-80 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                    title="Delete from Log"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}

                            {log.amount && (
                                <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base flex-shrink-0">
                                    ${log.amount.toFixed(2)}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
