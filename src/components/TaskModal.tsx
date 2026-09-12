import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { TaskPriority, TaskCategory, EisenhowerQuadrant, TaskStatus } from '../types';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    setEditingTask,
    addTask,
    updateTask,
    defaultQuadrant,
    defaultPriority,
  } = useTask();

  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('urgent');
  const [quadrant, setQuadrant] = useState<EisenhowerQuadrant>('do_first');
  const [category, setCategory] = useState<TaskCategory>('Product');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [dueDate, setDueDate] = useState<string>(todayStr);
  const [impactScore, setImpactScore] = useState<number>(4);
  const [effortScore, setEffortScore] = useState<number>(2);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setQuadrant(editingTask.quadrant);
      setCategory(editingTask.category);
      setStatus(editingTask.status);
      setEstimatedMinutes(editingTask.estimatedMinutes || 30);
      setDueDate(editingTask.dueDate || todayStr);
      setImpactScore(editingTask.impactScore || 3);
      setEffortScore(editingTask.effortScore || 2);
    } else {
      setTitle('');
      setDescription('');
      setPriority(defaultPriority);
      setQuadrant(defaultQuadrant);
      setCategory('Product');
      setStatus('todo');
      setEstimatedMinutes(30);
      setDueDate(todayStr);
      setImpactScore(4);
      setEffortScore(2);
    }
    setError('');
  }, [editingTask, isTaskModalOpen, defaultQuadrant, defaultPriority, todayStr]);

  if (!isTaskModalOpen) return null;

  const handlePriorityChange = (p: TaskPriority) => {
    setPriority(p);
    // Align quadrant with priority intuitively
    if (p === 'urgent') setQuadrant('do_first');
    else if (p === 'high') setQuadrant('schedule');
    else if (p === 'medium') setQuadrant('delegate');
    else if (p === 'low') setQuadrant('eliminate');
  };

  const handleQuadrantChange = (q: EisenhowerQuadrant) => {
    setQuadrant(q);
    if (q === 'do_first') setPriority('urgent');
    else if (q === 'schedule') setPriority('high');
    else if (q === 'delegate') setPriority('medium');
    else if (q === 'eliminate') setPriority('low');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title');
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        quadrant,
        category,
        status,
        estimatedMinutes,
        dueDate,
        impactScore,
        effortScore,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        quadrant,
        category,
        status,
        estimatedMinutes,
        dueDate,
        impactScore,
        effortScore,
      });
    }
  };

  const categories: TaskCategory[] = [
    'Engineering',
    'Product',
    'Marketing',
    'Design',
    'Client',
    'Operations',
    'Personal',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {editingTask ? 'Edit Task Priority & Details' : 'Create New Priority Task'}
            </h3>
          </div>
          <button
            id="btn-close-task-modal"
            onClick={() => {
              setIsTaskModalOpen(false);
              setEditingTask(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-task-title"
              type="text"
              placeholder="e.g. Conduct user research interviews for MVP launch"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
            <textarea
              id="input-task-desc"
              rows={2}
              placeholder="Key deliverables, context, or acceptance criteria..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Priority Matrix Quadrant */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Eisenhower Quadrant & Priority
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuadrantChange('do_first')}
                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                  quadrant === 'do_first'
                    ? 'border-rose-500 bg-rose-50/70 text-rose-900 ring-2 ring-rose-200 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span className="font-bold">1. Do First</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Urgent & Important</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuadrantChange('schedule')}
                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                  quadrant === 'schedule'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 ring-2 ring-amber-200 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="font-bold">2. Schedule</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Not Urgent & Important</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuadrantChange('delegate')}
                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                  quadrant === 'delegate'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-200 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="font-bold">3. Delegate</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Urgent & Not Important</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuadrantChange('eliminate')}
                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                  quadrant === 'eliminate'
                    ? 'border-slate-500 bg-slate-100 text-slate-900 ring-2 ring-slate-200 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span className="font-bold">4. Eliminate</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Not Urgent / Backlog</p>
              </button>
            </div>
          </div>

          {/* Row: Category & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                id="select-task-category"
                value={category}
                onChange={e => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                id="select-task-status"
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Row: Estimated Time & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Minutes
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="input-task-minutes"
                  type="number"
                  min="5"
                  step="5"
                  value={estimatedMinutes}
                  onChange={e => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <span className="text-xs text-slate-500 font-medium">mins</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
              <input
                id="input-task-due"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Impact vs Effort sliders */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Impact vs Effort Rating</span>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                Value Ratio: {(impactScore / (effortScore || 1)).toFixed(1)}x
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Impact:</span>
                  <span className="font-bold text-indigo-600">{impactScore}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={impactScore}
                  onChange={e => setImpactScore(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Effort:</span>
                  <span className="font-bold text-slate-700">{effortScore}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={effortScore}
                  onChange={e => setEffortScore(Number(e.target.value))}
                  className="w-full accent-slate-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsTaskModalOpen(false);
                setEditingTask(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              id="btn-save-task"
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              {editingTask ? 'Update Task' : 'Add to Matrix'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
