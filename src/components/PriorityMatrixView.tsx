import React from 'react';
import { 
  Plus, 
  Flame, 
  Calendar, 
  Users, 
  Archive, 
  Search, 
  Filter, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { EisenhowerQuadrant, TaskPriority } from '../types';

export const PriorityMatrixView: React.FC = () => {
  const {
    tasks,
    openNewTaskModal,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
  } = useTask();

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;
    if (filterStatus === 'active' && task.status === 'completed') return false;
    if (filterStatus === 'completed' && task.status !== 'completed') return false;
    return true;
  });

  const getQuadrantTasks = (quadrant: EisenhowerQuadrant) => {
    return filteredTasks.filter(t => t.quadrant === quadrant);
  };

  const q1Tasks = getQuadrantTasks('do_first');
  const q2Tasks = getQuadrantTasks('schedule');
  const q3Tasks = getQuadrantTasks('delegate');
  const q4Tasks = getQuadrantTasks('eliminate');

  const categories = ['all', 'Engineering', 'Product', 'Marketing', 'Design', 'Client', 'Operations', 'Personal'];

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="input-matrix-search"
            type="text"
            placeholder="Search tasks by title or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="select-matrix-filter-category"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterStatus === 'active' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterStatus === 'completed' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Eisenhower 4-Quadrant Matrix Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quadrant 1: DO FIRST */}
        <div className="bg-white rounded-2xl border-2 border-rose-200 shadow-xs overflow-hidden flex flex-col">
          {/* Quadrant Header */}
          <div className="p-4 bg-gradient-to-r from-rose-50/90 to-rose-50/40 border-b border-rose-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Q1 • DO FIRST</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                    Urgent & Important
                  </span>
                </div>
                <p className="text-xs text-rose-800/80">Immediate deadlines, critical blockers, executive syncs</p>
              </div>
            </div>

            <button
              id="btn-add-q1"
              onClick={() => openNewTaskModal('do_first', 'urgent')}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Task List */}
          <div className="p-4 space-y-3 flex-1 min-h-[160px] max-h-[480px] overflow-y-auto">
            {q1Tasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-rose-100 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-rose-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No urgent fires right now!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">All critical items are cleared or completed.</p>
              </div>
            ) : (
              q1Tasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </div>

        {/* Quadrant 2: SCHEDULE */}
        <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-xs overflow-hidden flex flex-col">
          {/* Quadrant Header */}
          <div className="p-4 bg-gradient-to-r from-amber-50/90 to-amber-50/40 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Q2 • SCHEDULE</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Important & Not Urgent
                  </span>
                </div>
                <p className="text-xs text-amber-800/80">Architecture, strategy, planning, relationships, health</p>
              </div>
            </div>

            <button
              id="btn-add-q2"
              onClick={() => openNewTaskModal('schedule', 'high')}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Task List */}
          <div className="p-4 space-y-3 flex-1 min-h-[160px] max-h-[480px] overflow-y-auto">
            {q2Tasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-amber-100 rounded-xl">
                <Sparkles className="w-8 h-8 text-amber-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No scheduled strategic tasks</p>
                <p className="text-[11px] text-slate-400 mt-0.5">High performers spend 60%+ of their time here.</p>
              </div>
            ) : (
              q2Tasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </div>

        {/* Quadrant 3: DELEGATE */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-xs overflow-hidden flex flex-col">
          {/* Quadrant Header */}
          <div className="p-4 bg-gradient-to-r from-blue-50/90 to-blue-50/40 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Q3 • DELEGATE</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Urgent & Not Important
                  </span>
                </div>
                <p className="text-xs text-blue-800/80">Support inquiries, routine coordination, fast track handoffs</p>
              </div>
            </div>

            <button
              id="btn-add-q3"
              onClick={() => openNewTaskModal('delegate', 'medium')}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Task List */}
          <div className="p-4 space-y-3 flex-1 min-h-[160px] max-h-[480px] overflow-y-auto">
            {q3Tasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-blue-100 rounded-xl">
                <Users className="w-8 h-8 text-blue-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No delegated tasks</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Automate or pass to team members when possible.</p>
              </div>
            ) : (
              q3Tasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </div>

        {/* Quadrant 4: ELIMINATE / BACKLOG */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Quadrant Header */}
          <div className="p-4 bg-gradient-to-r from-slate-100/90 to-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center font-bold shadow-xs">
                <Archive className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Q4 • ELIMINATE</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">
                    Not Urgent & Not Important
                  </span>
                </div>
                <p className="text-xs text-slate-600">Time wasters, low-yield trivia, candidate for pruning</p>
              </div>
            </div>

            <button
              id="btn-add-q4"
              onClick={() => openNewTaskModal('eliminate', 'low')}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Task List */}
          <div className="p-4 space-y-3 flex-1 min-h-[160px] max-h-[480px] overflow-y-auto">
            {q4Tasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
                <Archive className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">Backlog is clean!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Low-yield activities have been purged.</p>
              </div>
            ) : (
              q4Tasks.map(task => <TaskCard key={task.id} task={task} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
