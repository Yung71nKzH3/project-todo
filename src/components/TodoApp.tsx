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
import { Sparkles, Sliders } from 'lucide-react';

export function TodoApp() {
    const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodos();
    const { subscriptions } = useSubscriptions();
    const { events, addEvent, removeEvent } = useEvents();
    
    // Initialize Notification System
    useNotifications(todos, subscriptions, events);
    
    const [currentView, setCurrentView] = useState<View>('tasks');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const completedTodosCount = todos.filter(t => t.completed).length;

    const renderView = () => {
        switch (currentView) {
            case 'tasks':
                return <TasksView todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} removeTodo={removeTodo} />;
            case 'calendar':
                return <CalendarView todos={todos} subscriptions={subscriptions} events={events} addEvent={addEvent} removeEvent={removeEvent} />;
            case 'subscriptions':
                return <SubscriptionsView />;
            case 'analytics':
                return <AnalyticsView todos={todos} />;
            case 'settings':
                return (
                    <div className="space-y-6">
                        <HistoryView 
                            todos={todos} 
                            subscriptions={subscriptions} 
                            removeTodo={removeTodo} 
                        />
                        
                        {/* Danger Zone: Clear Completed */}
                        <div className="p-4 sm:p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Sliders size={13} />
                                    Danger Zone
                                </h3>
                                <p className="text-xs text-rose-600/80 dark:text-rose-300/80 mt-0.5">
                                    Permanently delete all {completedTodosCount} completed {completedTodosCount === 1 ? 'task' : 'tasks'} from the log.
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsConfirmOpen(true)}
                                disabled={completedTodosCount === 0}
                                className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:hover:bg-rose-500 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-500/20 whitespace-nowrap self-start sm:self-auto"
                            >
                                Clear Completed
                            </button>
                        </div>

                        <div className="text-center pt-1 pb-2">
                            <span className="text-[11px] font-semibold text-muted-foreground/80">
                                Lava Lamp Todo v2.0.0 • Mindful Productivity
                            </span>
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
                                    {currentView === 'settings' ? 'Settings & Log' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                                    {currentView === 'tasks' && <Sparkles size={20} className="text-violet-500 animate-pulse" />}
                                </h1>
                                <p className="text-sm text-muted-foreground font-medium">
                                    {currentView === 'tasks' && "Let's get things done today! ✨"}
                                    {currentView === 'calendar' && "Your schedule at a glance. 📅"}
                                    {currentView === 'subscriptions' && "Keep track of your recurring costs. 💸"}
                                    {currentView === 'analytics' && "Your productivity at a glance. 📊"}
                                    {currentView === 'settings' && "Activity history and data management. ⚙️"}
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
