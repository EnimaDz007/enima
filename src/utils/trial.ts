import { TrialState, User } from '../types';

export const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; // 259,200,000 ms

export function calculateTrialState(user: User | null): TrialState {
  if (!user) {
    return {
      isActive: false,
      isExpired: true,
      isPro: false,
      totalDurationMs: THREE_DAYS_MS,
      elapsedMs: THREE_DAYS_MS,
      remainingMs: 0,
      remainingDays: 0,
      remainingHours: 0,
      remainingMinutes: 0,
      percentElapsed: 100,
      percentRemaining: 0,
      formattedRemaining: 'No session',
    };
  }

  if (user.isPro || user.plan !== 'trial') {
    return {
      isActive: true,
      isExpired: false,
      isPro: true,
      totalDurationMs: THREE_DAYS_MS,
      elapsedMs: 0,
      remainingMs: Infinity,
      remainingDays: 999,
      remainingHours: 999,
      remainingMinutes: 999,
      percentElapsed: 0,
      percentRemaining: 100,
      formattedRemaining: 'Pro Unlimited',
    };
  }

  const now = Date.now();
  const start = new Date(user.trialStartDate).getTime();
  const end = new Date(user.trialEndDate).getTime();
  const total = end - start > 0 ? end - start : THREE_DAYS_MS;

  const remainingMs = Math.max(0, end - now);
  const elapsedMs = Math.min(total, Math.max(0, now - start));
  const isExpired = remainingMs <= 0;
  const isActive = !isExpired;

  const remainingTotalSeconds = Math.floor(remainingMs / 1000);
  const remainingDays = Math.floor(remainingTotalSeconds / (3600 * 24));
  const remainingHours = Math.floor((remainingTotalSeconds % (3600 * 24)) / 3600);
  const remainingMinutes = Math.floor((remainingTotalSeconds % 3600) / 60);

  const percentElapsed = Math.min(100, Math.max(0, Math.round((elapsedMs / total) * 100)));
  const percentRemaining = Math.max(0, 100 - percentElapsed);

  let formattedRemaining = '';
  if (isExpired) {
    formattedRemaining = 'Trial Expired';
  } else if (remainingDays > 0) {
    formattedRemaining = `${remainingDays}d ${remainingHours}h remaining`;
  } else if (remainingHours > 0) {
    formattedRemaining = `${remainingHours}h ${remainingMinutes}m remaining`;
  } else {
    formattedRemaining = `${remainingMinutes}m remaining`;
  }

  return {
    isActive,
    isExpired,
    isPro: false,
    totalDurationMs: total,
    elapsedMs,
    remainingMs,
    remainingDays,
    remainingHours,
    remainingMinutes,
    percentElapsed,
    percentRemaining,
    formattedRemaining,
  };
}

export function createTrialTimestamps() {
  const now = new Date();
  const endDate = new Date(now.getTime() + THREE_DAYS_MS);
  return {
    trialStartDate: now.toISOString(),
    trialEndDate: endDate.toISOString(),
  };
}
