import { getStay } from "@/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Star, MapPin, Wifi, Coffee, Wind, Waves, ShieldCheck, Sparkles, Check, BedDouble, Loader2 } from "lucide-react";

export const Route = createFileRoute("/stays_/$id")({ 
  component: StayDetail, 
  head: () => ({ meta: [{ title: "Stay details — Tripify India" }] }) 
});

const rooms = [
  { id: "std", name: "Standard Room", desc: "Garden view · 28 m²", multiplier: 1, perks: ["Free cancel", "Breakfast"], left: 4 },
  { id: "dlx", name: "Deluxe Room", desc: "Best view · King bed · 36 m²", multiplier: 1.6, perks: ["Free cancel", "Breakfast", "Spa credit"], left: 2, popular: true },
  { id: "ste", name: "Suite", desc: "Private balcony · 64 m²", multiplier: 3, perks: ["All-inclusive", "Butler", "Airport pickup"], left: 1 },
];

function StayDetail() {
  const { id } = Route.useParams();
  const [stay, setStay] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState("dlx");

  useEffect(() => {
  getStay(id)
    .then(data => { setStay(data.stay); setLoading(false); })
    .catch(() => setLoading(false));
}, [id]);

  if (loading) return (
    <AppShell>
      <div className="flex items-center justify-center py-40">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    </AppShell>
  );

  if (!stay) return (
    <AppShell>
      <div className="text-center py-40 text-muted-foreground">Stay not found.</div>
    </AppShell>
  );

  const basePrice = Number(stay.price);
  const r = rooms.find(x => x.id === room)!;
  const roomPrice = Math.round(basePrice * r.multiplier);
  const nights = 3;
  const taxes = Math.round(roomPrice * nights * 0.12);
  const discount = 820;
  const total = roomPrice * nights + taxes - discount;

  return (
    <AppShell>
      {/* Image Gallery */}
      <div className="grid lg:grid-cols-3 gap-2 mb-6">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden glass !p-0 h-72">
          {stay.image_url
            ? <img src={stay.image_url} alt={stay.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 flex items-center justify-center"><BedDouble className="h-20 w-20 text-primary/30" /></div>
          }
        </div>
        <div className="grid grid-cols-2 gap-2 h-72">
          {[0,1,2,3].map(i => (
            <div key={i} className="rounded-xl overflow-hidden bg-secondary/40 flex items-center justify-center">
              {stay.image_url
                ? <img src={stay.image_url} className="w-full h-full object-cover" alt="" />
                : <BedDouble className="h-8 w-8 text-primary/20" />
              }
            </div>
          ))}
        </div>
      </div>

      <PageHeader 
        eyebrow={`${stay.type} · ${stay.city}`} 
        title={stay.name} 
        desc={stay.description || `A wonderful ${stay.type} in ${stay.city}, ${stay.state}.`} 
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone="primary"><Star className="h-3 w-3 fill-current" /> {Number(stay.rating).toFixed(1)} · {stay.reviews} reviews</Badge>
            <Badge tone="success"><ShieldCheck className="h-3 w-3" /> Verified</Badge>
            <Badge tone="info"><MapPin className="h-3 w-3" /> {stay.city}, {stay.state}</Badge>
          </div>

          <GlassCard>
            <div className="font-display font-bold mb-3">Amenities</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {(stay.amenities || []).map((a: string) => (
                <div key={a} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/40">
                  <Wifi className="h-4 w-4 text-primary" />{a}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="font-display font-bold mb-3">Select your room</div>
            <div className="space-y-2">
              {rooms.map(rm => {
                const rmPrice = Math.round(basePrice * rm.multiplier);
                return (
                  <button key={rm.id} onClick={() => setRoom(rm.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${room === rm.id ? "bg-primary/10 border-primary/40 shadow-glow" : "border-border/60 hover:bg-secondary/40"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{rm.name}</span>
                          {rm.popular && <Badge tone="primary">Most booked</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{rm.desc}</div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {rm.perks.map(p => (
                            <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground flex items-center gap-1">
                              <Check className="h-2.5 w-2.5 text-success" />{p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl font-bold">₹{rmPrice.toLocaleString()}</div>
                        <div className="text-[10px] text-warning">Only {rm.left} left</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard glow>
            <div className="flex items-center gap-2 mb-2"><Sparkles className="h-4 w-4 text-primary" /><span className="font-semibold">AI Booking Optimizer</span></div>
            <p className="text-sm text-muted-foreground">Book now to get the best available rate for <span className="text-foreground font-semibold">{stay.name}</span>.</p>
          </GlassCard>
        </div>

        {/* Sticky booking card */}
        <div className="space-y-4">
          <GlassCard className="sticky top-20">
            <div className="flex items-baseline justify-between">
              <div><span className="font-display text-3xl font-bold">₹{roomPrice.toLocaleString()}</span><span className="text-muted-foreground text-sm"> /night</span></div>
              <Badge tone="success">Free cancel</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2 rounded-lg bg-secondary/40 text-xs"><div className="text-muted-foreground">Check-in</div><div className="font-semibold">Mar 10</div></div>
              <div className="p-2 rounded-lg bg-secondary/40 text-xs"><div className="text-muted-foreground">Check-out</div><div className="font-semibold">Mar 13</div></div>
              <div className="col-span-2 p-2 rounded-lg bg-secondary/40 text-xs"><div className="text-muted-foreground">Guests</div><div className="font-semibold">2 adults · 1 child</div></div>
            </div>
            <div className="mt-4 space-y-1.5 text-sm border-t border-border/40 pt-4">
              <div className="flex justify-between text-muted-foreground"><span>₹{roomPrice.toLocaleString()} × {nights} nights</span><span>₹{(roomPrice * nights).toLocaleString()}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Taxes & fees</span><span>₹{taxes.toLocaleString()}</span></div>
              <div className="flex justify-between text-success"><span>AI discount</span><span>− ₹{discount}</span></div>
              <div className="flex justify-between font-display font-bold text-lg pt-2 border-t border-border/40"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>
           <Link
            to="/checkout"
            search={{
               type: 'Stay',
            stayName: stay.name,
            stayCity: stay.city,
            roomName: r.name,
             price: roomPrice,
             nights: 3,
             date: '',
             duration: '',
          }}
>

                <Button className="w-full mt-4">Reserve now</Button>
             </Link>
            <div className="text-[11px] text-muted-foreground text-center mt-2">You won't be charged yet</div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}