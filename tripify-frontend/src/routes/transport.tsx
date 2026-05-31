import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Plane, Train, Bus, Car, ArrowRight, Clock, Sparkles, Leaf, Zap, IndianRupee, Wifi, BatteryCharging, Coffee, Search, ArrowLeftRight, Loader2 } from "lucide-react";
import { getToken } from "@/api";

export const Route = createFileRoute("/transport")({ component: Transport, head: () => ({ meta: [{ title: "Transport — Tripify India" }] }) });

const modes = [
  { id: "flight", label: "Flights", icon: Plane },
  { id: "train", label: "Trains", icon: Train },
  { id: "bus", label: "Buses", icon: Bus },
  { id: "cab", label: "Cabs", icon: Car },
];

function Transport() {
  const [mode, setMode] = useState("flight");
  const [from, setFrom] = useState("Delhi");
  const [to, setTo] = useState("Mumbai");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState(1);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/transport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ from, to, mode, date, pax })
      });
      const data = await res.json();
      setResults(data.options || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const swap = () => { const t = from; setFrom(to); setTo(t); };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Transport AI"
        title="Move smarter across India"
        desc="Multi-modal search: flights, trains, buses and cabs — optimized for time, cost and carbon."
      />

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {modes.map(m => { const I = m.icon; const a = mode === m.id; return (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`inline-flex items-center gap-2 px-4 h-11 rounded-xl text-sm font-semibold border shrink-0 transition-all ${a ? "bg-primary/15 text-primary border-primary/40 shadow-glow" : "border-border/60 text-muted-foreground hover:bg-secondary/40"}`}>
            <I className="h-4 w-4" />{m.label}
          </button>
        );})}
      </div>

      <GlassCard className="mb-6">
        <div className="grid md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-3">
            <label className="text-[10px] uppercase text-muted-foreground">From</label>
            <input value={from} onChange={e => setFrom(e.target.value)} className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm font-semibold" />
          </div>
          <div className="md:col-span-1 flex justify-center pt-4">
            <button onClick={swap} className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:bg-secondary/40">
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>
          <div className="md:col-span-3">
            <label className="text-[10px] uppercase text-muted-foreground">To</label>
            <input value={to} onChange={e => setTo(e.target.value)} className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm font-semibold" />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] uppercase text-muted-foreground">Departure</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm" />
          </div>
          <div className="md:col-span-1">
            <label className="text-[10px] uppercase text-muted-foreground">Pax</label>
            <input type="number" min={1} value={pax} onChange={e => setPax(+e.target.value)} className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm" />
          </div>
          <div className="md:col-span-2 pt-4">
            <Button className="w-full h-11" onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </Button>
          </div>
        </div>
      </GlassCard>

      {!searched && !loading && (
        <GlassCard className="text-center py-16">
          <Plane className="h-12 w-12 mx-auto mb-4 text-primary/30" />
          <p className="font-display text-xl font-bold">Search for transport</p>
          <p className="text-sm text-muted-foreground mt-2">Enter origin, destination and click Search!</p>
        </GlassCard>
      )}

      {loading && (
        <GlassCard className="text-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="font-display text-xl font-bold">AI searching options...</p>
          <p className="text-sm text-muted-foreground mt-2">Finding best {mode} options from {from} to {to}</p>
        </GlassCard>
      )}

      {searched && !loading && results.length > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-3 mb-6">
            {[
              { i: Zap, t: "Cheapest", v: `₹${Math.min(...results.map(r => r.price)).toLocaleString()}`, d: results.find(r => r.price === Math.min(...results.map(x => x.price)))?.name || '', tone: "warning" as const },
              { i: Sparkles, t: "AI Pick", v: results[0]?.name || '', d: results[0]?.duration || '', tone: "primary" as const },
              { i: Leaf, t: "Fastest", v: results.reduce((a, b) => a.duration < b.duration ? a : b)?.name || '', d: results.reduce((a, b) => a.duration < b.duration ? a : b)?.duration || '', tone: "success" as const },
            ].map(c => (
              <GlassCard key={c.t}>
                <div className="flex items-center gap-2 mb-1"><c.i className="h-4 w-4 text-primary" /><Badge tone={c.tone}>{c.t}</Badge></div>
                <div className="font-display text-xl font-bold mt-1">{c.v}</div>
                <div className="text-xs text-muted-foreground">{c.d}</div>
              </GlassCard>
            ))}
          </div>

          <div className="space-y-3">
            {results.map((r, i) => (
              <Link key={i} to="/checkout" search={{
               type: mode === 'flight' ? 'Flight' : mode === 'train' ? 'Train' : mode === 'bus' ? 'Bus' : 'Cab',
               stayName: r.name,
               stayCity: `${from} → ${to}`,
               roomName: r.code || mode,
               price: r.price,
               nights: 1,
               date: date || 'Date TBD',
               duration: r.duration || ''
              }} className="block">
                <GlassCard className="hover:ring-1 hover:ring-primary/40 transition-all">
                  <div className="grid md:grid-cols-12 items-center gap-4">
                    <div className="md:col-span-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary/60 flex items-center justify-center">
                        {mode === 'flight' ? <Plane className="h-5 w-5 text-primary" /> :
                         mode === 'train' ? <Train className="h-5 w-5 text-primary" /> :
                         mode === 'bus' ? <Bus className="h-5 w-5 text-primary" /> :
                         <Car className="h-5 w-5 text-primary" />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{r.name}</div>
                        <div className="text-[11px] text-muted-foreground">{r.code || mode}</div>
                      </div>
                    </div>
                    <div className="md:col-span-5 flex items-center gap-3">
                      <div className="text-center">
                        <div className="font-display text-xl font-bold">{r.departure}</div>
                        <div className="text-[11px] text-muted-foreground">{from}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{r.duration}</div>
                        <div className="h-px w-full bg-aurora my-1 relative"><ArrowRight className="h-3 w-3 text-primary absolute right-0 -top-1.5" /></div>
                        <div className="text-[10px] text-success">{r.stops || 'Direct'}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-display text-xl font-bold">{r.arrival}</div>
                        <div className="text-[11px] text-muted-foreground">{to}</div>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex flex-wrap gap-1.5">
                      <Badge tone={i === 0 ? "primary" : i === 1 ? "warning" : "info"}>{r.tag || 'Option'}</Badge>
                      {r.amenities?.map((a: string) => (
                        <span key={a} className="text-[10px] inline-flex items-center gap-1 text-muted-foreground">{a}</span>
                      ))}
                    </div>
                    <div className="md:col-span-2 text-right">
                      <div className="font-display text-2xl font-bold flex items-center justify-end">
                        <IndianRupee className="h-4 w-4" />{Number(r.price).toLocaleString()}
                      </div>
                      <Button className="mt-2 h-9 px-4 text-xs">Select <ArrowRight className="h-3 w-3" /></Button>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </>
      )}

      {searched && !loading && results.length === 0 && (
        <GlassCard className="text-center py-16">
          <p className="font-display text-xl font-bold">No results found</p>
          <p className="text-sm text-muted-foreground mt-2">Try different cities or transport mode</p>
        </GlassCard>
      )}
    </AppShell>
  );
}