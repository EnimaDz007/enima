import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Clock, 
  Target, 
  TrendingUp, 
  Zap, 
  Edit3, 
  Check, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTask } from '../context/TaskContext';

export const DailyStatsBar: React.FC = () => {
  const {
    todayTasks,
    todayCompletedCount,
    todayTotalCount,
    todayCompletionRate,
    urgentHighTotal,
    urgentHighCompleted,
    urgentHighRate,
    totalEstimatedHours,
    completedEstimatedHours,
    streakDays,
    dailyGoal,
    setDailyGoal,
    dailyGoalCompleted,
    setDailyGoalCompleted,
    quickWinsCount,
  } = useTask();

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalText, setGoalText] = useState(dailyGoal);

  const handleSaveGoal = () => {
    if (goalText.trim()) {
      setDailyGoal(goalText.trim());
    }
    setIsEditingGoal(false);
  };

  const handleToggleGoal = () => {
    const next = !dailyGoalCompleted;
    setDailyGoalCompleted(next);
    if (next) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Today's Completion */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Today's Progress</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{todayCompletionRate}%</span>
            <span className="text-xs text-slate-500 font-medium">
              ({todayCompletedCount}/{todayTotalCount} tasks)
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${todayCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Priority Velocity (Urgent & High) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">High Priority Velocity</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{urgentHighRate}%</span>
            <span className="text-xs text-slate-500 font-medium">
              ({urgentHighCompleted}/{urgentHighTotal} urgent/high)
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${urgentHighRate}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Time Planned vs Completed */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Focus Hours Logged</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{completedEstimatedHours}h</span>
            <span className="text-xs text-slate-500 font-medium">
              of {totalEstimatedHours}h planned
            </span>
          </div>
          <div className="mt-2.5 flex items-center space-x-1.5 text-xs text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{quickWinsCount} quick wins completed (&lt;30m)</span>
          </div>
        </div>

        {/* Metric 4: Daily Momentum Streak */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Momentum Streak</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{streakDays} Days</span>
            <span className="text-xs text-amber-600 font-bold">On Fire 🔥</span>
          </div>
          <div className="mt-2.5 flex items-center space-x-1 text-xs text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>+14% velocity vs last week</span>
          </div>
        </div>
      </div>

      {/* Daily Focus Goal Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center space-x-3">
            <button
              id="btn-toggle-daily-goal"
              onClick={handleToggleGoal}
              className={`w-6 h-6 rounded-lg flex items-center justify-center border transition shrink-0 cursor-pointer mt-0.5 sm:mt-0 ${
                dailyGoalCompleted
                  ? 'bg-emerald-500 border-emerald-400 text-white'
                  : 'border-white/40 hover:border-white text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                  <Target className="w-3 h-3" /> Today's Primary Focus Goal
                </span>
                {dailyGoalCompleted && (
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Achieved!
                  </span>
                )}
              </div>

              {isEditingGoal ? (
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="text"
                    value={goalText}
                    onChange={e => setGoalText(e.target.value)}
                    className="bg-white/10 text-white placeholder-white/40 px-2.5 py-1 rounded-lg text-sm border border-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-400 w-full max-w-md"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveGoal();
                      if (e.key === 'Escape') setIsEditingGoal(false);
                    }}
                  />
                  <button
                    onClick={handleSaveGoal}
                    className="px-2.5 py-1 bg-white text-slate-900 rounded-lg text-xs font-semibold hover:bg-slate-100"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p
                  className={`text-sm font-medium mt-0.5 cursor-pointer hover:text-indigo-200 transition ${
                    dailyGoalCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                  }`}
                  onClick={() => setIsEditingGoal(true)}
                  title="Click to edit today's focus goal"
                >
                  "{dailyGoal}"
                </p>
              )}
            </div>
          </div>

          <button
            id="btn-edit-daily-goal"
            onClick={() => setIsEditingGoal(!isEditingGoal)}
            className="self-end sm:self-center text-xs text-indigo-200 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 transition cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditingGoal ? 'Cancel' : 'Edit Goal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
