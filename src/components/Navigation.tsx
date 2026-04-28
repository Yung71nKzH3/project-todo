import { motion } from 'framer-motion';
import { ListTodo, History, BarChart3, Calendar, CreditCard, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export type View = 'tasks' | 'calendar' | 'subscriptions' | 'history' | 'analytics' | 'settings';

interface NavigationProps {
    currentView: View;
    setView: (view: View) => void;
}

export function Navigation({ currentView, setView }: NavigationProps) {
    const navItems = [
        { id: 'tasks', icon: ListTodo, label: 'Tasks' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: 'subscriptions', icon: CreditCard, label: 'Subs' },
        { id: 'history', icon: History, label: 'History' },
        { id: 'analytics', icon: BarChart3, label: 'Stats' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ] as const;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-around p-2 bg-white/40 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-2xl shadow-violet-500/10"
            >
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    const Icon = item.icon;
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
                            className={cn(
                                "relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                                isActive ? "text-violet-600" : "text-gray-500 hover:text-gray-700 hover:bg-white/30"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-bg"
                                    className="absolute inset-0 bg-white/60 rounded-xl -z-10 shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[8px] font-extrabold uppercase tracking-widest">{item.label}</span>
                        </button>
                    );
                })}
            </motion.div>
        </div>
    );
}
