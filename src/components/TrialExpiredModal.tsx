import React from 'react';
import { Lock, Sparkles, Check, Crown, RotateCcw, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';

export const TrialExpiredModal: React.FC = () => {
  const { trialState, setShowPricingModal, simulateTrial } = useAuth();
  const { tasks, todayCompletedCount } = useTask();

  if (!trialState.isExpired) {
    return null;
  }

  const completedTotal = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden text-center p-6 sm:p-8">
        {/* Top Lock Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-200 mb-5">
          <Lock className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-full mb-2">
          3-Day Free Trial Finished
        </span>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Ready to keep your productivity high?
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
          Your 3-day complimentary access has concluded. Unlock uninterrupted task prioritization, Eisenhower matrices, and historical progress analytics.
        </p>

        {/* What was accomplished during the trial */}
        <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Your Trial Accomplishments:
          </p>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-xl font-bold text-indigo-600">{completedTotal}</span>
              <p className="text-[11px] text-slate-500 font-medium">Tasks Completed</p>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-xl font-bold text-emerald-600">{todayCompletedCount}</span>
              <p className="text-[11px] text-slate-500 font-medium">Done Today</p>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-2 text-left text-xs text-slate-700 mb-6">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Unlimited tasks & Eisenhower 4-quadrant organization</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Interactive daily velocity charts & completion trend reports</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Daily focus goals and streak tracking</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2.5">
          <button
            id="btn-expired-upgrade"
            onClick={() => setShowPricingModal(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Upgrade to Pro — Starting at $9/mo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-expired-reset-demo"
            onClick={() => simulateTrial('reset_trial')}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
            title="Reset trial to evaluate the active app again"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo 3-Day Trial (For Testing)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
