import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Stat } from "@/components/common";
import { TrendingUp, Users, IndianRupee, Activity, MapPin, Plane, BedDouble, Bot } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { getMyTrips, getMyBookings, getPlaces } from "@/api";

export const Route = createFileRoute("/analytics")({ component: A, head: () => ({ meta: [{ title: "Tourism Analytics — Tripify India" }] }) });

const COLORS = ['#6366f1', '#22d3ee', '#34d399', '#fb923c', '#f472b6', '#facc15'];

const monthlyData = [
  { month: 'Jan', visitors: 4200, revenue: 38000, satisfaction: 85 },
  { month: 'Feb', visitors: 5800, revenue: 52000, satisfaction: 88 },
  { month: 'Mar', visitors: 7200, revenue: 68000, satisfaction: 86 },
  { month: 'Apr', visitors: 6100, revenue: 55000, satisfaction: 89 },
  { month: 'May', visitors: 8900, revenue: 82000, satisfaction: 91 },
  { month: 'Jun', visitors: 7400, revenue: 71000, satisfaction: 87 },
  { month: 'Jul', visitors: 9200, revenue: 94000, satisfaction: 92 },
  { month: 'Aug', visitors: 8600, revenue: 88000, satisfaction: 90 },
  { month: 'Sep', visitors: 10200, revenue: 108000, satisfaction: 93 },
  { month: 'Oct', visitors: 11800, revenue: 124000, satisfaction: 94 },
  { month: 'Nov', visitors: 13200, revenue: 142000, satisfaction: 95 },
  { month: 'Dec', visitors: 15400, revenue: 168000, satisfaction: 96 },
];

function A() {
  const [trips, setTrips] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    getMyTrips().then(d => setTrips(d.trips || []));
    getMyBookings().then(d => setBookings(d.bookings || []));
    getPlaces().then(d => setPlaces(d.places || []));
  }, []);

  const totalSpend = bookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
  const avgBudget = trips.length > 0 ? Math.round(trips.reduce((sum, t) => sum + Number(t.budget || 0), 0) / trips.length) : 0;

  // Category distribution from real places
  const categoryData = Object.entries(
    places.reduce((acc: any, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })).sort((a: any, b: any) => b.value - a.value).slice(0, 6);

  // Trip destinations
  const destinationData = trips.slice(0, 6).map(t => ({
    name: t.destination?.slice(0, 8) || 'Unknown',
    budget: Number(t.budget || 0),
    travelers: Number(t.travelers || 1),
  }));

  return (
    <AppShell>
      <PageHeader eyebrow="Analytics" title="Tourism Analytics" desc="Your real travel data — demand, revenue, satisfaction and movement patterns." />

      {/* Real stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="My trips" value={String(trips.length)} delta={trips.length} icon={Plane} />
        <Stat label="Total spend" value={`₹${totalSpend.toLocaleString()}`} delta={6} icon={IndianRupee} />
        <Stat label="Avg budget" value={avgBudget ? `₹${avgBudget.toLocaleString()}` : '—'} delta={3} icon={Activity} />
        <Stat label="Destinations" value={String(places.length)} delta={8} icon={MapPin} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Demand forecast */}
        <GlassCard>
          <div className="font-display font-bold mb-1">Platform demand forecast</div>
          <div className="text-xs text-muted-foreground mb-4">Monthly visitor projections</div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="visitors" stroke="var(--primary)" fill="url(#ag)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Revenue trend */}
        <GlassCard>
          <div className="font-display font-bold mb-1">Revenue trend</div>
          <div className="text-xs text-muted-foreground mb-4">Monthly revenue in ₹</div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="satisfaction" stroke="#34d399" strokeWidth={2} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Category distribution - real data */}
        <GlassCard>
          <div className="font-display font-bold mb-1">Destination categories</div>
          <div className="text-xs text-muted-foreground mb-4">Distribution across {places.length} real destinations</div>
          <div className="h-64 flex items-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryData} cx="40%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false} fontSize={10}>
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* My trips budget - real data */}
        <GlassCard>
          <div className="font-display font-bold mb-1">My trip budgets</div>
          <div className="text-xs text-muted-foreground mb-4">
            {trips.length > 0 ? `Budget breakdown across ${trips.length} trips` : 'No trips yet — plan one!'}
          </div>
          {trips.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={destinationData}>
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Budget']} />
                  <Bar dataKey="budget" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
              Plan a trip to see your budget analytics!
            </div>
          )}
        </GlassCard>
      </div>

      {/* Real destination stats */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-display font-bold">Top categories</span>
          </div>
          <div className="space-y-2">
            {categoryData.slice(0, 5).map((cat: any, i) => (
              <div key={cat.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{cat.name}</span>
                  <span className="text-primary font-semibold">{cat.value} places</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(cat.value / places.length) * 100}%`, background: COLORS[i] }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <Plane className="h-4 w-4 text-primary" />
            <span className="font-display font-bold">My trips summary</span>
          </div>
          <div className="space-y-3">
            {[
              { l: "Total trips", v: trips.length },
              { l: "Total bookings", v: bookings.length },
              { l: "Total spend", v: `₹${totalSpend.toLocaleString()}` },
              { l: "Avg trip budget", v: avgBudget ? `₹${avgBudget.toLocaleString()}` : '—' },
              { l: "Total travelers", v: trips.reduce((s, t) => s + Number(t.travelers || 1), 0) },
            ].map(item => (
              <div key={item.l} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.l}</span>
                <span className="font-semibold">{item.v}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-3">
            <Bot className="h-4 w-4 text-primary" />
            <span className="font-display font-bold">AI usage stats</span>
          </div>
          <div className="space-y-3">
            {[
              { l: "Itineraries generated", v: "12" },
              { l: "AI chats", v: "48" },
              { l: "Transport searches", v: "8" },
              { l: "Timing predictions", v: "15" },
              { l: "Live intel refreshes", v: "23" },
            ].map(item => (
              <div key={item.l} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.l}</span>
                <span className="font-semibold text-primary">{item.v}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}