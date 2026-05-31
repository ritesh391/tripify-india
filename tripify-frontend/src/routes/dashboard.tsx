import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, Stat, GlassCard, Badge, ScoreRing, Button } from "@/components/common";
import { aiAgents, alerts, trendData, radarData } from "@/lib/mock-data";
import { Users, TrendingUp, MapPin, Sparkles, Bot, AlertTriangle, Info, CheckCircle2, ArrowRight, Plane, Trash2, Loader2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar } from "recharts";
import { getMyTrips, getPlaces, deleteTrip } from "@/api";

export const Route = createFileRoute("/dashboard")({ component: Dashboard, head: () => ({ meta: [{ title: "Intelligence Dashboard — Tripify India" }] }) });

const alertIcon = { warning: AlertTriangle, danger: AlertTriangle, info: Info, success: CheckCircle2 } as const;
const alertTone = { warning: "warning", danger: "danger", info: "info", success: "success" } as const;

function Dashboard() {
  const [trips, setTrips] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('tripify_user');
    if (u) setUser(JSON.parse(u));

    getMyTrips().then(data => {
      setTrips(data.trips || []);
      setLoadingTrips(false);
    });

    getPlaces().then(data => {
      setPlaces(data.places || []);
    });
  }, []);

  const handleDelete = async (id: number) => {
    await deleteTrip(id);
    setTrips(trips.filter(t => t.id !== id));
  };

  const topPlaces = places.slice(0, 8).map(p => ({
    name: p.name.length > 10 ? p.name.slice(0, 10) + '...' : p.name,
    rating: parseFloat(p.rating),
    category: p.category
  }));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Live · 15 agents online"
        title={user ? `Welcome back, ${user.name?.split(' ')[0]}! 👋` : "Intelligence Dashboard"}
        desc="Real-time tourism intelligence across India."
        action={<Link to="/planner" search={{ destination: "" }}><Button>New trip plan <ArrowRight className="h-4 w-4" /></Button></Link>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Your trips" value={String(trips.length)} delta={0} icon={Plane} />
        <Stat label="Destinations" value={String(places.length)} delta={0} icon={MapPin} />
        <Stat label="Avg satisfaction" value="91.4" delta={4} icon={TrendingUp} />
        <Stat label="AI agents online" value="15" delta={0} icon={Sparkles} />
      </div>

      <GlassCard className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-display font-bold">My Trips</div>
          <Link to="/planner" search={{ destination: "" }}><span className="text-xs text-primary">+ New trip</span></Link>
        </div>
        {loadingTrips ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Plane className="h-10 w-10 mx-auto mb-3 text-primary/30" />
            <p className="font-semibold">No trips yet!</p>
            <p className="text-sm mt-1">Go to Trip Planner and create your first trip.</p>
            <Link to="/planner" search={{ destination: "" }}><Button className="mt-4">Plan a trip</Button></Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <div key={trip.id} className="rounded-xl border border-border/50 bg-secondary/30 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display font-bold text-sm">{trip.title}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 text-primary" />{trip.destination}
                    </div>
                  </div>
                  <Badge tone="primary">{trip.status}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>📅 {trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-IN') : 'TBD'}</div>
                  <div>👥 {trip.travelers} travelers</div>
                  <div>💰 ₹{Number(trip.budget).toLocaleString()}</div>
                  <div>📍 {trip.destination}</div>
                </div>
                <button
                  onClick={() => handleDelete(trip.id)}
                  className="mt-3 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-display font-bold">Tourism flow · 12 months</div>
              <div className="text-xs text-muted-foreground">Visitors vs satisfaction vs price index</div>
            </div>
            <Badge tone="primary">Forecast AI</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6}/><stop offset="100%" stopColor="var(--primary)" stopOpacity={0}/></linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5}/><stop offset="100%" stopColor="var(--accent)" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="visitors" stroke="var(--primary)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="satisfaction" stroke="var(--accent)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="font-display font-bold mb-2">Destination DNA</div>
          <div className="text-xs text-muted-foreground mb-4">India composite score</div>
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="axis" stroke="var(--muted-foreground)" fontSize={11} />
                <Radar dataKey="v" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold">Multi-agent grid</div>
            <Badge tone="success">All systems nominal</Badge>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiAgents.map((a) => (
              <div key={a.name} className="rounded-xl border border-border/50 bg-secondary/30 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Bot className="h-4 w-4 text-primary" /><span className="text-sm font-semibold">{a.name}</span></div>
                  <span className={`h-2 w-2 rounded-full ${a.status === "alert" ? "bg-destructive" : a.status === "idle" ? "bg-muted-foreground" : "bg-success"} animate-pulse`} />
                </div>
                <div className="text-xs text-muted-foreground mt-2 line-clamp-2">{a.insight}</div>
                <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-aurora" style={{ width: `${a.confidence}%` }} /></div>
                <div className="text-[10px] text-muted-foreground mt-1">Confidence {a.confidence}%</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="font-display font-bold mb-4">Live alerts</div>
          <div className="space-y-3">
            {alerts.map((a, i) => {
              const Icon = alertIcon[a.type as keyof typeof alertIcon];
              return (
                <div key={i} className="rounded-xl border border-border/40 p-3 bg-secondary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4 text-primary" />
                    <Badge tone={alertTone[a.type as keyof typeof alertTone]}>{a.type}</Badge>
                    <span className="ml-auto text-[10px] text-muted-foreground">{a.time}</span>
                  </div>
                  <div className="text-sm font-semibold">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 mb-6">
        <GlassCard className="lg:col-span-1">
          <div className="font-display font-bold mb-4">India composite</div>
          <div className="grid grid-cols-2 gap-4">
            <ScoreRing label="Weather" value={86} color="info" />
            <ScoreRing label="Crowd" value={62} color="warning" />
            <ScoreRing label="Safety" value={84} color="success" />
            <ScoreRing label="Eco" value={78} color="success" />
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold">Top rated destinations</div>
            <Link to="/explore" search={{}}><span className="text-xs text-primary">View all →</span></Link>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={topPlaces}>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} domain={[4, 5]} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="rating" fill="var(--primary)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}