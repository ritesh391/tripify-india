import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Star, ShieldCheck, Search, MapPin, Loader2, Filter } from "lucide-react";
import { getToken } from "@/api";

export const Route = createFileRoute("/marketplace")({ component: M, head: () => ({ meta: [{ title: "Local Marketplace — Tripify India" }] }) });

const categories = ["All", "Guide", "Photographer", "Driver", "Artisan", "Chef", "Yoga Teacher", "Adventure Guide"];

const avatarColors = [
  "bg-blue-500", "bg-green-500", "bg-orange-500", "bg-purple-500",
  "bg-pink-500", "bg-cyan-500", "bg-yellow-500", "bg-red-500",
];

function M() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("");
  const [booked, setBooked] = useState<Set<number>>(new Set());

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/marketplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ category, city })
      });
      const data = await res.json();
      setVendors(data.vendors || []);
    } catch {
      setVendors([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchVendors(); }, []);

  const handleBook = (index: number) => {
    setBooked(prev => new Set([...prev, index]));
  };

  const filtered = category === "All" ? vendors : vendors.filter(v => v.role?.includes(category));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Verified locals"
        title="Local Marketplace"
        desc="Guides, photographers, drivers, artisans — trust-scored by AI."
      />

      {/* Search */}
      <GlassCard className="mb-6">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Search by city..."
              className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg pl-10 pr-3 text-sm"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {categories.slice(0, 5).map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 h-11 rounded-lg text-xs font-medium transition-all ${category === c ? "bg-primary/20 text-primary border border-primary/40" : "bg-secondary/40 text-muted-foreground hover:text-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
          <Button onClick={fetchVendors} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
            Find locals
          </Button>
        </div>
      </GlassCard>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <GlassCard key={i}>
              <div className="animate-pulse space-y-3">
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary/60" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-secondary/60 rounded w-3/4" />
                    <div className="h-3 bg-secondary/40 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-secondary/40 rounded w-full" />
                <div className="h-8 bg-secondary/40 rounded w-full" />
              </div>
            </GlassCard>
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <GlassCard className="text-center py-16">
          <p className="font-display text-xl font-bold">No vendors found</p>
          <p className="text-sm text-muted-foreground mt-2">Try a different category or city</p>
          <Button className="mt-4" onClick={fetchVendors}>Reload</Button>
        </GlassCard>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v, i) => (
            <GlassCard key={i} className="hover:ring-1 hover:ring-primary/30 transition-all">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center font-bold text-white text-lg`}>
                  {v.name?.[0] || '?'}
                </div>
                <div>
                  <div className="font-display font-bold">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.role}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="h-3 w-3" />{v.city}
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{v.description}</p>

              <div className="flex flex-wrap gap-1 mt-3">
                {v.specialties?.slice(0, 3).map((s: string) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground">{s}</span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  <span className="font-semibold">{v.rating}</span>
                  <span className="text-muted-foreground text-xs">({v.reviews} reviews)</span>
                </div>
                <Badge tone="success">
                  <ShieldCheck className="h-3 w-3 mr-1" />Trust {v.trust}%
                </Badge>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="font-display font-bold">{v.price}</div>
                  <div className="text-[10px] text-muted-foreground">{v.priceUnit || 'per day'}</div>
                </div>
                <Link to="/checkout">
                  <Button
                    variant={booked.has(i) ? "outline" : "primary"}
                    onClick={() => handleBook(i)}
                    disabled={booked.has(i)}
                  >
                    {booked.has(i) ? "✅ Booked!" : "Book"}
                  </Button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </AppShell>
  );
}