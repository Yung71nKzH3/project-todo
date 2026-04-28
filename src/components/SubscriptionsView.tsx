import { useState } from 'react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import type { Subscription } from '../hooks/useSubscriptions';
import { Plus, Trash2, CreditCard, ExternalLink, RefreshCcw, AlertCircle, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SubscriptionsView() {
    const { subscriptions, addSubscription, removeSubscription, markAsChecked, updateSubscription } = useSubscriptions();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
    const [date, setDate] = useState('');
    const [url, setUrl] = useState('');
    const [showForm, setShowForm] = useState(false);
    
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editFrequency, setEditFrequency] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
    const [editDate, setEditDate] = useState('');
    const [editUrl, setEditUrl] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !amount || !date) return;
        
        addSubscription({
            name,
            amount: parseFloat(amount),
            currency: '$',
            frequency,
            nextBillingDate: new Date(date).getTime(),
            url: url.trim() || undefined
        });
        
        setName('');
        setAmount('');
        setUrl('');
        setShowForm(false);
    };

    const startEditing = (sub: Subscription) => {
        setEditingId(sub.id);
        setEditName(sub.name);
        setEditAmount(sub.amount.toString());
        setEditFrequency(sub.frequency);
        setEditDate(new Date(sub.nextBillingDate).toISOString().split('T')[0]);
        setEditUrl(sub.url || '');
    };

    const handleUpdate = () => {
        if (!editingId) return;
        updateSubscription(editingId, {
            name: editName,
            amount: parseFloat(editAmount),
            frequency: editFrequency,
            nextBillingDate: new Date(editDate).getTime(),
            url: editUrl.trim() || undefined
        });
        setEditingId(null);
    };

    const totalMonthly = subscriptions.reduce((acc, s) => {
        if (s.frequency === 'monthly') return acc + s.amount;
        if (s.frequency === 'quarterly') return acc + s.amount / 3;
        return acc + s.amount / 12;
    }, 0);

    const needsCheck = (lastChecked: number) => {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        return lastChecked < thirtyDaysAgo;
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-violet-600 p-6 rounded-3xl text-white shadow-xl shadow-violet-200 dark:shadow-none"
                >
                    <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Estimated Monthly</p>
                    <p className="text-4xl font-bold mt-1">${totalMonthly.toFixed(2)}</p>
                </motion.div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Subscriptions</h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="p-2 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 rounded-xl transition-all border border-white/40 dark:border-white/10"
                >
                    <Plus size={20} className="text-violet-600 dark:text-violet-400" />
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleAdd}
                        className="space-y-3 bg-white/40 dark:bg-white/5 p-4 rounded-2xl border border-white/60 dark:border-white/10 overflow-hidden"
                    >
                        <input 
                            type="text" 
                            placeholder="Service Name (e.g. Netflix)" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-3 bg-white/50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 text-sm dark:text-white"
                        />
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                placeholder="Amount" 
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="flex-1 p-3 bg-white/50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 text-sm dark:text-white"
                            />
                            <select 
                                value={frequency}
                                onChange={e => setFrequency(e.target.value as any)}
                                className="p-3 bg-white/50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 text-sm dark:text-white"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <input 
                            type="date" 
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full p-3 bg-white/50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 text-sm dark:text-white"
                        />
                        <input 
                            type="url" 
                            placeholder="URL (optional)" 
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            className="w-full p-3 bg-white/50 dark:bg-black/20 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 text-sm dark:text-white"
                        />
                        <button 
                            type="submit"
                            className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100 dark:shadow-none"
                        >
                            Add Subscription
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {subscriptions.map(sub => (
                        <motion.div 
                            key={sub.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col gap-2 p-4 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl group relative"
                        >
                            {editingId === sub.id ? (
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className="w-full p-2 bg-white/50 dark:bg-black/20 rounded-lg outline-none text-sm dark:text-white"
                                    />
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            value={editAmount}
                                            onChange={e => setEditAmount(e.target.value)}
                                            className="flex-1 p-2 bg-white/50 dark:bg-black/20 rounded-lg outline-none text-sm dark:text-white"
                                        />
                                        <select 
                                            value={editFrequency}
                                            onChange={e => setEditFrequency(e.target.value as any)}
                                            className="p-2 bg-white/50 dark:bg-black/20 rounded-lg outline-none text-sm dark:text-white"
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                    <input 
                                        type="date" 
                                        value={editDate}
                                        onChange={e => setEditDate(e.target.value)}
                                        className="w-full p-2 bg-white/50 dark:bg-black/20 rounded-lg outline-none text-sm dark:text-white"
                                    />
                                    <input 
                                        type="url" 
                                        value={editUrl}
                                        onChange={e => setEditUrl(e.target.value)}
                                        placeholder="URL"
                                        className="w-full p-2 bg-white/50 dark:bg-black/20 rounded-lg outline-none text-sm dark:text-white"
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleUpdate}
                                            className="flex-1 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold"
                                        >
                                            Save
                                        </button>
                                        <button 
                                            onClick={() => setEditingId(null)}
                                            className="px-4 py-2 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400 flex-shrink-0">
                                            <CreditCard size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-gray-800 dark:text-white truncate">{sub.name}</p>
                                                {sub.url && (
                                                    <a href={sub.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-violet-500 transition-colors">
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                                                Next: {new Date(sub.nextBillingDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800 dark:text-white">${sub.amount}</p>
                                            <p className="text-[10px] uppercase font-bold text-violet-500 dark:text-violet-400">{sub.frequency}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-2 border-t border-white/20 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    onClick={() => markAsChecked(sub.id)}
                                                    className={cn(
                                                        "p-1 rounded-md transition-colors",
                                                        needsCheck(sub.lastChecked) ? "text-amber-500 bg-amber-500/10" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                                                    )}
                                                    title="Mark as verified"
                                                >
                                                    <RefreshCcw size={10} className={needsCheck(sub.lastChecked) ? "animate-spin-slow" : ""} />
                                                </button>
                                                <span className="text-[8px] text-gray-400 font-bold uppercase">
                                                    Checked: {new Date(sub.lastChecked).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => startEditing(sub)}
                                                className="p-2 text-gray-400 hover:text-violet-500 transition-all"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => removeSubscription(sub.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {needsCheck(sub.lastChecked) && editingId !== sub.id && (
                                <div className="absolute -top-1 -right-1">
                                    <AlertCircle size={14} className="text-amber-500 fill-white dark:fill-black" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
