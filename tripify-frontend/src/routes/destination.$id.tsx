import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { GlassCard, Badge, Button, ScoreRing, Stat } from "@/components/common";
import { destinations, trendData, months } from "@/lib/mock-data";
import { MapPin, Calendar, Cloud, Users, IndianRupee, Shield, Heart, Leaf, Sparkles, Sunrise, Bot, AlertTriangle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

export const Route = createFileRoute("/destination/$id")({
  component: Detail,
  notFoundComponent: () => <div className="p-12 text-center">Destination not found.</div>,
  loader: ({ params }) => { const d = destinations.find(x=>x.id===params.id); if (!d) throw notFound(); return d; },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.name ?? "Destination"} — Tripify India` }] }),
});

function Detail() {
  const d = Route.useLoaderData();
  const radar = Object.entries(d.scores).map(([k,v])=>({ axis: k[0].toUpperCase()+k.slice(1), v }));
  return (
    <AppShell>
      <div className="relative rounded-3xl overflow-hidden mb-8 h-80">
        <img src={d.hero} className="absolute inset-0 w-full h-full object-cover" alt={d.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{d.region}</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mt-2">{d.name}</h1>
          <p className="text-muted-foreground mt-1">{d.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {d.category.map((c: string) => <Badge key={c} tone="primary">{c}</Badge>)}
            <Badge tone="success"><Calendar className="h-3 w-3" />Best: {d.bestMonths.join(", ")}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {[
          { i: Cloud, l: "Weather", v: d.scores.weather, c: "info" },
          { i: Users, l: "Crowd", v: d.scores.crowd, c: "warning" },
          { i: IndianRupee, l: "Budget", v: d.scores.budget, c: "primary" },
          { i: Shield, l: "Safety", v: d.scores.safety, c: "success" },
          { i: Heart, l: "Satisfaction", v: d.scores.satisfaction, c: "accent" },
          { i: Leaf, l: "Eco", v: d.scores.eco, c: "success" },
        ].map((s) => (
          <GlassCard key={s.l} className="flex flex-col items-center text-center !p-4">
            <s.i className="h-4 w-4 text-primary mb-1" />
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="font-display text-2xl font-bold mt-1">{s.v}</div>
            <div className="mt-2 w-full h-1 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-aurora" style={{ width: `${s.v}%` }} /></div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="lg:col-span-2">
          <div className="font-display font-bold mb-1">Predictive timing · next 12 months</div>
          <div className="text-xs text-muted-foreground mb-4">Crowd, satisfaction & price curves</div>
          <div className="h-72"><ResponsiveContainer><AreaChart data={trendData}>
            <defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5}/><stop offset="100%" stopColor="var(--primary)" stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
            <Area type="monotone" dataKey="satisfaction" stroke="var(--primary)" fill="url(#dg)" strokeWidth={2} />
            <Area type="monotone" dataKey="price" stroke="var(--warning)" fill="transparent" strokeWidth={2} />
          </AreaChart></ResponsiveContainer></div>
        </GlassCard>
        <GlassCard>
          <div className="font-display font-bold mb-2">Destination DNA</div>
          <div className="h-64"><ResponsiveContainer><RadarChart data={radar}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="axis" stroke="var(--muted-foreground)" fontSize={10} />
            <Radar dataKey="v" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.35} />
          </RadarChart></ResponsiveContainer></div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <GlassCard><div className="flex items-center gap-2 mb-2"><Bot className="h-4 w-4 text-primary" /><span className="font-semibold">AI Verdict</span></div><div className="text-sm">Best window opens in <span className="text-primary font-semibold">{d.bestMonths[0]}</span>. Price predicted to {d.priceTrend > 0 ? "rise" : "fall"} <span className="text-warning">{Math.abs(d.priceTrend)}%</span> in 14 days.</div></GlassCard>
        <GlassCard><div className="flex items-center gap-2 mb-2"><Sunrise className="h-4 w-4 text-warning" /><span className="font-semibold">Best photo spots</span></div><ul className="text-sm space-y-1 text-muted-foreground"><li>• Sunrise viewpoint (06:14)</li><li>• Lakefront — golden hour</li><li>• Old town alleys at dusk</li></ul></GlassCard>
        <GlassCard><div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-warning" /><span className="font-semibold">Risk profile</span></div><div className="space-y-2 text-sm"><div className="flex justify-between"><span>Flood risk</span><Badge tone="success">low</Badge></div><div className="flex justify-between"><span>Scam zones</span><Badge tone="warning">moderate</Badge></div><div className="flex justify-between"><span>Solo traveler</span><Badge tone="success">safe</Badge></div></div></GlassCard>
      </div>

      <GlassCard className="mb-6">
        <div className="font-display font-bold mb-3">12-month seasonal beauty score</div>
        <div className="grid grid-cols-12 gap-1">
          {months.map((m,i) => { const v = trendData[i].satisfaction; const peak = d.bestMonths.includes(m);
            return <div key={m} className="text-center">
              <div className="h-24 rounded-md bg-secondary/40 relative overflow-hidden">
                <div className={`absolute bottom-0 left-0 right-0 ${peak ? "bg-aurora shadow-glow" : "bg-primary/40"}`} style={{ height: `${v}%` }} />
              </div>
              <div className="text-[10px] mt-1 text-muted-foreground">{m}</div>
            </div>;
          })}
        </div>
      </GlassCard>

      <div className="flex flex-wrap gap-3">
        <Button><Sparkles className="h-4 w-4" />Generate itinerary</Button>
        <Button variant="outline">Save to trips</Button>
        <Button variant="outline">Compare destinations</Button>
      </div>
    </AppShell>
  );
}