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

export function TodoApp() {
    const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodos();
    const { subscriptions } = useSubscriptions();
    const { events, addEvent, removeEvent } = useEvents();
    const [currentView, setCurrentView] = useState<View>('tasks');

    const renderView = () => {
        switch (currentView) {
            case 'tasks':
                return <TasksView todos={todos} addTodo={addTodo} toggleTodo={toggleTodo} removeTodo={removeTodo} />;
            case 'calendar':
                return <CalendarView todos={todos} subscriptions={subscriptions} events={events} addEvent={addEvent} removeEvent={removeEvent} />;
            case 'subscriptions':
                return <SubscriptionsView />;
            case 'history':
                return <HistoryView todos={todos} removeTodo={removeTodo} />;
            case 'analytics':
                return <AnalyticsView todos={todos} />;
            case 'settings':
                return (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Settings</h2>
                        <p className="text-gray-500 dark:text-gray-400">More settings coming soon! ✨</p>
                        <button 
                            onClick={clearCompleted}
                            className="mt-8 px-6 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                        >
                            Clear All Completed
                        </button>
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
                                    {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">
                                    {currentView === 'tasks' && "Let's get things done! ✨"}
                                    {currentView === 'calendar' && "Your schedule at a glance. 📅"}
                                    {currentView === 'subscriptions' && "Keep track of your recurring costs. 💸"}
                                    {currentView === 'history' && "Look how far you've come! 🏆"}
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
