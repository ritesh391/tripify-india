import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge } from "@/components/common";
import { Brain, MapPin, Plane, Calendar, IndianRupee, Users, Loader2 } from "lucide-react";
import { getMyTrips, getMyBookings } from "@/api";

export const Route = createFileRoute("/memory")({ component: M, head: () => ({ meta: [{ title: "Travel Memory — Tripify India" }] }) });

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function M() {
  const [trips, setTrips] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('tripify_user');
    if (u) setUser(JSON.parse(u));
    Promise.all([
      getMyTrips().then(d => setTrips(d.trips || [])),
      getMyBookings().then(d => setBookings(d.bookings || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const totalSpend = bookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
  const totalTravelers = trips.reduce((sum, t) => sum + Number(t.travelers || 1), 0);
  const uniqueDestinations = [...new Set(trips.map(t => t.destination))];

  // Get persona based on most common trip type
  const getPersona = () => {
    if (trips.length === 0) return 'Explorer';
    const destinations = trips.map(t => t.destination?.toLowerCase() || '');
    if (destinations.some(d => d.includes('goa') || d.includes('beach'))) return 'Beach Lover';
    if (destinations.some(d => d.includes('manali') || d.includes('spiti') || d.includes('ladakh'))) return 'Adventurer';
    if (destinations.some(d => d.includes('jaipur') || d.includes('agra') || d.includes('hampi'))) return 'Heritage Seeker';
    return 'Explorer';
  };

  // Build timeline from real trips
  const timeline = trips.map(t => ({
    date: t.created_at ? new Date(t.created_at) : new Date(),
    title: t.title || t.destination,
    destination: t.destination,
    details: `${t.travelers} traveler${t.travelers > 1 ? 's' : ''} · ₹${Number(t.budget).toLocaleString()} budget · ${t.status}`,
    month: t.created_at ? months[new Date(t.created_at).getMonth()] : 'May',
    year: t.created_at ? new Date(t.created_at).getFullYear().toString() : '2026',
  })).sort((a, b) => b.date.getTime() - a.date.getTime());

  // Placeholder timeline if no trips
  const placeholderTimeline = [
    { month: 'Mar', year: '2026', title: 'Spiti Valley', destination: 'Spiti', details: '7 days · ₹42k · Adventure' },
    { month: 'Nov', year: '2025', title: 'Kerala Backwaters', destination: 'Alleppey', details: '5 days · ₹38k · Wellness' },
    { month: 'Jun', year: '2025', title: 'Ladakh Road Trip', destination: 'Leh', details: '12 days · ₹68k · Adventure' },
    { month: 'Feb', year: '2025', title: 'Jaipur & Udaipur', destination: 'Jaipur', details: '6 days · ₹45k · Heritage' },
  ];

  const displayTimeline = timeline.length > 0 ? timeline : placeholderTimeline;

  // AI learned preferences
  const learnedPreferences = [
    {
      t: "Favourite destinations",
      v: uniqueDestinations.length > 0 ? uniqueDestinations.slice(0, 3).join(', ') : "Not enough data yet"
    },
    {
      t: "Avg trip budget",
      v: trips.length > 0 ? `₹${Math.round(trips.reduce((s, t) => s + Number(t.budget || 0), 0) / trips.length).toLocaleString()}` : "Plan a trip to learn"
    },
    {
      t: "Travel persona",
      v: getPersona()
    },
    {
      t: "Preferred group size",
      v: trips.length > 0 ? `${Math.round(totalTravelers / trips.length)} people avg` : "Solo or group?"
    },
    {
      t: "Total trips planned",
      v: `${trips.length} trips on Tripify`
    },
    {
      t: "Total bookings",
      v: `${bookings.length} bookings made`
    },
  ];

  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Memory"
        title={user ? `${user.name?.split(' ')[0]}'s Travel Memory` : "Your Travel Memory"}
        desc="Every trip, preference and pattern — learned by AI over time."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Trips planned", v: String(trips.length), i: Plane },
          { l: "Destinations", v: String(uniqueDestinations.length), i: MapPin },
          { l: "Total spend", v: totalSpend > 0 ? `₹${totalSpend.toLocaleString()}` : '—', i: IndianRupee },
          { l: "Persona", v: getPersona(), i: Brain },
        ].map(s => (
          <GlassCard key={s.l}>
            <div className="flex items-center gap-2 mb-1">
              <s.i className="h-3.5 w-3.5 text-primary" />
              <div className="text-xs uppercase text-muted-foreground">{s.l}</div>
            </div>
            <div className="font-display text-xl font-bold mt-1 truncate">{s.v}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <GlassCard className="lg:col-span-2">
          <div className="font-display font-bold mb-4 flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            Memory timeline
            {trips.length === 0 && <Badge tone="warning">Sample data</Badge>}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="relative pl-6 border-l border-border/40 space-y-5">
              {displayTimeline.map((e: any, i: number) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[31px] top-0 h-6 w-6 rounded-full bg-aurora flex items-center justify-center text-[10px] text-background font-bold">
                    {e.month[0]}
                  </div>
                  <div className="text-xs text-primary font-semibold">{e.month} {e.year}</div>
                  <div className="font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-muted-foreground" />{e.title}
                  </div>
                  <div className="text-sm text-muted-foreground">{e.details}</div>
                </div>
              ))}

              {trips.length === 0 && (
                <div className="text-xs text-muted-foreground mt-4 p-3 bg-secondary/30 rounded-lg">
                  💡 Plan your first trip to start building real memories!
                </div>
              )}
            </div>
          )}
        </GlassCard>

        {/* AI Learned preferences */}
        <div className="space-y-3">
          <div className="font-display font-bold flex items-center gap-2 px-1">
            <Brain className="h-4 w-4 text-primary" />
            AI learned preferences
          </div>
          {learnedPreferences.map(p => (
            <GlassCard key={p.t}>
              <Badge tone="primary">Learned</Badge>
              <div className="text-xs uppercase text-muted-foreground mt-2">{p.t}</div>
              <div className="font-semibold mt-0.5">{p.v}</div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Bookings memory */}
      {bookings.length > 0 && (
        <GlassCard className="mt-6">
          <div className="font-display font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Booking history
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bookings.map((b, i) => (
              <div key={i} className="rounded-xl bg-secondary/30 border border-border/40 p-3">
                <div className="font-semibold text-sm">{b.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{b.type} · {b.booking_ref}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-primary">₹{Number(b.price).toLocaleString()}</span>
                  <Badge tone={b.status === 'confirmed' ? 'success' : 'warning'}>{b.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </AppShell>
  );
}