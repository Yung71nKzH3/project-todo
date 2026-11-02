import { useState } from 'react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import type { Subscription } from '../hooks/useSubscriptions';
import { Plus, Trash2, CreditCard, ExternalLink, RefreshCcw, AlertCircle, Edit2, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

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

    const [thirtyDaysAgo] = useState(() => Date.now() - (30 * 24 * 60 * 60 * 1000));
    const needsCheck = (lastChecked: number) => {
        return lastChecked < thirtyDaysAgo;
    };

    return (
        <div className="space-y-5">
            {/* Total Monthly Card */}
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-violet-500/25 relative overflow-hidden"
            >
                <div className="absolute right-4 -bottom-4 opacity-15 pointer-events-none">
                    <Wallet size={120} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-violet-100 flex items-center gap-1.5">
                    <CreditCard size={14} />
                    Estimated Monthly Cost
                </p>
                <p className="text-4xl font-black mt-1.5 tracking-tight">${totalMonthly.toFixed(2)}</p>
                <p className="text-xs text-violet-200 mt-2 font-medium">Across {subscriptions.length} active recurring {subscriptions.length === 1 ? 'service' : 'services'}</p>
            </motion.div>

            {/* Subscriptions List Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">Recurring Expenses</h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="p-2 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 rounded-xl transition-all border border-white/60 dark:border-white/10 shadow-sm"
                    title={showForm ? "Cancel Add" : "Add Subscription"}
                >
                    <Plus size={19} className="text-violet-600 dark:text-violet-400 stroke-[2.5]" />
                </button>
            </div>

            {/* Add Subscription Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleAdd}
                        className="space-y-3 bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-white/60 dark:border-white/10 backdrop-blur-md overflow-hidden shadow-sm"
                    >
                        <input 
                            type="text" 
                            placeholder="Service Name (e.g. Netflix, Spotify)" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-3 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/40 text-sm font-medium text-foreground placeholder:text-muted-foreground"
                            required
                        />
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                step="0.01"
                                placeholder="Amount ($)" 
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="flex-1 p-3 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/40 text-sm font-medium text-foreground placeholder:text-muted-foreground"
                                required
                            />
                            <select 
                                value={frequency}
                                onChange={e => setFrequency(e.target.value as Subscription['frequency'])}
                                className="p-3 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/40 text-sm font-semibold text-foreground cursor-pointer"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">Next Billing Date:</label>
                            <input 
                                type="date" 
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full p-3 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/40 text-sm font-medium text-foreground cursor-pointer"
                                required
                            />
                        </div>
                        <input 
                            type="url" 
                            placeholder="Website URL (optional)" 
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            className="w-full p-3 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/40 text-sm font-medium text-foreground placeholder:text-muted-foreground"
                        />
                        <button 
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-md shadow-violet-500/25 active:scale-[0.98]"
                        >
                            Save Subscription
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Subscriptions List */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1.5 custom-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {subscriptions.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground text-sm italic">
                            No subscriptions tracked yet. Add one to keep your recurring expenses organized!
                        </div>
                    )}

                    {subscriptions.map(sub => (
                        <motion.div 
                            key={sub.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col gap-2 p-4 bg-white/65 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl group relative backdrop-blur-md shadow-sm hover:shadow-md transition-all"
                        >
                            {editingId === sub.id ? (
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className="w-full p-2.5 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-xl outline-none text-sm font-semibold text-foreground"
                                    />
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            value={editAmount}
                                            onChange={e => setEditAmount(e.target.value)}
                                            className="flex-1 p-2.5 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-xl outline-none text-sm font-semibold text-foreground"
                                        />
                                        <select 
                                            value={editFrequency}
                                            onChange={e => setEditFrequency(e.target.value as Subscription['frequency'])}
                                            className="p-2.5 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-xl outline-none text-sm font-semibold text-foreground cursor-pointer"
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
                                        className="w-full p-2.5 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-xl outline-none text-sm font-semibold text-foreground cursor-pointer"
                                    />
                                    <input 
                                        type="url" 
                                        value={editUrl}
                                        onChange={e => setEditUrl(e.target.value)}
                                        placeholder="URL"
                                        className="w-full p-2.5 bg-white/70 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-xl outline-none text-sm font-semibold text-foreground"
                                    />
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleUpdate}
                                            className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                        <button 
                                            onClick={() => setEditingId(null)}
                                            className="px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors border border-border"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-10 h-10 bg-violet-500/15 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-violet-500/20">
                                            <CreditCard size={20} className="stroke-[2.2]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <p className="font-bold text-foreground truncate text-sm sm:text-base">{sub.name}</p>
                                                {sub.url && (
                                                    <a 
                                                        href={sub.url} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="text-muted-foreground hover:text-violet-500 transition-colors p-0.5 rounded"
                                                        title="Open subscription website"
                                                    >
                                                        <ExternalLink size={13} />
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                                Next: {new Date(sub.nextBillingDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-extrabold text-foreground text-sm sm:text-base">${sub.amount.toFixed(2)}</p>
                                            <p className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-md inline-block">{sub.frequency}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-2 border-t border-white/40 dark:border-white/10 mt-1">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => markAsChecked(sub.id)}
                                                className={cn(
                                                    "p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider",
                                                    needsCheck(sub.lastChecked) 
                                                        ? "text-amber-600 dark:text-amber-400 bg-amber-500/15" 
                                                        : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                                                )}
                                                title="Mark as checked/verified"
                                            >
                                                <RefreshCcw size={12} className={needsCheck(sub.lastChecked) ? "animate-spin" : ""} />
                                                <span>Verified: {new Date(sub.lastChecked).toLocaleDateString()}</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => startEditing(sub)}
                                                className="p-1.5 text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => removeSubscription(sub.id)}
                                                className="p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {needsCheck(sub.lastChecked) && editingId !== sub.id && (
                                <div className="absolute -top-1.5 -right-1.5">
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <AlertCircle size={14} className="relative text-amber-500" />
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
