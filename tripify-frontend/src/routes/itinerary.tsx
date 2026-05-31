import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Plane, Hotel, MapPin, Utensils, Sunrise, Landmark, Castle, Flag, Train, Sun, Sparkles, Cloud, AlertTriangle, Loader2 } from "lucide-react";
import { generateItinerary } from "@/api";

export const Route = createFileRoute("/itinerary")({ component: Itinerary, head: () => ({ meta: [{ title: "Itinerary Generator — Tripify India" }] }) });

function Itinerary() {
  const [destination, setDestination] = useState("Jaipur");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(20000);
  const [travelers, setTravelers] = useState(2);
  const [interests, setInterests] = useState("heritage, food, culture");
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await generateItinerary({ destination, days, budget, travelers, interests });
      if (data.itinerary) {
        setItinerary(data.itinerary);
      } else {
        setError("Failed to generate itinerary. Please try again.");
      }
    } catch (err) {
      setError("Could not connect to AI service.");
    }
    setLoading(false);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="AI Itinerary"
        title="Smart Itinerary Generator"
        desc="Day-by-day plan powered by real AI with food curation and budget planning."
        action={
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate"}
          </Button>
        }
      />

      {/* Input Form */}
      <GlassCard className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold">Plan your trip</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Destination</label>
            <input
              className="mt-1 w-full h-10 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Goa, Jaipur, Kerala"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Days</label>
            <input
              type="number"
              className="mt-1 w-full h-10 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              min={1} max={14}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Budget (₹ per person)</label>
            <input
              type="number"
              className="mt-1 w-full h-10 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Travelers</label>
            <input
              type="number"
              className="mt-1 w-full h-10 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm"
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Interests</label>
            <input
              className="mt-1 w-full h-10 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. beaches, food, adventure"
            />
          </div>
        </div>
        <Button className="mt-4 w-full" onClick={handleGenerate} disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />AI is planning your trip...</> : <><Sparkles className="h-4 w-4 mr-2" />Generate Itinerary</>}
        </Button>
      </GlassCard>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      {/* Generated Itinerary */}
      {itinerary && (
        <>
          <div className="grid lg:grid-cols-4 gap-4 mb-6">
            {[
              { l: "Days", v: itinerary.days?.length || days },
              { l: "Destination", v: itinerary.destination },
              { l: "Best Time", v: itinerary.bestTimeToVisit?.split(" ").slice(0,2).join(" ") || "Year round" },
              { l: "Est. Budget", v: `₹${itinerary.totalBudget?.toLocaleString()}` }
            ].map(s => (
              <GlassCard key={s.l}>
                <div className="text-xs uppercase text-muted-foreground">{s.l}</div>
                <div className="font-display text-lg font-bold mt-1 truncate">{s.v}</div>
              </GlassCard>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {itinerary.days?.map((day: any) => (
                <GlassCard key={day.day}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-aurora flex items-center justify-center font-display font-bold text-background">{day.day}</div>
                      <div>
                        <div className="text-xs text-muted-foreground">Day {day.day}</div>
                        <div className="font-display font-bold text-lg">{day.title}</div>
                      </div>
                    </div>
                    <Badge tone="primary">₹{day.estimatedCost?.toLocaleString()}</Badge>
                  </div>
                  <div className="relative pl-6 border-l border-border/40 space-y-4">
                    {[
                      { t: "Morning", a: day.morning, icon: Sunrise },
                      { t: "Afternoon", a: day.afternoon, icon: Sun },
                      { t: "Evening", a: day.evening, icon: Landmark },
                    ].map((item, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[31px] top-0 h-6 w-6 rounded-full bg-secondary border border-border/60 flex items-center justify-center">
                          <item.icon className="h-3 w-3 text-primary" />
                        </div>
                        <div className="text-xs text-primary font-semibold">{item.t}</div>
                        <div className="text-sm">{item.a}</div>
                      </div>
                    ))}
                  </div>
                  {day.places?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {day.places.map((p: string) => (
                        <span key={p} className="flex items-center gap-1 text-xs bg-secondary/50 px-2 py-1 rounded-full">
                          <MapPin className="h-3 w-3 text-primary" />{p}
                        </span>
                      ))}
                    </div>
                  )}
                  {day.tips && (
                    <div className="mt-3 text-xs text-muted-foreground bg-secondary/30 rounded-lg p-2">
                      💡 {day.tips}
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>

            <div className="space-y-4">
              <GlassCard glow>
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="h-4 w-4 text-info" />
                  <span className="font-semibold">Trip Overview</span>
                </div>
                <div className="text-sm text-muted-foreground">{itinerary.overview}</div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="font-semibold">Local Tips</span>
                </div>
                <div className="text-sm text-muted-foreground">{itinerary.localTips}</div>
              </GlassCard>

              {itinerary.packingList?.length > 0 && (
                <GlassCard>
                  <div className="font-display font-bold mb-3">Packing List</div>
                  <div className="flex flex-wrap gap-2">
                    {itinerary.packingList.map((item: string) => (
                      <span key={item} className="text-xs bg-secondary/50 px-2 py-1 rounded-full capitalize">{item}</span>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </>
      )}

      {!itinerary && !loading && (
        <div className="text-center text-muted-foreground mt-20">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary/30" />
          <p className="text-lg font-semibold">Ready to plan your trip?</p>
          <p className="text-sm mt-1">Fill in the details above and click Generate!</p>
        </div>
      )}
    </AppShell>
  );
}