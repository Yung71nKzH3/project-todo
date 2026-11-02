import { useState } from 'react';
import { LavaLampBackground } from './LavaLampBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodos } from '../hooks/useTodos';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useEvents } from '../hooks/useEvents';
import { Navigation, type View } from './Navigation';
import { TasksView } from './TasksView';
import { HistoryView } from './HistoryView';
import { AnalyticsView } from './AnalyticsView';
import { CalendarView } from './CalendarView';
import { SubscriptionsView } from './SubscriptionsView';
import { ThemeToggle } from './ThemeToggle';
import { ConfirmationModal } from './ConfirmationModal';
import { useNotifications } from '../hooks/useNotifications';
import { useAutostart } from '../hooks/useAutostart';
import { Power, Sparkles, Sliders } from 'lucide-react';
import { cn } from '../lib/utils';

export function TodoApp() {
    const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodos();
    const { subscriptions } = useSubscriptions();
    const { events, addEvent, removeEvent } = useEvents();
    const { enabled: autostartEnabled, toggleAutostart } = useAutostart();
    
    // Initialize Notification System
    useNotifications(todos, subscriptions, events);
    
    const [currentView, setCurrentView] = useState<View>('tasks');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const renderView = () => {
        switch (currentView) {
            case 'tasks':
                return <TasksView todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} removeTodo={removeTodo} />;
            case 'calendar':
                return <CalendarView todos={todos} subscriptions={subscriptions} events={events} addEvent={addEvent} removeEvent={removeEvent} />;
            case 'subscriptions':
                return <SubscriptionsView />;
            case 'history':
                return <HistoryView todos={todos} subscriptions={subscriptions} removeTodo={removeTodo} />;
            case 'analytics':
                return <AnalyticsView todos={todos} />;
            case 'settings':
                return (
                    <div className="space-y-6 py-2">
                        <div className="space-y-4">
                            {/* Autostart Toggle */}
                            <div className="p-5 bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-3xl flex items-center justify-between shadow-sm backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-11 h-11 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                                        autostartEnabled 
                                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" 
                                            : "bg-muted text-muted-foreground border border-border"
                                    )}>
                                        <Power size={20} className="stroke-[2.2]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-foreground text-sm">Launch on Startup</p>
                                        <p className="text-xs text-muted-foreground">Automatically launch with your OS</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={toggleAutostart}
                                    className={cn(
                                        "w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50",
                                        autostartEnabled ? "bg-emerald-500 shadow-md shadow-emerald-500/25" : "bg-muted-foreground/30"
                                    )}
                                    aria-label="Toggle Launch on Startup"
                                >
                                    <motion.div 
                                        animate={{ x: autostartEnabled ? 26 : 2 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
                                    />
                                </button>
                            </div>

                            {/* Danger Zone */}
                            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl backdrop-blur-md">
                                <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                    <Sliders size={14} />
                                    Danger Zone
                                </h3>
                                <p className="text-xs text-rose-600/80 dark:text-rose-300/80 mb-5">These actions cannot be reversed once confirmed.</p>
                                <button 
                                    onClick={() => setIsConfirmOpen(true)}
                                    className="w-full px-6 py-3 bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white rounded-2xl font-bold transition-all shadow-lg shadow-rose-500/25"
                                >
                                    Clear All Completed Tasks
                                </button>
                            </div>
                        </div>

                        <ConfirmationModal 
                            isOpen={isConfirmOpen}
                            onClose={() => setIsConfirmOpen(false)}
                            onConfirm={clearCompleted}
                            title="Clear Completed Tasks?"
                            message="This will permanently remove all tasks you have completed from your activity history. This cannot be undone."
                            confirmText="Yes, Clear Them"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 isolate overflow-hidden pb-32">
            <LavaLampBackground />

            <div className="w-full max-w-md z-10">
                <motion.div
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-card backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-border transition-colors duration-300"
                >
                    <div className="p-6 sm:p-8">
                        <header className="mb-6 flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-extrabold text-foreground mb-1 tracking-tight drop-shadow-sm flex items-center gap-2">
                                    {currentView === 'history' ? 'Activity Log' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                                    {currentView === 'tasks' && <Sparkles size={20} className="text-violet-500 animate-pulse" />}
                                </h1>
                                <p className="text-sm text-muted-foreground font-medium">
                                    {currentView === 'tasks' && "Let's get things done today! ✨"}
                                    {currentView === 'calendar' && "Your schedule at a glance. 📅"}
                                    {currentView === 'subscriptions' && "Keep track of your recurring costs. 💸"}
                                    {currentView === 'history' && "A timeline of your achievements. 🏆"}
                                    {currentView === 'analytics' && "Your productivity at a glance. 📊"}
                                    {currentView === 'settings' && "Preferences & configurations. ⚙️"}
                                </p>
                            </div>
                            <ThemeToggle />
                        </header>

                        <div className="min-h-[420px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentView}
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderView()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Navigation currentView={currentView} setView={setCurrentView} />
        </div>
    );
}
