import React from 'react';
import { Clock, AlertTriangle, Sparkles, Check, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TrialBannerProps {
  onOpenSimulator: () => void;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ onOpenSimulator }) => {
  const { user, trialState, setShowPricingModal } = useAuth();

  if (!user || trialState.isPro) {
    return null;
  }

  const isUrgent = !trialState.isExpired && trialState.remainingHours < 12 && trialState.remainingDays === 0;

  if (trialState.isExpired) {
    return (
      <div className="bg-rose-50 border-b border-rose-200 px-4 py-3 text-rose-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Your 3-day full access trial has ended</p>
              <p className="text-xs text-rose-700">Upgrade to maintain priority matrix workflows, unlimited tasks, and historical progress reports.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="btn-banner-simulator"
              onClick={onOpenSimulator}
              className="text-xs font-medium px-3 py-1.5 bg-rose-100/70 hover:bg-rose-100 rounded-lg text-rose-800 border border-rose-200 transition"
            >
              Test Simulator
            </button>
            <button
              id="btn-banner-upgrade-expired"
              onClick={() => setShowPricingModal(true)}
              className="text-xs font-semibold px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-b transition-colors ${
        isUrgent
          ? 'bg-amber-50/90 border-amber-200 text-amber-950'
          : 'bg-gradient-to-r from-indigo-50/90 via-blue-50/70 to-indigo-50/90 border-indigo-100 text-indigo-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          {/* Left info */}
          <div className="flex items-center space-x-3">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isUrgent ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {isUrgent ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-indigo-200/60 text-indigo-800">
                  3-Day Free Trial
                </span>
                <span className="text-xs font-semibold">
                  {isUrgent
                    ? `⚠️ Trial expires soon: only ${trialState.formattedRemaining}`
                    : `You have full unrestricted access (${trialState.formattedRemaining})`}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 hidden sm:block">
                All features unlocked: Eisenhower Matrix, velocity metrics, daily timeline, and progress analytics.
              </p>
            </div>
          </div>

          {/* Right action area */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <button
              id="btn-open-trial-tester"
              onClick={onOpenSimulator}
              className="flex items-center space-x-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white/90 hover:bg-white border border-slate-200/90 rounded-md shadow-2xs transition"
              title="Test trial time variations"
            >
              <SlidersHorizontal className="w-3 h-3 text-slate-500" />
              <span>Trial Tester</span>
            </button>

            <button
              id="btn-banner-upgrade-active"
              onClick={() => setShowPricingModal(true)}
              className="flex items-center space-x-1 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition"
            >
              <Sparkles className="w-3 h-3" />
              <span>Unlock Pro</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Visual progress bar of 72 hours */}
        <div className="mt-2 w-full bg-slate-200/70 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isUrgent ? 'bg-amber-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${trialState.percentElapsed}%` }}
          />
        </div>
      </div>
    </div>
  );
};
