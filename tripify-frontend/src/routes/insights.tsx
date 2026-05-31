import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Lightbulb, Bot, RefreshCw, Loader2, TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { getToken } from "@/api";

export const Route = createFileRoute("/insights")({ component: I, head: () => ({ meta: [{ title: "AI Insights & Predictions — Tripify India" }] }) });

const toneMap: any = {
  alert: "warning",
  warning: "warning",
  success: "success",
  info: "info",
  active: "success",
};

const iconMap: any = {
  alert: AlertTriangle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
  active: TrendingUp,
};

function I() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({})
      });
      const data = await res.json();
      setInsights(data.insights || []);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    } catch {
      setInsights([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchInsights(); }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Predictions"
        title="AI Insights & Predictions"
        desc="Every signal from every agent — ranked by impact across India."
        action={
          <Button variant="outline" onClick={fetchInsights} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        }
      />

      {lastUpdated && (
        <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse inline-block" />
          Last updated: {lastUpdated}
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <GlassCard key={i}>
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-secondary/60 rounded w-3/4" />
                <div className="h-3 bg-secondary/40 rounded w-full" />
                <div className="h-3 bg-secondary/40 rounded w-2/3" />
                <div className="h-1.5 bg-secondary/60 rounded w-full" />
              </div>
            </GlassCard>
          ))}
        </div>
      ) : insights.length === 0 ? (
        <GlassCard className="text-center py-16">
          <Bot className="h-12 w-12 mx-auto mb-4 text-primary/30" />
          <p className="font-display text-xl font-bold">No insights yet</p>
          <p className="text-sm text-muted-foreground mt-2">Click Refresh to load AI insights</p>
          <Button className="mt-4" onClick={fetchInsights}>Load Insights</Button>
        </GlassCard>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((a, i) => {
            const StatusIcon = iconMap[a.status] || Bot;
            return (
              <GlassCard key={i} glow={a.status === "alert" || a.status === "warning"}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">{a.name}</span>
                  </div>
                  <Badge tone={toneMap[a.status] || "info"}>{a.status}</Badge>
                </div>
                <div className="flex items-start gap-2 text-sm mt-3">
                  <Lightbulb className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{a.insight}</span>
                </div>
                {a.action && (
                  <div className="mt-2 text-xs text-primary bg-primary/10 rounded-lg px-2 py-1.5">
                    → {a.action}
                  </div>
                )}
                {a.destination && (
                  <div className="text-xs text-muted-foreground mt-2">📍 {a.destination}</div>
                )}
                <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-aurora transition-all" style={{ width: `${a.confidence}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>Confidence</span>
                  <span className="text-primary font-semibold">{a.confidence}%</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}