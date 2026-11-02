import { useMemo } from 'react';
import type { Todo } from '../hooks/useTodos';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie
} from 'recharts';
import { motion } from 'framer-motion';

interface AnalyticsViewProps {
    todos: Todo[];
}

interface TooltipPayloadItem {
    name?: string;
    value?: number;
    color?: string;
    payload: {
        name: string;
        value: number;
        color: string;
    };
}

interface CustomBarTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}

interface CustomPieTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
}

const CustomBarTooltip = ({ active, payload, label }: CustomBarTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/95 backdrop-blur-xl border border-border px-3 py-2 rounded-xl shadow-xl text-xs font-semibold text-foreground">
                <p className="text-muted-foreground font-medium">{label}</p>
                <p className="text-violet-500 font-bold mt-0.5">{payload[0].value} {payload[0].value === 1 ? 'task' : 'tasks'}</p>
            </div>
        );
    }
    return null;
};

const CustomPieTooltip = ({ active, payload }: CustomPieTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/95 backdrop-blur-xl border border-border px-2.5 py-1.5 rounded-xl shadow-xl text-xs font-semibold text-foreground">
                <span style={{ color: payload[0].payload.color }} className="font-bold">{payload[0].name}: </span>
                <span className="font-extrabold">{payload[0].value}</span>
            </div>
        );
    }
    return null;
};

export function AnalyticsView({ todos }: AnalyticsViewProps) {
    const stats = useMemo(() => {
        const completed = todos.filter(t => t.completed);
        const pending = todos.filter(t => !t.completed);
        
        // On-time stats
        const onTime = completed.filter(t => {
            if (!t.dueDate || !t.completedAt) return true; // If no due date, it's never late
            return t.completedAt <= t.dueDate;
        });

        const late = completed.length - onTime.length;
        
        // Tasks by day
        const dayMap: Record<string, number> = {};
        todos.forEach(t => {
            const day = new Date(t.createdAt).toLocaleDateString(undefined, { weekday: 'short' });
            dayMap[day] = (dayMap[day] || 0) + 1;
        });
        
        const chartData = Object.entries(dayMap).map(([name, value]) => ({ name, value }));

        // Completion time avg
        let avgCompletionTime = 0;
        if (completed.length > 0) {
            const total = completed.reduce((acc, t) => acc + ((t.completedAt || 0) - t.createdAt), 0);
            avgCompletionTime = total / completed.length / (1000 * 60 * 60); // In hours
        }

        const pieData = [
            { name: 'Completed', value: completed.length, color: '#8b5cf6' },
            { name: 'Pending', value: pending.length, color: '#38bdf8' }
        ];

        const punctualityData = [
            { name: 'On-time', value: onTime.length, color: '#10b981' },
            { name: 'Late', value: late, color: '#f43f5e' }
        ];

        return {
            total: todos.length,
            completed: completed.length,
            pending: pending.length,
            avgCompletionTime: avgCompletionTime.toFixed(1),
            onTimeRate: completed.length > 0 ? Math.round((onTime.length / completed.length) * 100) : 100,
            chartData,
            pieData,
            punctualityData
        };
    }, [todos]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3.5">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/65 dark:bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/60 dark:border-white/10 text-center shadow-sm"
                >
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">On-Time Rate</p>
                    <p className="text-2xl font-black text-emerald-500 mt-0.5">
                        {stats.onTimeRate}%
                    </p>
                </motion.div>
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.08 }}
                    className="bg-white/65 dark:bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/60 dark:border-white/10 text-center shadow-sm"
                >
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Avg. Time</p>
                    <p className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-0.5">{stats.avgCompletionTime}h</p>
                </motion.div>
            </div>

            <motion.div 
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="bg-white/65 dark:bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/60 dark:border-white/10 h-[240px] shadow-sm"
            >
                <p className="text-sm font-bold text-foreground mb-3">Task Activity by Day</p>
                <ResponsiveContainer width="100%" height="82%">
                    <BarChart data={stats.chartData.length > 0 ? stats.chartData : [{ name: 'Today', value: 0 }]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            <div className="grid grid-cols-2 gap-3.5">
                <motion.div 
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/65 dark:bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/60 dark:border-white/10 flex flex-col items-center shadow-sm"
                >
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Completion Status</p>
                    <div className="h-[95px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip content={<CustomPieTooltip />} />
                                <Pie 
                                    data={stats.pieData} 
                                    innerRadius={26} 
                                    outerRadius={38} 
                                    paddingAngle={4} 
                                    dataKey="value"
                                >
                                    {stats.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-muted-foreground">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />Done ({stats.completed})</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#38bdf8]" />Left ({stats.pending})</span>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white/65 dark:bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/60 dark:border-white/10 flex flex-col items-center shadow-sm"
                >
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Punctuality</p>
                    <div className="h-[95px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip content={<CustomPieTooltip />} />
                                <Pie 
                                    data={stats.punctualityData} 
                                    innerRadius={26} 
                                    outerRadius={38} 
                                    paddingAngle={4} 
                                    dataKey="value"
                                >
                                    {stats.punctualityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-muted-foreground">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10b981]" />On-time</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f43f5e]" />Late</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
