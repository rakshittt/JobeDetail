export type Plan = {
  readonly id: 'basic' | 'pro' | 'enterprise';
  readonly name: string;
  readonly price: number;
  readonly interval: 'month' | 'year';
  readonly features: readonly string[];
  readonly razorpayPlanId: string;
  readonly isPopular?: boolean;
};

export const SUBSCRIPTION_PLANS: readonly Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 999,
    interval: 'month',
    features: [
      'Up to 10 company searches per month',
      'Basic company information',
      'Email support',
      'Basic analytics',
    ],
    razorpayPlanId: 'plan_basic',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2499,
    interval: 'month',
    features: [
      'Up to 50 company searches per month',
      'Detailed company information',
      'Priority email support',
      'Advanced analytics',
      'Competitor analysis',
    ],
    razorpayPlanId: 'plan_pro',
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    interval: 'month',
    features: [
      'Unlimited company searches',
      'Full company information',
      '24/7 priority support',
      'Custom analytics',
      'API access',
      'Custom integrations',
    ],
    razorpayPlanId: 'plan_enterprise',
  },
] as const;

export type PlanId = typeof SUBSCRIPTION_PLANS[number]['id'];

export function getPlanById(id: PlanId) {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === id);
}

export function getPlanByRazorpayId(razorpayPlanId: string) {
  return SUBSCRIPTION_PLANS.find(plan => plan.razorpayPlanId === razorpayPlanId);
}