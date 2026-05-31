import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Sparkles, Wand2, Loader2, CheckCircle, MapPin } from "lucide-react";
import { generateItinerary, createTrip, getPlaces } from "@/api";

export const Route = createFileRoute("/planner")({ 
  component: Planner, 
  validateSearch: (search: Record<string, unknown>) => ({ destination: (search.destination as string) || "" }),
  head: () => ({ meta: [{ title: "Smart Trip Planner — Tripify India" }] }) 
});

const personas = [
  { id: "adventure", name: "🏔️ Adventure" },
  { id: "family", name: "👨‍👩‍👧 Family" },
  { id: "romance", name: "💑 Romance" },
  { id: "budget", name: "💰 Budget" },
  { id: "luxury", name: "✨ Luxury" },
  { id: "spiritual", name: "🕌 Spiritual" },
];

function Planner() {
  const navigate = useNavigate();
  const { destination: prefilledDestination } = Route.useSearch();
  const [budget, setBudget] = useState(40000);
  const [days, setDays] = useState(4);
  const [persona, setPersona] = useState("adventure");
 const [destination, setDestination] = useState(prefilledDestination || "Manali");
  const [travelers, setTravelers] = useState(2);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPlaces().then(data => setPlaces(data.places || []));
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setPlan(null);
    setSaved(false);
    try {
      const data = await generateItinerary({
        destination,
        days,
        budget,
        travelers,
        interests: persona
      });
      if (data.itinerary) {
        setPlan(data.itinerary);
      } else {
        setError("Failed to generate plan. Try again!");
      }
    } catch {
      setError("Could not connect to AI.");
    }
    setLoading(false);
  };

  const handleSaveTrip = async () => {
    setSaving(true);
    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + days);
      await createTrip({
        title: plan.title,
        destination,
        start_date: today.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        budget,
        travelers
      });
      setSaved(true);
    } catch {
      setError("Could not save trip. Are you logged in?");
    }
    setSaving(false);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Trip Planner"
        title="Smart Trip Planner"
        desc="Tell us the vibe — AI builds a plan optimized for time, cost and joy."
      />
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Inputs */}
        <GlassCard className="lg:col-span-1 h-fit">
          <div className="font-display font-bold mb-4">Trip parameters</div>
          <div className="space-y-5">
            <div>
              <label className="text-xs uppercase text-muted-foreground">Destination</label>
              <input
                className="mt-1 w-full h-11 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="e.g. Goa, Jaipur, Kerala"
                list="places-list"
              />
              <datalist id="places-list">
                {places.map(p => <option key={p.id} value={p.city} />)}
              </datalist>
            </div>

            <div>
              <label className="text-xs uppercase text-muted-foreground">Days · {days}</label>
              <input type="range" min={2} max={14} value={days} onChange={e => setDays(+e.target.value)} className="w-full mt-2 accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>2</span><span>14</span></div>
            </div>

            <div>
              <label className="text-xs uppercase text-muted-foreground">Budget · ₹{budget.toLocaleString()}</label>
              <input type="range" min={5000} max={200000} step={1000} value={budget} onChange={e => setBudget(+e.target.value)} className="w-full mt-2 accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹5k</span><span>₹2L</span></div>
            </div>

            <div>
              <label className="text-xs uppercase text-muted-foreground">Travelers · {travelers}</label>
              <input type="range" min={1} max={10} value={travelers} onChange={e => setTravelers(+e.target.value)} className="w-full mt-2 accent-primary" />
            </div>

            <div>
              <label className="text-xs uppercase text-muted-foreground">Persona</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {personas.map(p => (
                  <button key={p.id} onClick={() => setPersona(p.id)}
                    className={`p-2 rounded-lg text-xs border transition-all ${persona === p.id ? "bg-primary/15 text-primary border-primary/40 shadow-glow" : "border-border/60 text-muted-foreground hover:bg-secondary/40"}`}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={handleGenerate} disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Planning...</> : <><Wand2 className="h-4 w-4 mr-2" />Generate plan</>}
            </Button>
          </div>
        </GlassCard>

        {/* Right Panel - Results */}
        <div className="lg:col-span-2 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          {!plan && !loading && (
            <GlassCard className="flex flex-col items-center justify-center py-20 text-center">
              <Sparkles className="h-12 w-12 text-primary/30 mb-4" />
              <p className="font-display text-xl font-bold">Ready to plan?</p>
              <p className="text-sm text-muted-foreground mt-2">Set your parameters and click Generate!</p>
            </GlassCard>
          )}

          {loading && (
            <GlassCard className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="font-display text-xl font-bold">AI is planning...</p>
              <p className="text-sm text-muted-foreground mt-2">Building your perfect {days}-day {destination} trip</p>
            </GlassCard>
          )}

          {plan && (
            <>
              <GlassCard glow>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <Badge tone="primary">AI Generated</Badge>
                  </div>
                  {!saved ? (
                    <Button variant="outline" onClick={handleSaveTrip} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Trip"}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4" /> Saved!
                    </div>
                  )}
                </div>
                <div className="font-display text-2xl font-bold">{plan.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{plan.overview}</div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">Days</div><div className="font-display text-xl font-bold">{plan.days?.length}</div></div>
                  <div className="rounded-xl bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">Travelers</div><div className="font-display text-xl font-bold">{travelers}</div></div>
                  <div className="rounded-xl bg-secondary/40 p-3"><div className="text-xs text-muted-foreground">Est. cost</div><div className="font-display text-xl font-bold">₹{plan.totalBudget?.toLocaleString()}</div></div>
                </div>
              </GlassCard>

              {plan.days?.map((day: any) => (
                <GlassCard key={day.day}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-aurora flex items-center justify-center font-display font-bold text-background text-sm">{day.day}</div>
                    <div>
                      <div className="text-xs text-muted-foreground">Day {day.day}</div>
                      <div className="font-display font-bold">{day.title}</div>
                    </div>
                   <div className="ml-auto"><Badge tone="primary">₹{day.estimatedCost?.toLocaleString()}</Badge></div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div><span className="text-primary font-medium">Morning: </span>{day.morning}</div>
                    <div><span className="text-primary font-medium">Afternoon: </span>{day.afternoon}</div>
                    <div><span className="text-primary font-medium">Evening: </span>{day.evening}</div>
                  </div>
                  {day.places?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {day.places.map((p: string) => (
                        <span key={p} className="flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded-full">
                          <MapPin className="h-3 w-3 text-primary" />{p}
                        </span>
                      ))}
                    </div>
                  )}
                  {day.tips && <div className="mt-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg p-2">💡 {day.tips}</div>}
                </GlassCard>
              ))}

              <GlassCard>
                <div className="font-display font-bold mb-2">Packing List</div>
                <div className="flex flex-wrap gap-2">
                  {plan.packingList?.map((item: string) => (
                    <span key={item} className="text-xs bg-secondary/50 px-2 py-1 rounded-full capitalize">{item}</span>
                  ))}
                </div>
              </GlassCard>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}