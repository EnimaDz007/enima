import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Crown, 
  Plus, 
  Layers, 
  ListOrdered, 
  BarChart3, 
  CalendarDays, 
  ChevronDown, 
  LogOut, 
  Sparkles,
  Sliders,
  RotateCcw,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { DashboardTab } from '../types';

interface HeaderProps {
  isPricingOpen?: boolean;
  onTogglePricing?: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isPricingOpen = false, onTogglePricing }) => {
  const { user, trialState, logout, setShowPricingModal, simulateTrial, setShowAuthModal, setAuthMode } = useAuth();
  const { activeTab, setActiveTab, openNewTaskModal } = useTask();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleTabClick = (tabId: DashboardTab) => {
    if (onTogglePricing) {
      onTogglePricing(false);
    }
    setActiveTab(tabId);
  };

  const tabs: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
    { id: 'matrix', label: 'Priority Matrix', icon: Layers },
    { id: 'list', label: 'Priority List', icon: ListOrdered },
    { id: 'analytics', label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'schedule', label: 'Daily Timeline', icon: CalendarDays },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onTogglePricing && onTogglePricing(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-indigo-100">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">TaskFlow</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                  Priority & Progress
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">Eisenhower Matrix & Daily Velocity Tracker</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = !isPricingOpen && activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs shadow-slate-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <button
              id="nav-tab-pricing-page"
              onClick={() => onTogglePricing && onTogglePricing(true)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isPricingOpen
                  ? 'bg-white text-indigo-700 shadow-xs shadow-slate-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Crown className={`w-4 h-4 ${isPricingOpen ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Pricing & Plans</span>
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 3-Day Trial Status Pill */}
            {user ? (
              <div className="flex items-center">
                {trialState.isPro ? (
                  <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800">
                    <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>Pro Active</span>
                  </div>
                ) : trialState.isExpired ? (
                  <button
                    id="btn-trial-expired-badge"
                    onClick={() => setShowPricingModal(true)}
                    className="flex items-center space-x-1.5 px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>Trial Expired • Upgrade</span>
                  </button>
                ) : (
                  <button
                    id="btn-trial-status-badge"
                    onClick={() => setShowPricingModal(true)}
                    className="flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-200/80 rounded-full text-xs font-medium text-indigo-900 hover:bg-indigo-100/70 transition shadow-2xs"
                    title="Click to view 3-day trial details & plans"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </span>
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-semibold text-indigo-700">3-Day Trial:</span>
                    <span className="text-indigo-800 font-mono text-[11px]">{trialState.formattedRemaining}</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                id="btn-header-login"
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5"
              >
                Log in
              </button>
            )}

            {/* Download Project ZIP */}
            <a
              id="btn-header-download-zip"
              href="/taskflow-project.zip"
              download="taskflow-project.zip"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition cursor-pointer"
              title="Download the complete project ZIP"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Download ZIP</span>
            </a>

            {/* Upgrade / Get Pro button */}
            {!trialState.isPro && (
              <button
                id="btn-header-upgrade"
                onClick={() => setShowPricingModal(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade Plan</span>
              </button>
            )}

            {/* Quick Add Task */}
            <button
              id="btn-header-add-task"
              onClick={() => openNewTaskModal()}
              disabled={trialState.isExpired}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                trialState.isExpired
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Task</span>
            </button>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  id="btn-user-profile-menu"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-1.5 p-1 rounded-lg hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Subscription:</span>
                        <span className="font-semibold text-indigo-600 uppercase tracking-wide">
                          {user.isPro ? 'Pro Member' : '3-Day Trial'}
                        </span>
                      </div>
                      {!user.isPro && (
                        <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              trialState.isExpired
                                ? 'bg-rose-500'
                                : trialState.percentElapsed > 75
                                ? 'bg-amber-500'
                                : 'bg-indigo-600'
                            }`}
                            style={{ width: `${trialState.percentElapsed}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Quick Simulation Options */}
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="flex items-center space-x-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        <Sliders className="w-3 h-3" />
                        <span>Test 3-Day Trial States</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <button
                          id="btn-sim-day1"
                          onClick={() => {
                            simulateTrial('day1');
                            setProfileDropdownOpen(false);
                          }}
                          className="px-2 py-1 text-left rounded hover:bg-slate-100 text-slate-700"
                        >
                          🟢 Day 1 (Full)
                        </button>
                        <button
                          id="btn-sim-day2"
                          onClick={() => {
                            simulateTrial('day2');
                            setProfileDropdownOpen(false);
                          }}
                          className="px-2 py-1 text-left rounded hover:bg-slate-100 text-slate-700"
                        >
                          🟡 Day 2 (36h)
                        </button>
                        <button
                          id="btn-sim-day3"
                          onClick={() => {
                            simulateTrial('day3_urgent');
                            setProfileDropdownOpen(false);
                          }}
                          className="px-2 py-1 text-left rounded hover:bg-slate-100 text-slate-700"
                        >
                          🟠 Day 3 (&lt;6h)
                        </button>
                        <button
                          id="btn-sim-expired"
                          onClick={() => {
                            simulateTrial('expired');
                            setProfileDropdownOpen(false);
                          }}
                          className="px-2 py-1 text-left rounded hover:bg-slate-100 text-rose-600"
                        >
                          🔴 Expired
                        </button>
                      </div>
                      <button
                        id="btn-sim-reset"
                        onClick={() => {
                          simulateTrial('reset_trial');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full mt-1.5 flex items-center justify-center space-x-1 px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset 3-Day Trial (72h)</span>
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        id="btn-profile-plans"
                        onClick={() => {
                          setShowPricingModal(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Crown className="w-4 h-4 text-amber-500" />
                        <span>Upgrade / Plans</span>
                      </button>
                      <button
                        id="btn-profile-logout"
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex items-center space-x-1 pb-3 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = !isPricingOpen && activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => onTogglePricing && onTogglePricing(true)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              isPricingOpen
                ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Crown className={`w-3.5 h-3.5 ${isPricingOpen ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>Pricing</span>
          </button>
        </div>
      </div>
    </header>
  );
};
