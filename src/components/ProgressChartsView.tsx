import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  Award, 
  Clock, 
  Target, 
  Sparkles, 
  CheckCircle2,
  Layers
} from 'lucide-react';
import { useTask } from '../context/TaskContext';

export const ProgressChartsView: React.FC = () => {
  const { tasks, todayCompletionRate, urgentHighRate, totalEstimatedHours, completedEstimatedHours, streakDays } = useTask();

  // 1. Weekly completion data (7 days)
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Mock realistic past 6 days + today's live data
    return [
      { day: 'Mon', planned: 7, completed: 6, velocity: 85 },
      { day: 'Tue', planned: 8, completed: 7, velocity: 88 },
      { day: 'Wed', planned: 6, completed: 6, velocity: 100 },
      { day: 'Thu', planned: 9, completed: 8, velocity: 89 },
      { day: 'Fri', planned: 8, completed: 5, velocity: 63 },
      { day: 'Sat', planned: 4, completed: 4, velocity: 100 },
      { 
        day: 'Today', 
        planned: tasks.length || 8, 
        completed: tasks.filter(t => t.status === 'completed').length, 
        velocity: todayCompletionRate 
      },
    ];
  }, [tasks, todayCompletionRate]);

  // 2. Priority breakdown data
  const priorityData = useMemo(() => {
    const counts = { urgent: 0, high: 0, medium: 0, low: 0 };
    tasks.forEach(t => {
      if (counts[t.priority] !== undefined) {
        counts[t.priority]++;
      }
    });

    return [
      { name: 'Urgent', value: counts.urgent || 1, color: '#f43f5e' },
      { name: 'High', value: counts.high || 1, color: '#f59e0b' },
      { name: 'Medium', value: counts.medium || 1, color: '#3b82f6' },
      { name: 'Low', value: counts.low || 1, color: '#94a3b8' },
    ];
  }, [tasks]);

  // 3. Category distribution
  const categoryData = useMemo(() => {
    const map: Record<string, { planned: number; completed: number }> = {};
    tasks.forEach(t => {
      if (!map[t.category]) {
        map[t.category] = { planned: 0, completed: 0 };
      }
      map[t.category].planned++;
      if (t.status === 'completed') {
        map[t.category].completed++;
      }
    });

    return Object.entries(map).map(([name, data]) => ({
      category: name,
      planned: data.planned,
      completed: data.completed,
    }));
  }, [tasks]);

  // High impact ratio: tasks with impactScore >= 4
  const highImpactTasks = tasks.filter(t => t.impactScore >= 4);
  const highImpactCompleted = highImpactTasks.filter(t => t.status === 'completed').length;
  const highImpactRatio = highImpactTasks.length > 0
    ? Math.round((highImpactCompleted / highImpactTasks.length) * 100)
    : 0;

  // Export tasks as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Productivity & Progress Analytics</h2>
          <p className="text-xs text-slate-500">
            Real-time daily velocity, Eisenhower distribution, and category focus trends.
          </p>
        </div>

        <button
          id="btn-export-analytics-json"
          onClick={handleExportJSON}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Data (JSON)</span>
        </button>
      </div>

      {/* 4 Analytics Highlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Weekly Velocity</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">87.4%</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Consistent high completion rate</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>High Impact Delivery</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{highImpactRatio}%</div>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">
            {highImpactCompleted} of {highImpactTasks.length} high-impact items
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Hours Logged</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{completedEstimatedHours}h</div>
          <p className="text-[11px] text-slate-500 mt-1">of {totalEstimatedHours}h planned focus</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Active Streak</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{streakDays} Days</div>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Daily goals consistently hit</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: 7-Day Planned vs Completed Bar Chart (Takes 2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">7-Day Task Completion Trend</h3>
              <p className="text-xs text-slate-500">Planned deliverables vs executed tasks this week</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="text-slate-600">Planned</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span className="text-slate-600 font-semibold">Completed</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="planned" fill="#e2e8f0" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="completed" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Priority Distribution Donut */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm">Priority Distribution</h3>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-4">Breakdown across priority levels</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {priorityData.map(item => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown Bar Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <h3 className="font-bold text-slate-900 text-sm mb-1">Workload Allocation by Category</h3>
        <p className="text-xs text-slate-500 mb-4">Tracking task volume across product, engineering, design, and clients</p>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="planned" name="Total Planned" fill="#cbd5e1" radius={[0, 4, 4, 0]} maxBarSize={18} />
              <Bar dataKey="completed" name="Completed" fill="#3b82f6" radius={[0, 4, 4, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
