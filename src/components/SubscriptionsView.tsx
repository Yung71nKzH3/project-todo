import { useState } from 'react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { Plus, Trash2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SubscriptionsView() {
    const { subscriptions, addSubscription, removeSubscription } = useSubscriptions();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
    const [date, setDate] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !amount || !date) return;
        
        addSubscription({
            name,
            amount: parseFloat(amount),
            currency: '$',
            frequency,
            nextBillingDate: new Date(date).getTime(),
        });
        
        setName('');
        setAmount('');
        setShowForm(false);
    };

    const totalMonthly = subscriptions.reduce((acc, s) => {
        return acc + (s.frequency === 'monthly' ? s.amount : s.amount / 12);
    }, 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-violet-600 p-6 rounded-3xl text-white shadow-xl shadow-violet-200"
                >
                    <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Estimated Monthly</p>
                    <p className="text-4xl font-bold mt-1">${totalMonthly.toFixed(2)}</p>
                </motion.div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">My Subscriptions</h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="p-2 bg-white/60 hover:bg-white/80 rounded-xl transition-all border border-white/40"
                >
                    <Plus size={20} className="text-violet-600" />
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleAdd}
                        className="space-y-3 bg-white/40 p-4 rounded-2xl border border-white/60 overflow-hidden"
                    >
                        <input 
                            type="text" 
                            placeholder="Service Name (e.g. Netflix)" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-3 bg-white/50 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 text-sm"
                        />
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                placeholder="Amount" 
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="flex-1 p-3 bg-white/50 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 text-sm"
                            />
                            <select 
                                value={frequency}
                                onChange={e => setFrequency(e.target.value as any)}
                                className="p-3 bg-white/50 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 text-sm"
                            >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <input 
                            type="date" 
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full p-3 bg-white/50 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 text-sm"
                        />
                        <button 
                            type="submit"
                            className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-100"
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
                            className="flex items-center gap-4 p-4 bg-white/60 border border-white/40 rounded-2xl group"
                        >
                            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600">
                                <CreditCard size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 truncate">{sub.name}</p>
                                <p className="text-xs text-gray-500">
                                    Next: {new Date(sub.nextBillingDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-800">${sub.amount}</p>
                                <p className="text-[10px] uppercase font-bold text-violet-500">{sub.frequency}</p>
                            </div>
                            <button 
                                onClick={() => removeSubscription(sub.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
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
