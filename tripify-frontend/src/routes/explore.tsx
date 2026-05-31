import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Filter, Sparkles, MapPin } from "lucide-react";
import { getPlaces } from "@/api";

export const Route = createFileRoute("/explore")({ component: Explore, head: () => ({ meta: [{ title: "Explore India — Tripify India" }] }) });

const filters = ["all", "Beach", "Monument", "Fort", "Temple", "Nature", "Palace", "Religious", "Landmark"];

function Explore() {
  const navigate = useNavigate();
  const [f, setF] = useState("all");
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await getPlaces();
        setPlaces(data.places || []);
      } catch (err) {
        console.error('Failed to fetch places');
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const list = f === "all" ? places : places.filter(p => p.category === f);

  return (
    <AppShell>
      <PageHeader
        eyebrow={`${places.length} destinations · live scored`}
        title="Explore India"
        desc="AI-ranked destinations across every state, mood and season."
        action={<Button variant="outline"><Filter className="h-4 w-4" /> Smart filters</Button>}
      />
      <GlassCard className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">AI mood discovery</span>
          <Badge tone="primary">Beta</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(t => (
            <button
              key={t}
              onClick={() => setF(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${f === t ? "bg-aurora text-background shadow-glow" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}
            >
              {t.replace("-", " ")}
            </button>
          ))}
        </div>
      </GlassCard>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-muted-foreground animate-pulse">Loading destinations...</div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map((place) => (
        <div key={place.id} onClick={() => navigate({ to: "/planner", search: { destination: place.city } })} className="glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
          {place.image_url ? (
          <img
          src={place.image_url}
          alt={place.name}
          className="h-40 w-full object-cover"
          onError={(e) => {
           (e.target as HTMLImageElement).style.display = 'none';
         }}
       />
     ) : (
       <div className="h-40 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 flex items-center justify-center">
        <MapPin className="h-12 w-12 text-primary/40" />
      </div>
    )}
    <div className="p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-primary font-medium">{place.category}</span>
        <span className="text-xs text-yellow-400">★ {place.rating}</span>
         </div>
            <h3 className="font-display font-bold text-sm">{place.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{place.city}, {place.state}</p>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{place.description}</p>
          </div>
        </div>
      ))}
        </div>
      )}

      {!loading && list.length === 0 && (
        <div className="text-center text-muted-foreground mt-20">
          No destinations found for this filter.
        </div>
      )}
    </AppShell>
  );
}