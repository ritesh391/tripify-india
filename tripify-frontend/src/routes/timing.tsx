import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Stat, Button } from "@/components/common";
import { trendData } from "@/lib/mock-data";
import { Clock, Calendar, TrendingUp, Cloud, Users, AlertTriangle, Sparkles, Loader2, MapPin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { getToken, getPlaces } from "@/api";

export const Route = createFileRoute("/timing")({ component: Timing, head: () => ({ meta: [{ title: "Travel Timing AI — Tripify India" }] }) });

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function Timing() {
  const [destination, setDestination] = useState("Goa");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [timing, setTiming] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    getPlaces().then(data => setPlaces(data.places || []));
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/timing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ destination })
      });
      const data = await res.json();
      setPredictions(data.predictions || []);
      setTiming(data.timing || null);
    } catch {
      setPredictions([]);
    }
    setLoading(false);
  };

  const uniqueCities = [...new Set(places.map(p => p.city))].slice(0, 8);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Predictive timing"
        title="Travel Timing Intelligence"
        desc="AI forecasts the best month, week, and time-of-day to visit any destination."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Predictions / hr" value="48,210" delta={6} icon={Clock} />
        <Stat label="Avg accuracy" value="93.4%" delta={2} icon={TrendingUp} />
        <Stat label="Weather windows" value="14" delta={5} icon={Cloud} />
        <Stat label="Surge alerts" value="9" delta={-3} icon={AlertTriangle} />
      </div>

      {/* Search */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold">Get AI timing prediction</span>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MapPin className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="Enter destination..."
              className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg pl-10 pr-3 text-sm"
              list="cities-list"
            />
            <datalist id="cities-list">
              {uniqueCities.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <Button onClick={fetchPredictions} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Predict
          </Button>
        </div>
      </GlassCard>

      {loading && (
        <GlassCard className="text-center py-16 mb-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="font-display text-xl font-bold">AI analyzing timing...</p>
          <p className="text-sm text-muted-foreground mt-2">Checking weather, crowds, prices for {destination}</p>
        </GlassCard>
      )}

      {/* Predictions Grid */}
      {!loading && predictions.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          {predictions.map((p, i) => (
            <GlassCard key={i} glow>
              <Badge tone={p.tone || "primary"}>Prediction</Badge>
              <div className="font-display text-2xl font-bold mt-3">{p.destination || destination}</div>
              <div className="text-sm text-muted-foreground mt-1">Best window: <span className="text-foreground font-semibold">{p.bestWindow}</span></div>
              <div className="text-xs text-primary mt-2">{p.insight}</div>
              {p.avoid && <div className="text-xs text-warning mt-1">⚠️ Avoid: {p.avoid}</div>}
            </GlassCard>
          ))}
        </div>
      )}

      {/* Charts */}
      <GlassCard className="mb-6">
        <div className="font-display font-bold mb-1">Seasonal comparison · all destinations</div>
        <div className="text-xs text-muted-foreground mb-4">Visitor satisfaction projected over 12 months</div>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="satisfaction" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: "var(--primary)" }} />
              <Line type="monotone" dataKey="visitors" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="price" stroke="var(--warning)" strokeWidth={2} strokeDasharray="2 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Best months */}
        <GlassCard>
          <div className="font-display font-bold mb-4">Best months for top destinations</div>
          <div className="space-y-3">
            {places.slice(0, 8).map((p) => {
              const bestMonths = timing?.destinationMonths?.[p.city] || 
                ["Oct", "Nov", "Dec", "Jan", "Feb"].slice(0, 3 + (p.id % 3));
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-28 text-sm font-medium truncate">{p.city}</div>
                  <div className="flex-1 grid grid-cols-12 gap-0.5">
                    {months.map((m) => (
                      <div
                        key={m}
                        className={`h-6 rounded ${bestMonths.includes(m) ? "bg-aurora shadow-glow" : "bg-secondary/40"}`}
                        title={m}
                      />
                    ))}
                  </div>
                  <Badge tone="primary">{bestMonths.length} mo</Badge>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Time of day */}
        <GlassCard>
          <div className="font-display font-bold mb-4">Time-of-day intelligence · {destination}</div>
          <div className="space-y-3">
            {(timing?.timeOfDay || [
              { t: "Sunrise (05:30–07:00)", v: 96, n: "Photography · low crowd" },
              { t: "Morning (07–11)", v: 84, n: "Sightseeing · best light" },
              { t: "Midday (11–15)", v: 48, n: "Peak crowd & heat" },
              { t: "Evening (16–19)", v: 88, n: "Golden hour · markets" },
              { t: "Night (20–23)", v: 72, n: "Food walks · cultural shows" },
            ]).map((s: any) => (
              <div key={s.t}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{s.t}</span>
                  <span className="text-primary font-semibold">{s.v}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-aurora" style={{ width: `${s.v}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.n}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}