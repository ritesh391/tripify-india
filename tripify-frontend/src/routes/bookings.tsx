import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Plane, Hotel, Train, Car, QrCode, Download, X, Clock, Check, RefreshCw, ChevronRight, Loader2 } from "lucide-react";
import { getMyBookings, cancelBooking } from "@/api";

export const Route = createFileRoute("/bookings")({ component: Bookings, head: () => ({ meta: [{ title: "My Bookings — Tripify India" }] }) });

const typeIcon: any = { Flight: Plane, Stay: Hotel, Train: Train, Cab: Car };
const tabs = ["All", "Upcoming", "Past", "Cancelled"];

function Bookings() {
  const [tab, setTab] = useState("All");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings().then(data => {
      setBookings(data.bookings || []);
      setLoading(false);
    });
  }, []);

  const handleCancel = async (id: number) => {
    await cancelBooking(id);
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const filtered = tab === "All" ? bookings
    : tab === "Upcoming" ? bookings.filter(b => b.status === 'confirmed' || b.status === 'scheduled')
    : tab === "Past" ? bookings.filter(b => b.status === 'completed' || b.status === 'boarded')
    : bookings.filter(b => b.status === 'cancelled');

  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'scheduled').length;
  const totalSpend = bookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
  const refunded = bookings.filter(b => b.status === 'refunded').reduce((sum, b) => sum + Number(b.price || 0), 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Travel wallet"
        title="My Bookings"
        desc="All your tickets, stays and refunds in one premium dashboard."
        action={<Button variant="outline"><Download className="h-4 w-4" />Export all</Button>}
      />

      <div className="grid sm:grid-cols-4 gap-3 mb-6">
        {[
          ["Upcoming", upcoming],
          ["Total Bookings", bookings.length],
          ["Refunds", `₹${refunded.toLocaleString()}`],
          ["Spend Total", `₹${totalSpend.toLocaleString()}`]
        ].map(([l, v]) => (
          <GlassCard key={l}>
            <div className="text-xs uppercase text-muted-foreground">{l}</div>
            <div className="font-display text-2xl font-bold mt-1">{v}</div>
          </GlassCard>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 h-9 rounded-lg text-xs font-semibold border transition-all ${tab === t ? "bg-primary/15 border-primary/40 text-primary" : "border-border/60 text-muted-foreground hover:bg-secondary/40"}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Plane className="h-14 w-14 mx-auto mb-4 text-primary/30" />
          <p className="font-display text-xl font-bold">No bookings yet!</p>
          <p className="text-sm mt-2">Book a stay or flight to see it here.</p>
          <Link to="/planner"><Button className="mt-6">Plan a trip</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => {
            const Icon = typeIcon[b.type] || Plane;
            const tone = b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : b.status === 'refunded' ? 'warning' : 'info';
            return (
              <GlassCard key={b.id} className="hover:ring-1 hover:ring-primary/30 transition-all">
                <div className="grid md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-1">
                    <div className="h-11 w-11 rounded-xl bg-secondary/60 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="md:col-span-5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{b.title}</span>
                      <Badge tone={tone as any}>{b.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
                      <span>{b.type}</span>·
                      <span className="font-mono">{b.booking_ref}</span>·
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.date}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2 font-display font-bold">₹{Number(b.price).toLocaleString()}</div>
                  <div className="md:col-span-4 flex flex-wrap justify-end gap-2">
                    {b.status === 'refunded' && (
                      <div className="flex items-center gap-1.5 text-xs text-success"><RefreshCw className="h-3 w-3" />Refund credited</div>
                    )}
                    {b.status === 'cancelled' && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><X className="h-3 w-3" />Cancelled</div>
                    )}
                    {(b.status === 'confirmed' || b.status === 'scheduled') && (
                      <>
                        <button className="h-9 px-3 rounded-lg border border-border/60 text-xs hover:bg-secondary/40 inline-flex items-center gap-1">
                          <QrCode className="h-3.5 w-3.5" />Ticket
                        </button>
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="h-9 px-3 rounded-lg border border-border/60 text-xs hover:bg-secondary/40 inline-flex items-center gap-1 text-destructive">
                          <X className="h-3.5 w-3.5" />Cancel
                        </button>
                      </>
                    )}
                    <Link to="/checkout" className="h-9 px-3 rounded-lg bg-aurora text-background text-xs font-semibold inline-flex items-center gap-1 shadow-glow">
                      View<ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}