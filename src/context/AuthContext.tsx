import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, TrialState, PlanType } from '../types';
import { calculateTrialState, createTrialTimestamps, THREE_DAYS_MS } from '../utils/trial';

interface AuthContextType {
  user: User | null;
  trialState: TrialState;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  upgradePlan: (plan: PlanType) => void;
  simulateTrial: (scenario: 'day1' | 'day2' | 'day3_urgent' | 'expired' | 'reset_trial' | 'pro') => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showPricingModal: boolean;
  setShowPricingModal: (show: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'taskflow_user_session';

const DEFAULT_DEMO_USER: User = {
  id: 'user_demo_101',
  name: 'Alex Rivera',
  email: 'alex.rivera@company.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  plan: 'trial',
  trialStartDate: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), // 14 hours ago (leaving ~58 hrs / 2.4 days)
  trialEndDate: new Date(Date.now() - 14 * 3600 * 1000 + THREE_DAYS_MS).toISOString(),
  isPro: false,
  createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_DEMO_USER;
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [currentTimeTick, setCurrentTimeTick] = useState<number>(Date.now());

  // Save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // Keep countdown updated every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimeTick(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const trialState = useMemo(() => {
    // CurrentTimeTick ensures fresh calculations
    if (!user) {
      return calculateTrialState(null);
    }
    return calculateTrialState(user);
  }, [user, currentTimeTick]);

  const signup = useCallback((name: string, email: string) => {
    const { trialStartDate, trialEndDate } = createTrialTimestamps();
    const newUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name.trim() || 'New Member',
      email: email.trim().toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'Member')}`,
      plan: 'trial',
      trialStartDate,
      trialEndDate,
      isPro: false,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setShowAuthModal(false);
  }, []);

  const login = useCallback((email: string, name?: string) => {
    // If existing user matching email
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      setShowAuthModal(false);
      return;
    }
    // New login gets a fresh 3-day trial if first time
    const { trialStartDate, trialEndDate } = createTrialTimestamps();
    const loggedUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name || email.split('@')[0] || 'User',
      email: email.trim().toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      plan: 'trial',
      trialStartDate,
      trialEndDate,
      isPro: false,
      createdAt: new Date().toISOString(),
    };
    setUser(loggedUser);
    setShowAuthModal(false);
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setShowAuthModal(true);
    setAuthMode('login');
  }, []);

  const upgradePlan = useCallback((plan: PlanType) => {
    if (!user) return;
    setUser({
      ...user,
      plan,
      isPro: true,
    });
    setShowPricingModal(false);
  }, [user]);

  const simulateTrial = useCallback((scenario: 'day1' | 'day2' | 'day3_urgent' | 'expired' | 'reset_trial' | 'pro') => {
    if (!user) return;

    const now = Date.now();
    let updatedUser: User = { ...user };

    switch (scenario) {
      case 'day1': // Day 1: 3 hours in (~69 hours remaining)
        updatedUser = {
          ...updatedUser,
          isPro: false,
          plan: 'trial',
          trialStartDate: new Date(now - 3 * 3600 * 1000).toISOString(),
          trialEndDate: new Date(now - 3 * 3600 * 1000 + THREE_DAYS_MS).toISOString(),
        };
        break;
      case 'day2': // Day 2: 36 hours in (~36 hours remaining)
        updatedUser = {
          ...updatedUser,
          isPro: false,
          plan: 'trial',
          trialStartDate: new Date(now - 36 * 3600 * 1000).toISOString(),
          trialEndDate: new Date(now - 36 * 3600 * 1000 + THREE_DAYS_MS).toISOString(),
        };
        break;
      case 'day3_urgent': // Day 3: 68 hours in (~4 hours remaining, alert state)
        updatedUser = {
          ...updatedUser,
          isPro: false,
          plan: 'trial',
          trialStartDate: new Date(now - 68 * 3600 * 1000).toISOString(),
          trialEndDate: new Date(now - 68 * 3600 * 1000 + THREE_DAYS_MS).toISOString(),
        };
        break;
      case 'expired': // Expired (ended 2 hours ago)
        updatedUser = {
          ...updatedUser,
          isPro: false,
          plan: 'trial',
          trialStartDate: new Date(now - 74 * 3600 * 1000).toISOString(),
          trialEndDate: new Date(now - 2 * 3600 * 1000).toISOString(),
        };
        break;
      case 'reset_trial': // Fresh 72 hours
        {
          const { trialStartDate, trialEndDate } = createTrialTimestamps();
          updatedUser = {
            ...updatedUser,
            isPro: false,
            plan: 'trial',
            trialStartDate,
            trialEndDate,
          };
        }
        break;
      case 'pro': // Upgraded
        updatedUser = {
          ...updatedUser,
          isPro: true,
          plan: 'pro',
        };
        break;
    }

    setUser(updatedUser);
    setCurrentTimeTick(Date.now());
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        trialState,
        login,
        signup,
        logout,
        upgradePlan,
        simulateTrial,
        showAuthModal,
        setShowAuthModal,
        showPricingModal,
        setShowPricingModal,
        authMode,
        setAuthMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
