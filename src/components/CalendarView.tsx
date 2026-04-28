import { useState, useMemo } from 'react';
import { 
    format, addMonths, subMonths, startOfMonth, endOfMonth, 
    startOfWeek, endOfWeek, isSameMonth, isSameDay, 
    eachDayOfInterval, isToday 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Bell, Calendar as CalendarIcon, CheckCircle2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import type { Todo } from '../hooks/useTodos';
import type { Subscription } from '../hooks/useSubscriptions';
import type { CalendarEvent } from '../hooks/useEvents';

interface CalendarViewProps {
    todos: Todo[];
    subscriptions: Subscription[];
    events: CalendarEvent[];
    addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
    removeEvent: (id: string) => void;
}

export function CalendarView({ todos, subscriptions, events, addEvent, removeEvent }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showEventForm, setShowEventForm] = useState(false);
    const [eventTitle, setEventTitle] = useState('');

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    // Helper to check if a subscription falls on a given day
    const isSubscriptionDay = (sub: Subscription, day: Date) => {
        const startDate = new Date(sub.nextBillingDate);
        if (isSameDay(startDate, day)) return true;
        
        // Project forward based on frequency
        if (day < startDate) return false;

        const monthsDiff = (day.getFullYear() - startDate.getFullYear()) * 12 + (day.getMonth() - startDate.getMonth());
        
        if (sub.frequency === 'monthly') {
            return day.getDate() === startDate.getDate();
        }
        if (sub.frequency === 'quarterly') {
            return day.getDate() === startDate.getDate() && monthsDiff % 3 === 0;
        }
        if (sub.frequency === 'yearly') {
            return day.getDate() === startDate.getDate() && day.getMonth() === startDate.getMonth();
        }
        return false;
    };

    const itemsForSelectedDate = useMemo(() => {
        const dayTodos = todos.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate));
        const daySubs = subscriptions.filter(s => isSubscriptionDay(s, selectedDate));
        const dayEvents = events.filter(e => isSameDay(new Date(e.startDate), selectedDate));
        
        return { todos: dayTodos, subs: daySubs, events: dayEvents };
    }, [todos, subscriptions, events, selectedDate]);

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventTitle.trim()) return;
        
        addEvent({
            title: eventTitle.trim(),
            startDate: selectedDate.getTime(),
            allDay: true
        });
        
        setEventTitle('');
        setShowEventForm(false);
    };

    return (
        <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{format(currentMonth, 'MMMM yyyy')}</h2>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/60 dark:hover:bg-white/10 rounded-xl transition-all dark:text-white">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/60 dark:hover:bg-white/10 rounded-xl transition-all dark:text-white">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/60 dark:border-white/10">
                <div className="grid grid-cols-7 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                        const hasTodo = todos.some(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
                        const hasSub = subscriptions.some(s => isSubscriptionDay(s, day));
                        const hasEvent = events.some(e => isSameDay(new Date(e.startDate), day));
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentMonth);

                        return (
                            <button
                                key={i}
                                onClick={() => setSelectedDate(day)}
                                className={cn(
                                    "aspect-square flex flex-col items-center justify-center rounded-xl transition-all relative",
                                    !isCurrentMonth && "opacity-20",
                                    isSelected 
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-none" 
                                        : "hover:bg-white/60 dark:hover:bg-white/10 dark:text-gray-300",
                                    isToday(day) && !isSelected && "border-2 border-violet-400"
                                )}
                            >
                                <span className="text-xs font-bold">{format(day, 'd')}</span>
                                <div className="flex gap-0.5 mt-1">
                                    {hasTodo && <div className={cn("w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-violet-500")} />}
                                    {hasSub && <div className={cn("w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-emerald-500")} />}
                                    {hasEvent && <div className={cn("w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-amber-500")} />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Day Agenda */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        {isToday(selectedDate) ? "Today's Agenda" : format(selectedDate, 'do MMMM')}
                    </h3>
                    <button 
                        onClick={() => setShowEventForm(!showEventForm)}
                        className="p-1 hover:bg-white/60 dark:hover:bg-white/10 rounded-md transition-all text-violet-600 dark:text-violet-400"
                    >
                        {showEventForm ? <X size={18} /> : <Plus size={18} />}
                    </button>
                </div>

                <AnimatePresence>
                    {showEventForm && (
                        <motion.form 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            onSubmit={handleAddEvent}
                            className="bg-white/40 dark:bg-white/5 p-3 rounded-2xl border border-white/60 dark:border-white/10 overflow-hidden mb-4"
                        >
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="Event title..." 
                                value={eventTitle}
                                onChange={e => setEventTitle(e.target.value)}
                                className="w-full bg-transparent outline-none text-sm font-bold text-gray-800 dark:text-white placeholder:text-gray-400"
                            />
                            <div className="flex justify-end mt-2">
                                <button type="submit" className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                                    Save Event
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
                
                <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                    {itemsForSelectedDate.todos.length === 0 && 
                     itemsForSelectedDate.subs.length === 0 && 
                     itemsForSelectedDate.events.length === 0 && (
                        <p className="text-center py-8 text-gray-400 text-sm italic">Nothing scheduled for this day.</p>
                    )}

                    {itemsForSelectedDate.events.map(event => (
                        <div key={event.id} className="group p-3 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <CalendarIcon size={16} />
                            </div>
                            <span className="text-sm font-bold text-amber-900 dark:text-amber-100 flex-1">{event.title}</span>
                            <button 
                                onClick={() => removeEvent(event.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-amber-400 hover:text-red-500 transition-all"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}

                    {itemsForSelectedDate.subs.map(sub => (
                        <div key={sub.id} className="p-3 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Bell size={16} />
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100">{sub.name} Payment</span>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">{sub.amount} {sub.currency}</p>
                            </div>
                        </div>
                    ))}

                    {itemsForSelectedDate.todos.map(todo => (
                        <div key={todo.id} className="p-3 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl flex items-center gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                todo.completed ? "bg-gray-100 dark:bg-gray-800 text-gray-400" : "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                            )}>
                                <CheckCircle2 size={16} />
                            </div>
                            <span className={cn(
                                "text-sm font-bold",
                                todo.completed ? "text-gray-400 line-through" : "text-gray-800 dark:text-gray-200"
                            )}>{todo.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
