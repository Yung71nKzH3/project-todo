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
            { name: 'Pending', value: pending.length, color: '#cbd5e1' }
        ];

        const punctualityData = [
            { name: 'On-time', value: onTime.length, color: '#10b981' },
            { name: 'Late', value: late, color: '#ef4444' }
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
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/40 dark:bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/60 dark:border-white/10 text-center"
                >
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">On-Time Rate</p>
                    <p className="text-2xl font-bold text-emerald-500">
                        {stats.onTimeRate}%
                    </p>
                </motion.div>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/40 dark:bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/60 dark:border-white/10 text-center"
                >
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Avg. Time</p>
                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats.avgCompletionTime}h</p>
                </motion.div>
            </div>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/40 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/60 dark:border-white/10 h-[250px]"
            >
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Task Activity</p>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.1} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/40 dark:bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/60 dark:border-white/10 flex flex-col items-center"
                >
                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Status</p>
                    <div className="h-[100px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={stats.pieData} innerRadius={25} outerRadius={35} paddingAngle={5} dataKey="value">
                                    {stats.pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/40 dark:bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/60 dark:border-white/10 flex flex-col items-center"
                >
                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Punctuality</p>
                    <div className="h-[100px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={stats.punctualityData} innerRadius={25} outerRadius={35} paddingAngle={5} dataKey="value">
                                    {stats.punctualityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
