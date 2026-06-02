export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For trying things out",
    price: 0,
    period: "free forever",
    color: "#2DB89E",
    soft: "#D4F1EA",
    features: [
      "Up to 20 resources",
      "Core games & flip cards",
      "1 therapist seat",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For busy practices",
    price: 19,
    period: "per month",
    color: "#D76B3F",
    soft: "#FFE3D2",
    popular: true,
    features: [
      "Unlimited resources",
      "All games + AI game builder",
      "Up to 5 therapist seats",
      "Custom uploads & branding",
      "Priority support",
    ],
  },
  {
    id: "clinic",
    name: "Clinic",
    tagline: "For whole teams",
    price: 49,
    period: "per month",
    color: "#7A5BC9",
    soft: "#E8DFFF",
    features: [
      "Everything in Pro",
      "Unlimited seats",
      "Admin dashboard & analytics",
      "SSO & HIPAA agreement",
      "Dedicated success manager",
    ],
  },
] as const

export type PlanId = typeof PLANS[number]["id"]
export type Plan   = typeof PLANS[number]
