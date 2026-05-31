import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Check, Sparkles, Zap, Crown, Loader2 } from "lucide-react";

export const Route = createFileRoute("/pricing")({ component: P, head: () => ({ meta: [{ title: "Pricing — Tripify India" }] }) });

const plans = [
  {
    name: "Explorer",
    price: "Free",
    tag: "forever",
    icon: Zap,
    highlight: false,
    color: "text-cyan-400",
    cta: "Get started free",
    features: [
      "5 AI itineraries per month",
      "Access to 96 destinations",
      "Basic trip planning",
      "Community access",
      "Smart Maps",
      "Email support",
    ],
  },
  {
    name: "Voyager",
    price: "₹499",
    tag: "/ month",
    icon: Sparkles,
    highlight: true,
    color: "text-primary",
    cta: "Start Voyager",
    features: [
      "Unlimited AI itineraries",
      "Real-time Live Intel",
      "AI Transport search",
      "Timing AI predictions",
      "Advanced Analytics",
      "Priority support",
      "AI Travel Assistant",
      "Bookings management",
    ],
  },
  {
    name: "Nomad",
    price: "₹999",
    tag: "/ month",
    icon: Crown,
    highlight: false,
    color: "text-yellow-400",
    cta: "Go Nomad",
    features: [
      "Everything in Voyager",
      "White-glove trip planning",
      "Dedicated AI concierge",
      "Exclusive hidden gems",
      "Group trip coordination",
      "API access",
      "Custom AI agents",
      "24/7 phone support",
    ],
  },
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes! Cancel anytime with no questions asked. Your plan continues till end of billing period." },
  { q: "Is there a free trial?", a: "Voyager and Nomad come with a 7-day free trial. No credit card required." },
  { q: "What payment methods do you accept?", a: "UPI, credit/debit cards, net banking and all major wallets via Razorpay." },
  { q: "Do you offer student discounts?", a: "Yes! Students get 50% off Voyager with a valid college email ID." },
];

function P() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selecting, setSelecting] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = async (planName: string) => {
    if (planName === "Explorer") {
      navigate({ to: "/dashboard" });
      return;
    }
    setSelecting(planName);
    await new Promise(r => setTimeout(r, 1500));
    setSelected(planName);
    setSelecting(null);
  };

  const getPrice = (plan: any) => {
    if (plan.price === "Free") return "Free";
    if (billing === "yearly") {
      const monthly = parseInt(plan.price.replace('₹', ''));
      const yearly = Math.round(monthly * 10);
      return `₹${yearly.toLocaleString()}`;
    }
    return plan.price;
  };

  const getTag = (plan: any) => {
    if (plan.price === "Free") return "forever";
    return billing === "yearly" ? "/ year (save 2 months)" : "/ month";
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Premium"
        title="Plans built for every traveler"
        desc="From free explorers to digital nomads — premium AI intelligence at every tier."
      />

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className={`text-sm ${billing === "monthly" ? "text-foreground font-semibold" : "text-muted-foreground"}`}>Monthly</span>
        <button
          onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
          className={`relative h-6 w-12 rounded-full transition-colors ${billing === "yearly" ? "bg-aurora" : "bg-secondary"}`}
        >
          <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${billing === "yearly" ? "translate-x-7" : "translate-x-1"}`} />
        </button>
        <span className={`text-sm ${billing === "yearly" ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
          Yearly <Badge tone="success">Save 17%</Badge>
        </span>
      </div>

      {/* Plans */}
      <div className="grid lg:grid-cols-3 gap-5 mb-12">
        {plans.map(plan => {
          const Icon = plan.icon;
          const isSelecting = selecting === plan.name;
          const isSelected = selected === plan.name;
          return (
            <GlassCard
              key={plan.name}
              className={`relative ${plan.highlight ? "ring-1 ring-primary/40 shadow-glow scale-[1.02]" : ""}`}
              glow={plan.highlight}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge tone="primary">Most popular</Badge>
                </div>
              )}

              <div className="flex items-center gap-3 mt-2">
                <div className={`h-10 w-10 rounded-xl bg-secondary/60 flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${plan.color}`} />
                </div>
                <div className="font-display text-2xl font-bold">{plan.name}</div>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{getPrice(plan)}</span>
                <span className="text-muted-foreground text-sm">{getTag(plan)}</span>
              </div>

              <ul className="mt-6 space-y-2.5 text-sm">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlight ? "primary" : "outline"}
                className="w-full mt-6"
                onClick={() => handleSelect(plan.name)}
                disabled={isSelecting || isSelected}
              >
                {isSelecting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Processing...</>
                ) : isSelected ? (
                  <><Check className="h-4 w-4" />Active Plan!</>
                ) : (
                  plan.cta
                )}
              </Button>

              {isSelected && (
                <div className="mt-3 text-center text-xs text-success">
                  ✅ {plan.name} plan activated!
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Feature comparison */}
      <GlassCard className="mb-8">
        <div className="font-display font-bold mb-4 text-center">Full feature comparison</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left py-3 text-muted-foreground font-normal">Feature</th>
                <th className="text-center py-3 text-cyan-400">Explorer</th>
                <th className="text-center py-3 text-primary">Voyager</th>
                <th className="text-center py-3 text-yellow-400">Nomad</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["AI Itineraries", "5/month", "Unlimited", "Unlimited"],
                ["Destinations", "96", "96", "96 + Exclusive"],
                ["Live Intel", "❌", "✅", "✅"],
                ["Transport AI", "❌", "✅", "✅"],
                ["Timing AI", "Basic", "Full", "Full"],
                ["Analytics", "Basic", "Advanced", "Advanced"],
                ["AI Assistant", "❌", "✅", "✅"],
                ["API Access", "❌", "❌", "✅"],
                ["Support", "Email", "Priority", "24/7 Phone"],
              ].map(([feature, ...values]) => (
                <tr key={feature} className="border-b border-border/20 hover:bg-secondary/20">
                  <td className="py-3 text-muted-foreground">{feature}</td>
                  {values.map((v, i) => (
                    <td key={i} className="py-3 text-center">
                      {v === "✅" ? <Check className="h-4 w-4 text-success mx-auto" /> :
                       v === "❌" ? <span className="text-muted-foreground/40">—</span> :
                       <span className={i === 1 ? "text-primary font-semibold" : ""}>{v}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <div className="font-display font-bold text-center text-2xl mb-6">Frequently asked questions</div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <GlassCard key={i}>
              <div className="font-semibold mb-1">{faq.q}</div>
              <div className="text-sm text-muted-foreground">{faq.a}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}