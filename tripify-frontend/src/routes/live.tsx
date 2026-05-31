import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Stat, Button } from "@/components/common";
import { Activity, AlertTriangle, Info, CheckCircle2, Users, Cloud, Loader2, RefreshCw, MapPin } from "lucide-react";
import { getToken, getPlaces } from "@/api";

export const Route = createFileRoute("/live")({ component: Live, head: () => ({ meta: [{ title: "Live Tourism Intelligence — Tripify India" }] }) });

const ic: any = { warning: AlertTriangle, danger: AlertTriangle, info: Info, success: CheckCircle2 };

function Live() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchLiveIntel = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/live', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({})
      });
      const data = await res.json();
      setAlerts(data.alerts || []);
      setDestinations(data.destinations || []);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    } catch {
      setAlerts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveIntel();
  }, []);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Live · streaming"
        title="Live Tourism Intelligence"
        desc="Real-time alerts, density and risk signals across all monitored destinations."
        action={
          <Button variant="outline" onClick={fetchLiveIntel} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Live tourists" value="248,392" delta={7} icon={Users} />
        <Stat label="Active alerts" value={String(alerts.length)} delta={-2} icon={AlertTriangle} />
        <Stat label="Weather zones" value="9" delta={3} icon={Cloud} />
        <Stat label="Signals/sec" value="1,840" delta={11} icon={Activity} />
      </div>

      {lastUpdated && (
        <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse inline-block" />
          Last updated: {lastUpdated}
        </div>
      )}

      {loading ? (
        <GlassCard className="text-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="font-display text-xl font-bold">Fetching live intelligence...</p>
          <p className="text-sm text-muted-foreground mt-2">AI scanning 96 destinations across India</p>
        </GlassCard>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-4 mb-6">
            {alerts.map((a, i) => {
              const I = ic[a.type] || Info;
              return (
                <GlassCard key={i} glow={a.type === "danger"}>
                  <div className="flex items-center gap-2 mb-2">
                    <I className="h-4 w-4 text-primary" />
                    <Badge tone={a.type as any}>{a.type}</Badge>
                    <span className="ml-auto text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{a.desc}</div>
                  {a.destination && (
                    <div className="flex items-center gap-1 text-xs text-primary mt-2">
                      <MapPin className="h-3 w-3" />{a.destination}
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {destinations.map((d: any, i: number) => (
              <GlassCard key={i}>
                <div className="flex justify-between items-center">
                  <div className="font-display font-bold truncate">{d.name}</div>
                  <span className={`h-2 w-2 rounded-full animate-pulse ${d.status === 'alert' ? 'bg-destructive' : d.status === 'busy' ? 'bg-warning' : 'bg-success'}`} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{d.state}</div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Crowd</span>
                    <span className="font-semibold">{d.crowd}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${d.crowd > 80 ? 'bg-destructive' : d.crowd > 60 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${d.crowd}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Weather</span>
                    <span className="font-semibold">{d.weather}</span>
                  </div>
                  <div className="text-xs text-primary mt-1">{d.alert}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}