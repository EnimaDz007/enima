import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTask } from './context/TaskContext';
import { Header } from './components/Header';
import { TrialBanner } from './components/TrialBanner';
import { DailyStatsBar } from './components/DailyStatsBar';
import { PriorityMatrixView } from './components/PriorityMatrixView';
import { PriorityListView } from './components/PriorityListView';
import { ProgressChartsView } from './components/ProgressChartsView';
import { DailyTimelineView } from './components/DailyTimelineView';
import { PricingPage } from './components/PricingPage';
import { TaskModal } from './components/TaskModal';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
import { TrialExpiredModal } from './components/TrialExpiredModal';
import { TrialSimulatorToolbar } from './components/TrialSimulatorToolbar';

const DashboardContent: React.FC = () => {
  const { trialState } = useAuth();
  const { activeTab } = useTask();
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  
  // URL routing for /pricing or #pricing
  const [isPricingPage, setIsPricingPage] = useState(() => {
    return window.location.pathname.includes('/pricing') || window.location.hash.includes('pricing');
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setIsPricingPage(window.location.pathname.includes('/pricing') || window.location.hash.includes('pricing'));
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleTogglePricing = (show: boolean) => {
    setIsPricingPage(show);
    if (show) {
      window.history.pushState(null, '', '/pricing');
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* App Header */}
      <Header isPricingOpen={isPricingPage} onTogglePricing={handleTogglePricing} />

      {/* 3-Day Trial Status Banner (shown on both dashboard and pricing) */}
      <TrialBanner onOpenSimulator={() => setIsSimulatorOpen(true)} />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {isPricingPage ? (
          <PricingPage onBackToDashboard={() => handleTogglePricing(false)} />
        ) : (
          <>
            {/* Daily Progress & Velocity KPIs Bar */}
            <DailyStatsBar />

            {/* View Router */}
            <div className="relative">
              {trialState.isExpired && (
                <div className="absolute inset-0 bg-slate-100/50 backdrop-blur-[1px] z-10 pointer-events-none rounded-2xl" />
              )}

              {activeTab === 'matrix' && <PriorityMatrixView />}
              {activeTab === 'list' && <PriorityListView />}
              {activeTab === 'analytics' && <ProgressChartsView />}
              {activeTab === 'schedule' && <DailyTimelineView />}
            </div>
          </>
        )}
      </main>

      {/* Modals & Dialogs */}
      <TaskModal />
      <PricingModal />
      <AuthModal />
      <TrialExpiredModal />
      <TrialSimulatorToolbar isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            TaskFlow • 3-Day Trial Full Access • Priority Matrix & Daily Progress
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleTogglePricing(!isPricingPage)}
              className="hover:text-indigo-600 transition font-medium cursor-pointer"
            >
              {isPricingPage ? 'Go to Dashboard' : 'Pricing & Plans'}
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="hover:text-indigo-600 transition font-medium cursor-pointer"
            >
              Test Trial Scenarios
            </button>
            <span className="text-slate-300">•</span>
            <a
              href="/taskflow-project.zip"
              download="taskflow-project.zip"
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Download ZIP Archive
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <DashboardContent />
      </TaskProvider>
    </AuthProvider>
  );
}
