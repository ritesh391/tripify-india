import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { BedDouble, Home, Palmtree, TentTree, Castle, Leaf, Sparkles, Star, Wifi, Coffee, Wind, Search, MapPin, Filter, ShieldCheck, Loader2 } from "lucide-react";
import { getStays } from "@/api";

export const Route = createFileRoute("/stays")({ component: Stays, head: () => ({ meta: [{ title: "Stays — Tripify India" }] }) });

const types = [
  { id: "all", label: "All", icon: BedDouble },
  { id: "hotel", label: "Hotels", icon: BedDouble },
  { id: "homestay", label: "Homestays", icon: Home },
  { id: "resort", label: "Resorts", icon: Palmtree },
  { id: "hostel", label: "Hostels", icon: TentTree },
  { id: "villa", label: "Villas", icon: Castle },
  { id: "eco", label: "Eco-Stays", icon: Leaf },
];

function Stays() {
  const [type, setType] = useState("all");
  const [price, setPrice] = useState(40000);
  const [city, setCity] = useState("");
  const [stays, setStays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStays = async () => {
    setLoading(true);
    const data = await getStays({ city, type, maxPrice: price });
    setStays(data.stays || []);
    setLoading(false);
  };

  useEffect(() => { fetchStays(); }, [type, price]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Accommodation"
        title="Find your stay"
        desc="AI curates hotels, homestays, resorts, hostels, villas and eco-stays across India."
      />

      <GlassCard className="mb-6">
        <div className="grid md:grid-cols-5 gap-3">
          <div className="md:col-span-2 relative">
            <MapPin className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Search by city..."
              className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg pl-10 pr-3 text-sm"
            />
          </div>
          <input type="date" className="h-11 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm" />
          <input type="date" className="h-11 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm" />
          <Button onClick={fetchStays}><Search className="h-4 w-4" />Search</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {types.map(t => {
            const I = t.icon;
            return (
              <button key={t.id} onClick={() => setType(t.id)}
                className={`inline-flex items-center gap-2 px-3 h-9 rounded-lg text-xs font-semibold border transition-all ${type === t.id ? "bg-primary/15 text-primary border-primary/40 shadow-glow" : "border-border/60 text-muted-foreground hover:bg-secondary/40"}`}>
                <I className="h-3.5 w-3.5" />{t.label}
              </button>
            );
          })}
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <div className="space-y-4">
          <GlassCard>
            <div className="flex items-center gap-2 mb-3"><Filter className="h-4 w-4 text-primary" /><div className="font-display font-bold">Filters</div></div>
            <div className="space-y-5 text-sm">
              <div>
                <div className="text-xs uppercase text-muted-foreground mb-2">Price · up to ₹{price.toLocaleString()}</div>
                <input type="range" min={1000} max={40000} step={500} value={price} onChange={e => setPrice(+e.target.value)} className="w-full accent-primary" />
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground mb-2">Amenities</div>
                <div className="space-y-2">
                  {[["Wifi", Wifi], ["Breakfast", Coffee], ["AC", Wind], ["Eco verified", Leaf]].map(([l, I]: any) => (
                    <label key={l} className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                      <input type="checkbox" className="accent-primary" /><I className="h-3.5 w-3.5" />{l}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard glow>
            <div className="flex items-center gap-2 mb-2"><Sparkles className="h-4 w-4 text-primary" /><span className="font-semibold text-sm">AI Tip</span></div>
            <p className="text-xs text-muted-foreground">Book mid-week to save up to 30% on most stays across India.</p>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div><span className="text-foreground font-semibold">{stays.length}</span> stays · sorted by rating</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : stays.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No stays found. Try different filters!</div>
          ) : (
            stays.map(s => (
             <Link key={s.id} to="/stays/$id" params={{ id: String(s.id) }} className="block group">
                <GlassCard className="!p-0 overflow-hidden md:flex hover:ring-1 hover:ring-primary/40 transition-all">
                  <div className="md:w-64 shrink-0 relative h-44 md:h-auto overflow-hidden">
                   {s.image_url ? (
                   <img src={s.image_url} alt={s.name} className="h-full w-full object-cover" />
                    ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 flex items-center justify-center">
                    <BedDouble className="h-16 w-16 text-primary/30" />
                  </div>
                 )}
                    <span className="absolute top-3 left-3"><Badge tone="primary">{s.badge}</Badge></span>
                  </div>
                  <div className="flex-1 p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-display text-lg font-bold">{s.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />{s.city}, {s.state}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-semibold">{Number(s.rating).toFixed(1)}</span>
                        <span className="text-muted-foreground text-xs">({s.reviews})</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.amenities?.map((a: string) => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground">{a}</span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-end justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 text-success"><ShieldCheck className="h-3.5 w-3.5" />Verified</div>
                        <span className="capitalize text-muted-foreground">{s.type}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-2xl font-bold">₹{Number(s.price).toLocaleString()}<span className="text-xs text-muted-foreground font-normal"> /night</span></div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}