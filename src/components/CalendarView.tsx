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
        <div className="space-y-5">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h2>
                <div className="flex gap-1.5 items-center">
                    <button 
                        onClick={prevMonth} 
                        className="p-2 text-foreground hover:bg-white/70 dark:hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/50 dark:hover:border-white/10"
                        title="Previous Month"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft size={19} />
                    </button>
                    <button 
                        onClick={nextMonth} 
                        className="p-2 text-foreground hover:bg-white/70 dark:hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/50 dark:hover:border-white/10"
                        title="Next Month"
                        aria-label="Next Month"
                    >
                        <ChevronRight size={19} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm">
                <div className="grid grid-cols-7 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{d}</div>
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
                                    "aspect-square flex flex-col items-center justify-center rounded-xl transition-all relative text-foreground",
                                    !isCurrentMonth && "opacity-25",
                                    isSelected 
                                        ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold shadow-md shadow-violet-500/25" 
                                        : "hover:bg-white/70 dark:hover:bg-white/10 font-medium",
                                    isToday(day) && !isSelected && "border-2 border-violet-500/60 font-bold"
                                )}
                            >
                                <span className={cn("text-xs", isSelected && "text-white")}>{format(day, 'd')}</span>
                                <div className="flex gap-1 mt-1">
                                    {hasTodo && <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-violet-500")} />}
                                    {hasSub && <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-emerald-500")} />}
                                    {hasEvent && <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : "bg-amber-500")} />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Day Agenda */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {isToday(selectedDate) ? "Today's Agenda" : format(selectedDate, 'do MMMM')}
                    </h3>
                    <button 
                        onClick={() => setShowEventForm(!showEventForm)}
                        className="p-1.5 hover:bg-violet-500/15 rounded-xl transition-all text-violet-600 dark:text-violet-400"
                        title={showEventForm ? "Close Form" : "Add Event"}
                    >
                        {showEventForm ? <X size={17} /> : <Plus size={17} className="stroke-[2.5]" />}
                    </button>
                </div>

                <AnimatePresence>
                    {showEventForm && (
                        <motion.form 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            onSubmit={handleAddEvent}
                            className="bg-white/70 dark:bg-white/5 p-3.5 rounded-2xl border border-white/60 dark:border-white/10 backdrop-blur-md overflow-hidden mb-3 shadow-sm"
                        >
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="What's happening on this day?" 
                                value={eventTitle}
                                onChange={e => setEventTitle(e.target.value)}
                                className="w-full bg-transparent outline-none text-sm font-semibold text-foreground placeholder:text-muted-foreground"
                            />
                            <div className="flex justify-end mt-2">
                                <button type="submit" className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider hover:underline">
                                    Save Event
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
                
                <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1.5 custom-scrollbar">
                    {itemsForSelectedDate.todos.length === 0 && 
                     itemsForSelectedDate.subs.length === 0 && 
                     itemsForSelectedDate.events.length === 0 && (
                        <p className="text-center py-6 text-muted-foreground text-sm italic">Nothing scheduled for this day.</p>
                    )}

                    {itemsForSelectedDate.events.map(event => (
                        <div key={event.id} className="group p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                            <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                                <CalendarIcon size={16} />
                            </div>
                            <span className="text-sm font-bold text-amber-900 dark:text-amber-200 flex-1 break-words">{event.title}</span>
                            <button 
                                onClick={() => removeEvent(event.id)}
                                className="opacity-80 sm:opacity-0 sm:group-hover:opacity-100 p-1 text-amber-600/70 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                title="Remove Event"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    ))}

                    {itemsForSelectedDate.subs.map(sub => (
                        <div key={sub.id} className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                <Bell size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-bold text-emerald-900 dark:text-emerald-200 block truncate">{sub.name} Payment</span>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">{sub.amount} {sub.currency}</p>
                            </div>
                        </div>
                    ))}

                    {itemsForSelectedDate.todos.map(todo => (
                        <div key={todo.id} className="p-3 bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                                todo.completed ? "bg-muted text-muted-foreground" : "bg-violet-500/15 text-violet-600 dark:text-violet-400"
                            )}>
                                <CheckCircle2 size={16} />
                            </div>
                            <span className={cn(
                                "text-sm font-semibold break-words",
                                todo.completed ? "text-muted-foreground line-through" : "text-foreground"
                            )}>{todo.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
