import React from 'react';
import { 
  Sun, 
  SunMedium, 
  Moon, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { TaskCard } from './TaskCard';

export const DailyTimelineView: React.FC = () => {
  const { todayTasks, openNewTaskModal, todayCompletionRate, todayCompletedCount } = useTask();

  // Split tasks into Morning, Afternoon, and Evening blocks
  const morningTasks = todayTasks.filter(t => t.priority === 'urgent');
  const afternoonTasks = todayTasks.filter(t => t.priority === 'high' || t.priority === 'medium');
  const eveningTasks = todayTasks.filter(t => t.priority === 'low' || (t.status === 'completed' && t.priority !== 'urgent'));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Today's Daily Schedule & Focus Blocks</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured daily flow matching your energy levels to priority matrix tiers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Today's Pacing</span>
            <div className="text-sm font-bold text-indigo-600">
              {todayCompletedCount}/{todayTasks.length} Completed ({todayCompletionRate}%)
            </div>
          </div>
          <button
            onClick={() => openNewTaskModal('do_first', 'urgent')}
            className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add for Today</span>
          </button>
        </div>
      </div>

      {/* 3 Time Block Sections */}
      <div className="space-y-6">
        {/* Block 1: Morning Deep Work */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-sm">Morning Peak Focus (9:00 AM – 12:00 PM)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Deep Work
                  </span>
                </div>
                <p className="text-xs text-slate-500">Highest cognitive load • Urgent items & Q1 deliverables</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {morningTasks.length} {morningTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <div className="p-4">
            {morningTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No urgent morning focus tasks scheduled.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {morningTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Block 2: Afternoon Execution */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <SunMedium className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-sm">Afternoon Execution & Sync (1:00 PM – 4:00 PM)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    High & Medium
                  </span>
                </div>
                <p className="text-xs text-slate-500">Cross-functional collaboration, customer tickets & strategic scheduling</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {afternoonTasks.length} {afternoonTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <div className="p-4">
            {afternoonTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No afternoon tasks scheduled.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {afternoonTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Block 3: Evening Wrap-up & Quick Wins */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-700 text-white flex items-center justify-center font-bold shadow-xs">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-sm">Evening Review & Wind Down (4:00 PM – 6:00 PM)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    Quick Wins
                  </span>
                </div>
                <p className="text-xs text-slate-500">Inbox zero, quick wins (&lt;20m), and daily goal reflection</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {eveningTasks.length} {eveningTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <div className="p-4">
            {eveningTasks.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No evening wrap-up items.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {eveningTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
