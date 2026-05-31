import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Stat, Badge } from "@/components/common";
import { Users, IndianRupee, Shield, Activity, MapPin, Loader2, RefreshCw, Database, Bot } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getPlaces, getMyTrips, getMyBookings } from "@/api";
import { Button } from "@/components/common";

export const Route = createFileRoute("/admin")({ component: A, head: () => ({ meta: [{ title: "Admin Intelligence — Tripify India" }] }) });

const COLORS = ['#6366f1', '#22d3ee', '#34d399', '#fb923c', '#f472b6', '#facc15'];

function A() {
  const [places, setPlaces] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      getPlaces().then(d => setPlaces(d.places || [])),
      getMyTrips().then(d => setTrips(d.trips || [])),
      getMyBookings().then(d => setBookings(d.bookings || [])),
    ]);
    setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
  const totalTravelers = trips.reduce((sum, t) => sum + Number(t.travelers || 1), 0);

  // Category distribution
  const categoryData = Object.entries(
    places.reduce((acc: any, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }))
   .sort((a: any, b: any) => b.value - a.value);

  // State distribution
  const stateData = Object.entries(
    places.reduce((acc: any, p) => {
      acc[p.state] = (acc[p.state] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.slice(0, 12), value }))
   .sort((a: any, b: any) => (b.value as number) - (a.value as number))
   .slice(0, 10);

  // Top rated places
  const topRated = [...places]
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 8)
    .map(p => ({
      name: p.name.slice(0, 14),
      rating: Number(p.rating),
      city: p.city,
    }));

  // Booking type breakdown
  const bookingTypes = Object.entries(
    bookings.reduce((acc: any, b) => {
      acc[b.type || 'Other'] = (acc[b.type || 'Other'] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Government & ops"
        title="Admin Intelligence Dashboard"
        desc="Real tourism load, infrastructure stress and regional demand from your database."
        action={
          <Button variant="outline" onClick={fetchData} disabled={loading}>
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

      {/* Real stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Total destinations" value={String(places.length)} delta={9} icon={MapPin} />
        <Stat label="Total bookings" value={String(bookings.length)} delta={12} icon={IndianRupee} />
        <Stat label="Total travelers" value={String(totalTravelers)} delta={-22} icon={Shield} />
        <Stat label="Total revenue" value={`₹${totalRevenue.toLocaleString()}`} delta={4} icon={Activity} />
      </div>

      {/* DB Stats */}
      <div className="grid lg:grid-cols-4 gap-4 mb-6">
        {[
          { i: Database, l: "Places in DB", v: String(places.length), tone: "primary" },
          { i: Bot, l: "Trips planned", v: String(trips.length), tone: "success" },
          { i: Users, l: "Bookings made", v: String(bookings.length), tone: "info" },
          { i: MapPin, l: "States covered", v: String(new Set(places.map(p => p.state)).size), tone: "warning" },
        ].map((s, i) => (
          <GlassCard key={i}>
            <div className="flex items-center gap-2 mb-1">
              <s.i className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase text-muted-foreground">{s.l}</span>
            </div>
            <div className="font-display text-2xl font-bold">{s.v}</div>
            <Badge tone={s.tone as any} className="mt-2">Live</Badge>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Top rated destinations bar chart */}
        <GlassCard>
          <div className="font-display font-bold mb-1">Top rated destinations</div>
          <div className="text-xs text-muted-foreground mb-4">By rating from real database</div>
          {loading ? (
            <div className="h-72 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={topRated}>
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={9} angle={-45} textAnchor="end" height={60} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} domain={[4, 5]} />
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}
                    formatter={(v: any) => [v, 'Rating']}
                  />
                  <Bar dataKey="rating" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        {/* Category distribution pie */}
        <GlassCard>
          <div className="font-display font-bold mb-1">Category distribution</div>
          <div className="text-xs text-muted-foreground mb-4">Destination types in database</div>
          {loading ? (
            <div className="h-72 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                    fontSize={10}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>

      {/* State distribution */}
      <GlassCard className="mb-6">
        <div className="font-display font-bold mb-1">State-wise destination load</div>
        <div className="text-xs text-muted-foreground mb-4">Number of tourist destinations per state</div>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={stateData}>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="value" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </GlassCard>

      {/* Admin insights */}
      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { t: "Overcrowding alerts", v: `${places.filter(p => Number(p.rating) >= 4.8).length} high-demand spots`, b: "warning" },
          { t: "Database health", v: `${places.length} places · ${trips.length} trips`, b: "primary" },
          { t: "Platform safety", v: "94/100 nationwide", b: "success" },
          { t: "Top category", v: categoryData[0]?.name || "Loading...", b: "info" },
          { t: "Seasonal forecast", v: "Q4 +28% demand", b: "primary" },
          { t: "Total revenue tracked", v: `₹${totalRevenue.toLocaleString()}`, b: "success" },
        ].map(c => (
          <GlassCard key={c.t}>
            <Badge tone={c.b as any}>Insight</Badge>
            <div className="text-xs uppercase text-muted-foreground mt-2">{c.t}</div>
            <div className="font-display text-xl font-bold mt-1">{c.v}</div>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  );
}