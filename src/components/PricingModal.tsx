import React, { useState } from 'react';
import { X, Check, Crown, Zap, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { PlanType } from '../types';

export const PricingModal: React.FC = () => {
  const { showPricingModal, setShowPricingModal, upgradePlan, trialState } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [processingPlan, setProcessingPlan] = useState<PlanType | null>(null);

  if (!showPricingModal) return null;

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
    }, 600);
  };

  const plans = [
    {
      id: 'starter' as PlanType,
      name: 'Starter',
      price: billingCycle === 'annual' ? 7 : 9,
      period: 'per month',
      badge: 'For Solopreneurs',
      description: 'Essential priority matrix and daily tracking for individual focus.',
      features: [
        'Eisenhower 4-Quadrant Matrix',
        'Up to 50 active tasks',
        '7-day historical progress chart',
        'Daily focus goal tracker',
        'Standard email support',
      ],
      cta: 'Choose Starter',
      isPopular: false,
    },
    {
      id: 'pro' as PlanType,
      name: 'Professional',
      price: billingCycle === 'annual' ? 15 : 19,
      period: 'per month',
      badge: 'Most Popular',
      description: 'Uncapped velocity metrics and advanced prioritization workflows.',
      features: [
        'Unlimited tasks & categories',
        'Full Eisenhower & Kanban lists',
        'Real-time Daily Velocity analytics',
        'Impact vs Effort automatic scoring',
        'CSV & JSON Data export',
        'Custom category tags & themes',
        'Priority 24/7 assistance',
      ],
      cta: 'Activate Pro Access',
      isPopular: true,
    },
    {
      id: 'enterprise' as PlanType,
      name: 'Enterprise',
      price: billingCycle === 'annual' ? 39 : 49,
      period: 'per month',
      badge: 'Teams & Orgs',
      description: 'Team priority alignment, shared matrices, and executive dashboards.',
      features: [
        'Everything in Pro included',
        'Multi-user shared priority matrices',
        'Team velocity & workload balancing',
        'SSO & SAML authentication',
        'Dedicated onboarding engineer',
        'Custom SLA guarantee',
      ],
      cta: 'Choose Enterprise',
      isPopular: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-8">
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 relative text-center">
          <button
            id="btn-close-pricing"
            onClick={() => setShowPricingModal(false)}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-bold text-indigo-700 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3-Day Free Trial Upgrade</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Simple, transparent plans for high performers
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            {trialState.isExpired
              ? 'Your 3-day trial has concluded. Select a plan to continue prioritizing effectively.'
              : `Your 3-day trial has ${trialState.formattedRemaining}. Upgrade today to lock in early adopter rates.`}
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-6 inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              id="billing-monthly-btn"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly billing
            </button>
            <button
              id="billing-annual-btn"
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center space-x-1 px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                billingCycle === 'annual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual billing</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => {
            const isSelected = plan.isPopular;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-indigo-600 bg-white shadow-xl ring-4 ring-indigo-50'
                    : 'border border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                    {isSelected ? (
                      <Crown className="w-5 h-5 text-indigo-600" />
                    ) : plan.id === 'enterprise' ? (
                      <Building2 className="w-5 h-5 text-slate-400" />
                    ) : (
                      <Zap className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mb-4 h-10">{plan.description}</p>

                  <div className="mb-5">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-extrabold text-slate-900">${plan.price}</span>
                      <span className="text-xs text-slate-500">/{billingCycle === 'annual' ? 'mo billed annually' : 'mo'}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mb-6">
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                      Included features:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  id={`btn-plan-${plan.id}`}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={processingPlan !== null}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {processingPlan === plan.id ? (
                    <span className="animate-pulse">Activating Plan...</span>
                  ) : (
                    <span>{plan.cta}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>30-day money-back guarantee. No questions asked.</span>
          </div>
          <span className="text-slate-400">Cancel or change plans anytime in 1-click.</span>
        </div>
      </div>
    </div>
  );
};
