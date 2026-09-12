import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Task, EisenhowerQuadrant, TaskPriority, TaskCategory, DashboardTab } from '../types';
import { INITIAL_TASKS } from '../data/mockTasks';
import { playCompletionSound } from '../utils/audio';

interface TaskContextType {
  tasks: Task[];
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  moveTaskQuadrant: (id: string, quadrant: EisenhowerQuadrant) => void;
  
  // Tabs and Filters
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Daily Goal & Streak
  dailyGoal: string;
  setDailyGoal: (goal: string) => void;
  dailyGoalCompleted: boolean;
  setDailyGoalCompleted: (completed: boolean) => void;
  streakDays: number;

  // Modals & Active Task
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  openNewTaskModal: (defaultQuadrant?: EisenhowerQuadrant, defaultPriority?: TaskPriority) => void;
  defaultQuadrant: EisenhowerQuadrant;
  defaultPriority: TaskPriority;

  // Computed Progress
  todayTasks: Task[];
  todayCompletedCount: number;
  todayTotalCount: number;
  todayCompletionRate: number;
  urgentHighTotal: number;
  urgentHighCompleted: number;
  urgentHighRate: number;
  totalEstimatedHours: number;
  completedEstimatedHours: number;
  quickWinsCount: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TASKS_STORAGE_KEY = 'taskflow_tasks_list';
const GOAL_STORAGE_KEY = 'taskflow_daily_goal';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_TASKS;
  });

  const [activeTab, setActiveTab] = useState<DashboardTab>('matrix');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [dailyGoal, setDailyGoal] = useState<string>(() => {
    return localStorage.getItem(GOAL_STORAGE_KEY) || 'Ship authentication regression fix and review Q3 executive deck';
  });
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState<boolean>(false);
  const [streakDays] = useState<number>(5);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultQuadrant, setDefaultQuadrant] = useState<EisenhowerQuadrant>('do_first');
  const [defaultPriority, setDefaultPriority] = useState<TaskPriority>('urgent');

  // Persistence
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(GOAL_STORAGE_KEY, dailyGoal);
  }, [dailyGoal]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setIsTaskModalOpen(false);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          if (nextStatus === 'completed') {
            playCompletionSound();
          }
          return {
            ...t,
            status: nextStatus as Task['status'],
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });

      // Check if all today's tasks are now completed
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRemaining = updated.filter(t => t.dueDate === todayStr && t.status !== 'completed');
      if (todayRemaining.length === 0 && updated.some(t => t.dueDate === todayStr)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      return updated;
    });
  }, []);

  const moveTaskQuadrant = useCallback((id: string, quadrant: EisenhowerQuadrant) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        let newPriority = t.priority;
        if (quadrant === 'do_first') newPriority = 'urgent';
        else if (quadrant === 'schedule') newPriority = 'high';
        else if (quadrant === 'delegate') newPriority = 'medium';
        else if (quadrant === 'eliminate') newPriority = 'low';
        return { ...t, quadrant, priority: newPriority };
      }
      return t;
    }));
  }, []);

  const openNewTaskModal = useCallback((quadrant: EisenhowerQuadrant = 'do_first', priority: TaskPriority = 'urgent') => {
    setEditingTask(null);
    setDefaultQuadrant(quadrant);
    setDefaultPriority(priority);
    setIsTaskModalOpen(true);
  }, []);

  // Computed today's metrics
  const todayStr = new Date().toISOString().split('T')[0];

  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.dueDate === todayStr);
  }, [tasks, todayStr]);

  const todayTotalCount = todayTasks.length;
  const todayCompletedCount = todayTasks.filter(t => t.status === 'completed').length;
  const todayCompletionRate = todayTotalCount > 0 ? Math.round((todayCompletedCount / todayTotalCount) * 100) : 0;

  // Urgent & High priority velocity
  const urgentHighTasks = useMemo(() => {
    return tasks.filter(t => t.priority === 'urgent' || t.priority === 'high');
  }, [tasks]);

  const urgentHighTotal = urgentHighTasks.length;
  const urgentHighCompleted = urgentHighTasks.filter(t => t.status === 'completed').length;
  const urgentHighRate = urgentHighTotal > 0 ? Math.round((urgentHighCompleted / urgentHighTotal) * 100) : 0;

  // Estimated hours
  const totalEstimatedHours = useMemo(() => {
    const totalMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0);
    return Math.round((totalMinutes / 60) * 10) / 10;
  }, [tasks]);

  const completedEstimatedHours = useMemo(() => {
    const completedMinutes = tasks
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + (t.estimatedMinutes || 30), 0);
    return Math.round((completedMinutes / 60) * 10) / 10;
  }, [tasks]);

  // Quick wins: completed tasks under 30 mins
  const quickWinsCount = useMemo(() => {
    return tasks.filter(t => t.status === 'completed' && t.estimatedMinutes <= 30).length;
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        moveTaskQuadrant,
        activeTab,
        setActiveTab,
        filterPriority,
        setFilterPriority,
        filterCategory,
        setFilterCategory,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        dailyGoal,
        setDailyGoal,
        dailyGoalCompleted,
        setDailyGoalCompleted,
        streakDays,
        isTaskModalOpen,
        setIsTaskModalOpen,
        editingTask,
        setEditingTask,
        openNewTaskModal,
        defaultQuadrant,
        defaultPriority,
        todayTasks,
        todayCompletedCount,
        todayTotalCount,
        todayCompletionRate,
        urgentHighTotal,
        urgentHighCompleted,
        urgentHighRate,
        totalEstimatedHours,
        completedEstimatedHours,
        quickWinsCount,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
