import React, { useState } from 'react';
import { X, CheckCircle2, Lock, Mail, User as UserIcon, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, login, signup, authMode, setAuthMode } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (authMode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      signup(name, email);
    } else {
      login(email, name);
    }
  };

  const handleQuickDemo = (demoName: string, demoEmail: string) => {
    signup(demoName, demoEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-indigo-50/70 to-white border-b border-slate-100 relative">
          <button
            id="btn-close-auth-modal"
            onClick={() => setShowAuthModal(false)}
            className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-3 shadow-md shadow-indigo-100">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Instant 3-Day Free Trial</span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {authMode === 'signup' ? 'Start Your 3-Day Trial' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === 'signup'
              ? 'Get 72 hours of full unrestricted access to priority matrices and daily progress visualization.'
              : 'Log in to continue managing your task priorities.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100">
          <button
            id="tab-auth-signup"
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
              authMode === 'signup'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900 bg-slate-50'
            }`}
          >
            Sign Up (3-Day Trial)
          </button>
          <button
            id="tab-auth-login"
            type="button"
            onClick={() => {
              setAuthMode('login');
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition border-b-2 ${
              authMode === 'login'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900 bg-slate-50'
            }`}
          >
            Log In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-auth-name"
                  type="text"
                  placeholder="e.g. Jordan Myers"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="input-auth-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="input-auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <button
            id="btn-auth-submit"
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{authMode === 'signup' ? 'Activate 3-Day Trial' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Logins */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick 1-Click Test Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-quick-demo-sarah"
                type="button"
                onClick={() => handleQuickDemo('Sarah Miller', 'sarah.miller@product.dev')}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-left text-xs transition"
              >
                <div className="font-semibold text-slate-800">Sarah Miller</div>
                <div className="text-[10px] text-slate-500">Product Lead</div>
              </button>
              <button
                id="btn-quick-demo-alex"
                type="button"
                onClick={() => handleQuickDemo('Alex Rivera', 'alex.rivera@company.io')}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-left text-xs transition"
              >
                <div className="font-semibold text-slate-800">Alex Rivera</div>
                <div className="text-[10px] text-slate-500">Tech Founder</div>
              </button>
            </div>
          </div>
        </form>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>No credit card required. Full access to all dashboard features.</span>
        </div>
      </div>
    </div>
  );
};
