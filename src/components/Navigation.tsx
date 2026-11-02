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
        { id: 'history', icon: History, label: 'Log' },
        { id: 'analytics', icon: BarChart3, label: 'Stats' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ] as const;

    return (
        <nav aria-label="Main Navigation" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md sm:max-w-lg px-4">
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-around p-2 bg-white/75 dark:bg-[#120e24]/80 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-white/15 shadow-2xl shadow-purple-900/15 dark:shadow-black/70"
            >
                {navItems.map((item) => {
                    const isActive = currentView === item.id;
                    const Icon = item.icon;
                    
                    return (
                        <motion.button
                            key={item.id}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => setView(item.id)}
                            className={cn(
                                "relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all select-none",
                                isActive 
                                    ? "text-violet-600 dark:text-violet-300 font-bold" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-bg"
                                    className="absolute inset-0 bg-white/90 dark:bg-white/10 rounded-2xl -z-10 shadow-sm border border-white/70 dark:border-white/10"
                                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                />
                            )}
                            <Icon 
                                size={19} 
                                strokeWidth={isActive ? 2.4 : 1.9} 
                                className={cn(
                                    "transition-transform",
                                    isActive && "scale-110 drop-shadow-[0_2px_8px_rgba(139,92,246,0.25)]"
                                )} 
                            />
                            <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
                        </motion.button>
                    );
                })}
            </motion.div>
        </nav>
    );
}
