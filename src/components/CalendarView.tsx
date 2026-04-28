import { useState, useMemo } from 'react';
import { 
    format, addMonths, subMonths, startOfMonth, endOfMonth, 
    startOfWeek, endOfWeek, isSameMonth, isSameDay, 
    eachDayOfInterval, isToday 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Bell, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Todo } from '../hooks/useTodos';
import type { Subscription } from '../hooks/useSubscriptions';
import type { CalendarEvent } from '../hooks/useEvents';

interface CalendarViewProps {
    todos: Todo[];
    subscriptions: Subscription[];
    events: CalendarEvent[];
}

export function CalendarView({ todos, subscriptions, events }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const itemsForSelectedDate = useMemo(() => {
        const dayTodos = todos.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate));
        const daySubs = subscriptions.filter(s => isSameDay(new Date(s.nextBillingDate), selectedDate));
        const dayEvents = events.filter(e => isSameDay(new Date(e.startDate), selectedDate));
        
        return { todos: dayTodos, subs: daySubs, events: dayEvents };
    }, [todos, subscriptions, events, selectedDate]);

    return (
        <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">{format(currentMonth, 'MMMM yyyy')}</h2>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/60 rounded-xl transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/60 rounded-xl transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/60">
                <div className="grid grid-cols-7 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => {
                        const hasTodo = todos.some(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
                        const hasSub = subscriptions.some(s => isSameDay(new Date(s.nextBillingDate), day));
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
                                    isSelected ? "bg-violet-600 text-white shadow-lg shadow-violet-200" : "hover:bg-white/60",
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
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest px-2">
                    {isToday(selectedDate) ? "Today's Agenda" : format(selectedDate, 'do MMMM')}
                </h3>
                
                <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                    {itemsForSelectedDate.todos.length === 0 && 
                     itemsForSelectedDate.subs.length === 0 && 
                     itemsForSelectedDate.events.length === 0 && (
                        <p className="text-center py-8 text-gray-400 text-sm italic">Nothing scheduled for this day.</p>
                    )}

                    {itemsForSelectedDate.events.map(event => (
                        <div key={event.id} className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                                <CalendarIcon size={16} />
                            </div>
                            <span className="text-sm font-bold text-amber-900">{event.title}</span>
                        </div>
                    ))}

                    {itemsForSelectedDate.subs.map(sub => (
                        <div key={sub.id} className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                <Bell size={16} />
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-bold text-emerald-900">{sub.name} Payment</span>
                                <p className="text-[10px] text-emerald-600 font-bold uppercase">{sub.amount} {sub.currency}</p>
                            </div>
                        </div>
                    ))}

                    {itemsForSelectedDate.todos.map(todo => (
                        <div key={todo.id} className="p-3 bg-white/60 border border-white/40 rounded-2xl flex items-center gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                todo.completed ? "bg-gray-100 text-gray-400" : "bg-violet-100 text-violet-600"
                            )}>
                                <CheckCircle2 size={16} />
                            </div>
                            <span className={cn(
                                "text-sm font-bold",
                                todo.completed ? "text-gray-400 line-through" : "text-gray-800"
                            )}>{todo.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
