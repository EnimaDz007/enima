export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export type TaskCategory = 
  | 'Engineering' 
  | 'Product' 
  | 'Marketing' 
  | 'Design' 
  | 'Client' 
  | 'Operations' 
  | 'Personal';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type EisenhowerQuadrant = 'do_first' | 'schedule' | 'delegate' | 'eliminate';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  quadrant: EisenhowerQuadrant;
  estimatedMinutes: number;
  dueDate: string; // YYYY-MM-DD
  impactScore: number; // 1 to 5
  effortScore: number; // 1 to 5
  createdAt: string;
  completedAt?: string;
  assignedTo?: string;
}

export type PlanType = 'trial' | 'starter' | 'pro' | 'enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: PlanType;
  trialStartDate: string; // ISO String
  trialEndDate: string;   // ISO String (trialStartDate + 3 days)
  isPro: boolean;
  createdAt: string;
}

export interface TrialState {
  isActive: boolean;
  isExpired: boolean;
  isPro: boolean;
  totalDurationMs: number; // 72 hours in ms
  elapsedMs: number;
  remainingMs: number;
  remainingDays: number;
  remainingHours: number;
  remainingMinutes: number;
  percentElapsed: number;
  percentRemaining: number;
  formattedRemaining: string;
}

export type DashboardTab = 'matrix' | 'list' | 'analytics' | 'schedule';
