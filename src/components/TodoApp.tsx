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
import { Power } from 'lucide-react';
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
                    <div className="text-center py-6 space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Settings</h2>
                        
                        <div className="space-y-4">
                            {/* Autostart Toggle */}
                            <div className="p-6 bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-3xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                        autostartEnabled ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-gray-100 dark:bg-white/5 text-gray-400"
                                    )}>
                                        <Power size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-800 dark:text-white">Launch on Startup</p>
                                        <p className="text-xs text-gray-500">App starts with your computer</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={toggleAutostart}
                                    className={cn(
                                        "w-12 h-6 rounded-full relative transition-colors duration-300",
                                        autostartEnabled ? "bg-emerald-500" : "bg-gray-300 dark:bg-white/10"
                                    )}
                                >
                                    <motion.div 
                                        animate={{ x: autostartEnabled ? 24 : 2 }}
                                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                                    />
                                </button>
                            </div>

                            {/* Danger Zone */}
                            <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-3xl">
                                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-2">Danger Zone</h3>
                                <p className="text-xs text-red-500 dark:text-red-400/60 mb-6">These actions cannot be undone.</p>
                                <button 
                                    onClick={() => setIsConfirmOpen(true)}
                                    className="w-full px-6 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200 dark:shadow-none"
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
                            message="This will permanently remove all tasks you have already finished from the log. This action cannot be undone."
                            confirmText="Yes, Clear Them"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 isolate overflow-hidden pb-32">
            <LavaLampBackground />

            <div className="w-full max-w-md z-10">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-card backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-border"
                >
                    <div className="p-8">
                        <header className="mb-8 flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 drop-shadow-sm">
                                    {currentView === 'history' ? 'Activity Log' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">
                                    {currentView === 'tasks' && "Let's get things done! ✨"}
                                    {currentView === 'calendar' && "Your schedule at a glance. 📅"}
                                    {currentView === 'subscriptions' && "Keep track of your recurring costs. 💸"}
                                    {currentView === 'history' && "A timeline of your achievements. 🏆"}
                                    {currentView === 'analytics' && "Your productivity at a glance. 📊"}
                                    {currentView === 'settings' && "Make it yours. ⚙️"}
                                </p>
                            </div>
                            <ThemeToggle />
                        </header>

                        <div className="min-h-[400px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentView}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
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
