import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { GlassCard, Badge, Button } from "@/components/common";
import { Check, Download, Share2, Calendar, MapPin, Plane, Hotel, QrCode, Sparkles } from "lucide-react";

export const Route = createFileRoute("/confirmation")({ component: Confirm, head: () => ({ meta: [{ title: "Booking confirmed — Tripify India" }] }) });

function Confirm() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        {/* Success animation */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className="relative inline-flex h-24 w-24 rounded-full bg-aurora items-center justify-center shadow-glow">
            <Check className="h-12 w-12 text-background" strokeWidth={3} />
            <span className="absolute inset-0 rounded-full ring-2 ring-primary/40 animate-ping" />
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.3 }} className="font-display text-3xl md:text-4xl font-bold mt-6">Booking confirmed</motion.h1>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: 0.5 }} className="text-muted-foreground mt-2">Reference <span className="text-primary font-mono">TRP-89421-IN</span> · Confirmation sent to aarav@tripify.in</motion.p>
        </div>

        {/* Digital ticket */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.6 }}>
          <div className="relative rounded-2xl overflow-hidden glass-strong shadow-glow">
            <div className="absolute inset-0 bg-aurora opacity-20" />
            <div className="relative p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-md bg-aurora flex items-center justify-center"><Sparkles className="h-3.5 w-3.5 text-background" /></div><span className="font-display font-bold">Tripify India · Boarding Pass</span></div>
                <Badge tone="primary">Vistara</Badge>
              </div>
              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
                <div>
                  <div className="flex items-center gap-6">
                    <div><div className="text-[10px] uppercase text-muted-foreground">From</div><div className="font-display text-3xl font-bold">DEL</div><div className="text-xs">Delhi</div></div>
                    <div className="flex-1 relative"><div className="h-px bg-aurora"></div><Plane className="h-4 w-4 text-primary absolute -top-2 right-0" /></div>
                    <div><div className="text-[10px] uppercase text-muted-foreground">To</div><div className="font-display text-3xl font-bold">BOM</div><div className="text-xs">Mumbai</div></div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mt-6 text-xs">
                    {[["Passenger","A. Mehta"],["Flight","UK-995"],["Seat","18A"],["Date","Mar 10"],["Gate","14B"],["Boards","08:30"],["Class","Prem Eco"],["PNR","X4F9KQ"]].map(([l,v]) => <div key={l}><div className="text-[10px] uppercase text-muted-foreground">{l}</div><div className="font-semibold">{v}</div></div>)}
                  </div>
                </div>
                {/* QR */}
                <div className="bg-foreground p-3 rounded-xl">
                  <div className="h-32 w-32 grid grid-cols-12 gap-px">
                    {Array.from({ length: 144 }).map((_, i) => <div key={i} className={Math.random() > 0.5 ? "bg-background" : "bg-foreground"} />)}
                  </div>
                </div>
              </div>
              {/* Perforated edge */}
              <div className="my-6 relative"><div className="border-t border-dashed border-border/60"></div><div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-background"></div><div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-background"></div></div>
              <div className="flex items-center justify-between text-xs text-muted-foreground"><div className="flex items-center gap-1"><QrCode className="h-3.5 w-3.5" />Scan at gate</div><div>Issued by Tripify India</div></div>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <Button variant="outline" className="w-full"><Download className="h-4 w-4" />Download PDF</Button>
          <Button className="w-full"><Share2 className="h-4 w-4" />Add to wallet</Button>
        </div>

        {/* What's included */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            { i: Plane, l: "Flight", v: "UK-995 · Mar 10" },
            { i: Hotel, l: "Stay", v: "Lakeshore Heritage · 3 nights" },
            { i: Calendar, l: "Itinerary", v: "Auto-generated · 12 stops" },
          ].map((c,i) => (
            <GlassCard key={i}><c.i className="h-4 w-4 text-primary mb-2" /><div className="text-xs text-muted-foreground">{c.l}</div><div className="font-semibold text-sm">{c.v}</div></GlassCard>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          Manage trip in <Link to="/bookings" className="text-primary font-semibold">My Bookings</Link> · explore <Link to="/itinerary" className="text-primary font-semibold">your itinerary</Link>
        </div>
      </div>
    </AppShell>
  );
}