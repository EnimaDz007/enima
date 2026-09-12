import React from 'react';
import { 
  Check, 
  Clock, 
  Calendar, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  ArrowRightLeft, 
  Sparkles,
  Zap
} from 'lucide-react';
import { Task, EisenhowerQuadrant } from '../types';
import { useTask } from '../context/TaskContext';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, compact = false }) => {
  const { toggleTaskStatus, deleteTask, setEditingTask, setIsTaskModalOpen, moveTaskQuadrant } = useTask();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const priorityColors = {
    urgent: 'bg-rose-50 text-rose-700 border-rose-200',
    high: 'bg-amber-50 text-amber-800 border-amber-200',
    medium: 'bg-blue-50 text-blue-700 border-blue-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const priorityLabels = {
    urgent: 'Urgent',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  const isCompleted = task.status === 'completed';

  const todayStr = new Date().toISOString().split('T')[0];
  const isDueToday = task.dueDate === todayStr;
  const isOverdue = task.dueDate < todayStr && !isCompleted;

  const handleEdit = () => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
    setMenuOpen(false);
  };

  const quadrants: { id: EisenhowerQuadrant; label: string }[] = [
    { id: 'do_first', label: '1. Do First' },
    { id: 'schedule', label: '2. Schedule' },
    { id: 'delegate', label: '3. Delegate' },
    { id: 'eliminate', label: '4. Eliminate' },
  ];

  return (
    <div
      className={`group relative rounded-xl border transition-all ${
        isCompleted
          ? 'bg-slate-50/70 border-slate-200/80 opacity-75'
          : 'bg-white border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300'
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Status Checkbox */}
        <button
          id={`task-toggle-${task.id}`}
          onClick={() => toggleTaskStatus(task.id)}
          className={`w-5 h-5 rounded-md flex items-center justify-center border transition shrink-0 mt-0.5 cursor-pointer ${
            isCompleted
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-300 hover:border-indigo-600 text-transparent hover:bg-slate-50'
          }`}
          title={isCompleted ? 'Mark as todo' : 'Mark as completed'}
        >
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                priorityColors[task.priority]
              }`}
            >
              {priorityLabels[task.priority]}
            </span>

            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
              {task.category}
            </span>

            {isOverdue && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                Overdue
              </span>
            )}
            {isDueToday && !isCompleted && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                Due Today
              </span>
            )}
          </div>

          <h4
            onClick={handleEdit}
            className={`text-sm font-semibold cursor-pointer transition ${
              isCompleted
                ? 'line-through text-slate-400'
                : 'text-slate-900 group-hover:text-indigo-600'
            }`}
          >
            {task.title}
          </h4>

          {task.description && !compact && (
            <p
              onClick={handleEdit}
              className={`text-xs mt-1 line-clamp-2 cursor-pointer ${
                isCompleted ? 'text-slate-400 line-through' : 'text-slate-500'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Meta bottom */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1" title="Estimated Time">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{task.estimatedMinutes}m</span>
              </div>

              <div className="flex items-center space-x-1" title="Due Date">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{task.dueDate}</span>
              </div>

              {task.impactScore && (
                <div
                  className="hidden sm:flex items-center space-x-1 text-[11px] text-indigo-600 font-medium"
                  title={`Impact: ${task.impactScore}/5, Effort: ${task.effortScore}/5`}
                >
                  <Zap className="w-3 h-3" />
                  <span>I:{task.impactScore}/E:{task.effortScore}</span>
                </div>
              )}
            </div>

            {/* Actions button */}
            <div className="relative">
              <button
                id={`task-menu-btn-${task.id}`}
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 animate-in fade-in"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Task</span>
                  </button>

                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Move Quadrant
                  </div>
                  {quadrants.map(q => (
                    <button
                      key={q.id}
                      onClick={() => {
                        moveTaskQuadrant(task.id, q.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-3 py-1 text-xs hover:bg-slate-50 text-left ${
                        task.quadrant === q.id ? 'font-bold text-indigo-600' : 'text-slate-600'
                      }`}
                    >
                      <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                      <span>{q.label}</span>
                    </button>
                  ))}

                  <div className="my-1 border-t border-slate-100"></div>

                  <button
                    onClick={() => {
                      deleteTask(task.id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Task</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
