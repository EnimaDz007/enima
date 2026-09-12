import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUpDown, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight,
  Flame,
  Zap,
  Clock
} from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { TaskPriority, Task } from '../types';

export const PriorityListView: React.FC = () => {
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

  const [sortBy, setSortBy] = useState<'priority' | 'due' | 'impact' | 'duration'>('priority');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (priority: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [priority]: !prev[priority],
    }));
  };

  // Filter tasks
  const filtered = tasks.filter(task => {
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

  // Sort tasks
  const sortedTasks = [...filtered].sort((a, b) => {
    if (sortBy === 'due') {
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    }
    if (sortBy === 'impact') {
      const ratioA = (a.impactScore || 1) / (a.effortScore || 1);
      const ratioB = (b.impactScore || 1) / (b.effortScore || 1);
      return ratioB - ratioA;
    }
    if (sortBy === 'duration') {
      return (a.estimatedMinutes || 0) - (b.estimatedMinutes || 0);
    }
    // Default priority order: urgent -> high -> medium -> low
    const weight = { urgent: 4, high: 3, medium: 2, low: 1 };
    return weight[b.priority] - weight[a.priority];
  });

  const priorityGroups: {
    priority: TaskPriority;
    label: string;
    description: string;
    color: string;
    border: string;
    icon: React.ElementType;
  }[] = [
    {
      priority: 'urgent',
      label: 'Critical & Urgent Deliverables',
      description: 'Require immediate attention today',
      color: 'text-rose-700 bg-rose-50',
      border: 'border-rose-200',
      icon: Flame,
    },
    {
      priority: 'high',
      label: 'High Priority (Important)',
      description: 'Strategic objectives and high leverage projects',
      color: 'text-amber-800 bg-amber-50',
      border: 'border-amber-200',
      icon: Zap,
    },
    {
      priority: 'medium',
      label: 'Medium Priority',
      description: 'Routine maintenance, tickets, and follow-ups',
      color: 'text-blue-700 bg-blue-50',
      border: 'border-blue-200',
      icon: Clock,
    },
    {
      priority: 'low',
      label: 'Low Priority / Someday',
      description: 'Nice-to-have experiments and minor backlog',
      color: 'text-slate-700 bg-slate-100',
      border: 'border-slate-200',
      icon: AlertCircle,
    },
  ];

  const categories = ['all', 'Engineering', 'Product', 'Marketing', 'Design', 'Client', 'Operations', 'Personal'];

  return (
    <div className="space-y-4">
      {/* Search, Filter & Sort Controls */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search list..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <select
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

          {/* Sort By */}
          <div className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none text-slate-800"
            >
              <option value="priority">Priority Order</option>
              <option value="due">Due Date</option>
              <option value="impact">Highest Value (Impact/Effort)</option>
              <option value="duration">Shortest Duration</option>
            </select>
          </div>

          <button
            onClick={() => openNewTaskModal()}
            className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Priority Groups */}
      <div className="space-y-4">
        {priorityGroups.map(group => {
          const groupTasks = sortedTasks.filter(t => t.priority === group.priority);
          const completedInGroup = groupTasks.filter(t => t.status === 'completed').length;
          const isCollapsed = collapsedSections[group.priority];
          const Icon = group.icon;

          return (
            <div
              key={group.priority}
              className={`bg-white rounded-2xl border ${group.border} shadow-2xs overflow-hidden`}
            >
              {/* Group Header */}
              <div
                onClick={() => toggleSection(group.priority)}
                className={`p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition border-b ${
                  isCollapsed ? 'border-transparent' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button className="text-slate-400 hover:text-slate-600">
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${group.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-900 text-sm">{group.label}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {groupTasks.length} {groupTasks.length === 1 ? 'task' : 'tasks'}
                      </span>
                      {groupTasks.length > 0 && (
                        <span className="text-xs text-slate-400 hidden sm:inline">
                          • {completedInGroup} completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 hidden sm:block">{group.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      openNewTaskModal(
                        group.priority === 'urgent'
                          ? 'do_first'
                          : group.priority === 'high'
                          ? 'schedule'
                          : group.priority === 'medium'
                          ? 'delegate'
                          : 'eliminate',
                        group.priority
                      );
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition"
                    title={`Add task to ${group.label}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tasks in group */}
              {!isCollapsed && (
                <div className="p-4">
                  {groupTasks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No tasks in this priority tier.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupTasks.map(task => (
                        <TaskCard key={task.id} task={task} compact={false} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
