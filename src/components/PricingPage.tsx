import React, { useState } from 'react';
import { 
  Check, 
  Crown, 
  Zap, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Clock, 
  HelpCircle, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { PlanType } from '../types';

interface PricingPageProps {
  onBackToDashboard: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBackToDashboard }) => {
  const { user, trialState, upgradePlan, simulateTrial, setShowAuthModal, setAuthMode } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [processingPlan, setProcessingPlan] = useState<PlanType | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSelectPlan = (plan: PlanType) => {
    setProcessingPlan(plan);
    setTimeout(() => {
      upgradePlan(plan);
      setProcessingPlan(null);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      onBackToDashboard();
    }, 500);
  };

  const handleStartTrial = () => {
    if (!user) {
      setAuthMode('signup');
      setShowAuthModal(true);
    } else {
      simulateTrial('reset_trial');
      onBackToDashboard();
    }
  };

  const plans = [
    {
      id: 'starter' as PlanType,
      name: 'Starter',
      price: billingCycle === 'annual' ? 7 : 9,
      regularPrice: billingCycle === 'annual' ? 9 : 12,
      period: 'per month',
      badge: 'Solopreneurs & Freelancers',
      description: 'Essential Eisenhower matrix prioritization and daily progress for focused individuals.',
      features: [
        '3-Day Free Trial included',
        'Eisenhower 4-Quadrant Priority Matrix',
        'Up to 50 active tasks',
        '7-day daily velocity history',
        'Daily focus goal tracker & streak counter',
        'Standard email assistance',
      ],
      cta: 'Start 3-Day Trial (Starter)',
      isPopular: false,
    },
    {
      id: 'pro' as PlanType,
      name: 'Professional',
      price: billingCycle === 'annual' ? 15 : 19,
      regularPrice: billingCycle === 'annual' ? 19 : 25,
      period: 'per month',
      badge: 'Most Popular',
      description: 'Maximum productivity for founders, product managers, and lead engineers.',
      features: [
        '3-Day Free Trial with full access',
        'Unlimited tasks & custom category tags',
        'Eisenhower Matrix + Priority List views',
        'Real-time Daily Velocity analytics & charts',
        'Impact vs Effort value ratio calculator',
        'Morning, Afternoon & Evening timeline blocks',
        'Export data anytime (JSON & CSV)',
        'Priority 24/7 support',
      ],
      cta: 'Start 3-Day Trial (Pro)',
      isPopular: true,
    },
    {
      id: 'enterprise' as PlanType,
      name: 'Enterprise',
      price: billingCycle === 'annual' ? 39 : 49,
      regularPrice: billingCycle === 'annual' ? 49 : 65,
      period: 'per month',
      badge: 'Teams & Departments',
      description: 'Shared priority matrices, team workload visibility, and custom executive reporting.',
      features: [
        '3-Day Team Free Trial',
        'Everything included in Pro',
        'Multi-user shared priority matrices',
        'Team velocity & capacity planning',
        'SSO & SAML authentication',
        'Custom SLA & dedicated engineer',
      ],
      cta: 'Start 3-Day Trial (Enterprise)',
      isPopular: false,
    },
  ];

  const faqs = [
    {
      q: 'How does the 3-day trial work?',
      a: 'When you sign up or log in, you immediately get 72 hours of 100% full unrestricted access to all features including the Eisenhower Priority Matrix, real-time analytics, and daily timeline blocks. No credit card is required to start your trial.',
    },
    {
      q: 'What happens when my 3 days are up?',
      a: 'At the end of your 3-day trial, you can choose any of our affordable plans (starting at $7/mo) to keep using TaskFlow. Your tasks, matrices, and progress logs are preserved safely.',
    },
    {
      q: 'Can I cancel or change plans anytime?',
      a: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time with a single click. There are no long-term contracts or lock-ins.',
    },
    {
      q: 'Do you offer a refund guarantee?',
      a: 'Yes, all paid plans come with a 30-day money-back guarantee. If you are not satisfied, we will issue a full refund immediately.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-12">
      {/* Top back button & breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          id="btn-pricing-back"
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {user && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500">Current Status:</span>
            <span className="font-bold text-indigo-700 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200">
              {trialState.isPro ? 'Pro Active' : `3-Day Trial (${trialState.formattedRemaining})`}
            </span>
          </div>
        )}
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>3-Day Free Trial on All Plans • No Credit Card Required</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Prioritize with clarity. Track with precision.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Sign up today and get an instant 3-day full access trial to the Eisenhower Priority Matrix and Daily Progress Dashboard. Select your plan below to unlock unrestricted productivity.
        </p>

        {/* Billing cycle switch */}
        <div className="pt-2 inline-flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/80 shadow-2xs">
          <button
            id="pricing-toggle-monthly"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            id="pricing-toggle-annual"
            onClick={() => setBillingCycle('annual')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              billingCycle === 'annual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plans.map(plan => {
          const isSelected = plan.isPopular;
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-white border-2 border-indigo-600 shadow-xl ring-4 ring-indigo-50 md:-translate-y-2'
                  : 'bg-white border border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                      {plan.badge}
                    </span>
                  </div>
                  {isSelected ? (
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Crown className="w-5 h-5 fill-indigo-100" />
                    </div>
                  ) : plan.id === 'enterprise' ? (
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 mb-6 leading-relaxed">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                    <span className="text-xs text-slate-500">/{plan.period}</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      Billed annually (normally ${plan.regularPrice}/mo)
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-5 mb-6">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  id={`btn-select-pricing-${plan.id}`}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={processingPlan !== null}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {processingPlan === plan.id ? (
                    <span>Activating Plan...</span>
                  ) : (
                    <>
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Includes 3 days free • Cancel anytime
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trial Banner Callout */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            Risk-Free Guarantee
          </span>
          <h3 className="text-xl sm:text-2xl font-bold">Start your 3-day trial right now</h3>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-lg">
            Experience the clarity of the Eisenhower 4-quadrant system and daily velocity analytics for 72 hours before deciding.
          </p>
        </div>

        <button
          id="btn-pricing-instant-trial"
          onClick={handleStartTrial}
          className="px-6 py-3 bg-white hover:bg-indigo-50 text-indigo-900 font-bold rounded-xl text-sm shadow-md transition whitespace-nowrap cursor-pointer"
        >
          {user ? 'Launch Trial Dashboard' : 'Create Account (Get 3 Days)'}
        </button>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center space-x-2 text-slate-900">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold">Frequently Asked Questions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
