import React from 'react';
import { X, Clock, Sliders, CheckCircle, RotateCcw, AlertTriangle, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TrialSimulatorToolbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrialSimulatorToolbar: React.FC<TrialSimulatorToolbarProps> = ({ isOpen, onClose }) => {
  const { trialState, simulateTrial } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">3-Day Trial State Tester</h3>
              <p className="text-xs text-slate-500">Test how the dashboard behaves across trial phases</p>
            </div>
          </div>
          <button
            id="btn-close-simulator-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Current Status Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-600 font-medium">Current Status:</span>
            <span className="font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800">
              {trialState.isPro ? 'Pro Subscription' : trialState.formattedRemaining}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Trial Simulation:</p>
            
            <button
              id="sim-btn-day1"
              onClick={() => {
                simulateTrial('day1');
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">Day 1: Fresh 3-Day Trial</div>
                  <div className="text-[11px] text-slate-500">~69 hours remaining, full unrestricted access banner</div>
                </div>
              </div>
              <Clock className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            </button>

            <button
              id="sim-btn-day2"
              onClick={() => {
                simulateTrial('day2');
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 transition text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">Day 2: Mid-Trial</div>
                  <div className="text-[11px] text-slate-500">~36 hours remaining (50% elapsed)</div>
                </div>
              </div>
              <Clock className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            </button>

            <button
              id="sim-btn-day3"
              onClick={() => {
                simulateTrial('day3_urgent');
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700">Day 3: Final Hours (&lt; 6 hrs)</div>
                  <div className="text-[11px] text-slate-500">Amber countdown warning and urgency banner</div>
                </div>
              </div>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </button>

            <button
              id="sim-btn-expired"
              onClick={() => {
                simulateTrial('expired');
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50/40 transition text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                  0
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-rose-700">Trial Expired (0 hrs left)</div>
                  <div className="text-[11px] text-slate-500">Locks dashboard with trial expired screen & upgrade prompt</div>
                </div>
              </div>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </button>

            <button
              id="sim-btn-pro"
              onClick={() => {
                simulateTrial('pro');
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800">Pro Plan (Unlimited)</div>
                  <div className="text-[11px] text-slate-500">Subscribed member with no trial limitations</div>
                </div>
              </div>
              <CheckCircle className="w-4 h-4 text-amber-600" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              id="sim-btn-reset-full"
              onClick={() => {
                simulateTrial('reset_trial');
                onClose();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Full 3-Day Trial (72 Hours)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
