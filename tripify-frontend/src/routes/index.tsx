import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Brain, Map, Clock, Shield, Bot, Activity, Leaf, Cpu, Globe2 } from "lucide-react";
import { destinations, aiAgents } from "@/lib/mock-data";
import { Badge, Button, FadeIn, GlassCard } from "@/components/common";
import { DestinationCard } from "@/components/common/DestinationCard";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Tripify India — AI Tourism Intelligence Platform" },
    { name: "description", content: "Predictive travel intelligence for India. Plan when, where, how, and why to travel — powered by 15 specialized AI agents." },
  ]}),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-glow overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 glass border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-aurora shadow-glow flex items-center justify-center"><Sparkles className="h-4 w-4 text-background" /></div>
            <span className="font-display font-bold text-lg">Tripify <span className="text-gradient">India</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <Link to="/explore" className="hover:text-foreground">Explore</Link>
            <Link to="/dashboard" className="hover:text-foreground">Intelligence</Link>
            <Link to="/planner" className="hover:text-foreground">Planner</Link>
            <Link to="/insights" className="hover:text-foreground">Insights</Link>
            <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground px-3 py-2">Sign in</Link>
            <Link to="/signup"><Button>Get started <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative grid-bg">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-28 relative">
          <FadeIn>
            <Badge tone="primary"><Sparkles className="h-3 w-3" /> India's first predictive tourism intelligence</Badge>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] max-w-5xl">
              Travel India like the<br/>AI <span className="text-gradient">already knows</span> the future.
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Tripify India predicts <span className="text-foreground">where, when, how, and why</span> to travel — using 15 specialized AI agents that forecast crowd, weather, price, safety and satisfaction in real time.
            </p>
          </FadeIn>
          <FadeIn delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard"><Button>Launch intelligence dashboard <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/explore"><Button variant="outline">Explore 26 destinations</Button></Link>
            </div>
          </FadeIn>

          {/* Live cards floating */}
          <div className="mt-16 grid lg:grid-cols-3 gap-4">
            {[
              { label: "Best window opens", v: "Kashmir · Jun 14", sub: "Weather score 96/100", icon: Clock, tone: "primary" },
              { label: "Price surge alert", v: "Goa +22%", sub: "Book in next 6 days", icon: Activity, tone: "warning" },
              { label: "Low crowd window", v: "Meghalaya −38%", sub: "Hidden gem opportunity", icon: Leaf, tone: "success" },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="glass-strong rounded-2xl p-5 hover:shadow-glow transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <Badge tone={c.tone as any}>Live prediction</Badge>
                  <c.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                <div className="font-display text-2xl font-bold mt-1">{c.v}</div>
                <div className="text-sm text-muted-foreground mt-1">{c.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl mb-12">
          <Badge tone="primary">The intelligence layer</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">15 AI agents, one decision.</h2>
          <p className="text-muted-foreground mt-4">Every agent watches a piece of your trip 24/7 — and only surfaces what changes the outcome.</p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
          {aiAgents.map((a, i) => (
            <motion.div key={a.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }} className="glass rounded-xl p-4 hover:ring-1 hover:ring-primary/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center"><Bot className="h-4 w-4" /></div>
                <span className={`h-2 w-2 rounded-full ${a.status === "alert" ? "bg-destructive" : a.status === "idle" ? "bg-muted-foreground" : "bg-success"} animate-pulse`} />
              </div>
              <div className="font-semibold text-sm">{a.name}</div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.insight}</div>
              <div className="mt-3 h-1 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-aurora" style={{ width: `${a.confidence}%` }} /></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { i: Brain, t: "Predictive timing", d: "AI forecasts the perfect month, week and time-of-day for every destination." },
            { i: Map, t: "Tourism heatmaps", d: "Live crowd density, traffic, weather and safety overlays across India." },
            { i: Shield, t: "Risk & safety", d: "Flood, landslide, scam-zone, AQI and solo-traveler safety scoring." },
            { i: Leaf, t: "Eco intelligence", d: "Carbon footprint, sustainable stays, responsible tourism routing." },
          ].map((f, i) => (
            <GlassCard key={i} className="hover:shadow-glow transition-shadow">
              <f.i className="h-6 w-6 text-primary mb-3" />
              <div className="font-display font-bold text-lg">{f.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{f.d}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <Badge tone="primary">All of India</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">26 destinations, scored in real time.</h2>
          </div>
          <Link to="/explore"><Button variant="outline">Explore all <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.slice(0, 8).map((d, i) => <DestinationCard key={d.id} d={d} index={i} />)}
        </div>
      </section>

      {/* Architecture */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-3xl mb-12">
          <Badge tone="primary"><Cpu className="h-3 w-3" /> Architecture</Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">Built on a multi-agent AI stack.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { t: "AI Layer", items: ["LLM orchestration","RAG pipelines","Vector embeddings","Recommendation engine","Forecasting models"] },
            { t: "Data Layer", items: ["PostgreSQL","MongoDB","Redis cache","Vector DB","Time-series store"] },
            { t: "Integration", items: ["Maps API","Weather API","Transport API","Hotel API","Cloud edge deploy"] },
          ].map((c) => (
            <GlassCard key={c.t}>
              <div className="font-display font-bold text-lg mb-3">{c.t}</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {c.items.map((i) => <li key={i} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{i}</li>)}
              </ul>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="glass-strong rounded-3xl p-12 text-center bg-glow relative overflow-hidden">
          <Globe2 className="absolute -right-12 -bottom-12 h-64 w-64 text-primary/10" />
          <h2 className="font-display text-4xl md:text-5xl font-bold">Stop guessing. Start <span className="text-gradient">predicting</span>.</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Join the AI tourism intelligence revolution.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/signup"><Button>Create free account <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/pricing"><Button variant="outline">See pricing</Button></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        © 2026 Tripify India — Predictive tourism intelligence
      </footer>
    </div>
  );
}
