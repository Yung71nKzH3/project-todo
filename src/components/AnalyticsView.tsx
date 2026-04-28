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

        return {
            total: todos.length,
            completed: completed.length,
            pending: pending.length,
            avgCompletionTime: avgCompletionTime.toFixed(1),
            chartData,
            pieData
        };
    }, [todos]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 text-center"
                >
                    <p className="text-xs font-bold text-gray-500 uppercase">Completion Rate</p>
                    <p className="text-2xl font-bold text-violet-600">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </p>
                </motion.div>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 text-center"
                >
                    <p className="text-xs font-bold text-gray-500 uppercase">Avg. Time</p>
                    <p className="text-2xl font-bold text-violet-600">{stats.avgCompletionTime}h</p>
                </motion.div>
            </div>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/60 h-[250px]"
            >
                <p className="text-sm font-bold text-gray-700 mb-4">Task Creation Activity</p>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/60 flex items-center justify-between"
            >
                <div className="w-1/2 h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.pieData}
                                innerRadius={35}
                                outerRadius={50}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {stats.pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2">
                    <p className="text-sm font-bold text-gray-700">Distribution</p>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-violet-500" />
                        <span className="text-xs text-gray-600">{stats.completed} Done</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                        <span className="text-xs text-gray-600">{stats.pending} Pending</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
