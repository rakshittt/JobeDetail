export const SUBSCRIPTION_PLANS = [
    {
      id: 'basic',
      name: 'Basic',
      price: 99900, // ₹999 in paise
      interval: 'monthly',
      features: [
        'Up to 5 projects',
        'Basic analytics',
        'Email support',
        '5GB storage'
      ],
      isPopular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 199900, // ₹1999 in paise
      interval: 'monthly',
      features: [
        'Up to 25 projects',
        'Advanced analytics',
        'Priority support',
        '50GB storage',
        'API access'
      ],
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 499900, // ₹4999 in paise
      interval: 'monthly',
      features: [
        'Unlimited projects',
        'Custom analytics',
        '24/7 phone support',
        '500GB storage',
        'Full API access',
        'Custom integrations'
      ],
      isPopular: false
    }
  ] as const;