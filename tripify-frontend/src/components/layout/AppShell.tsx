import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Sparkles, Compass, LayoutDashboard, Clock, Wand2, Map, Activity, Bot,
  Bookmark, Brain, Users, Store, Shield, BarChart3, Crown, Lightbulb,
  Menu, X, Bell, Search, BedDouble, Plane, Ticket,
} from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/timing", label: "Timing AI", icon: Clock },
  { to: "/planner", label: "Trip Planner", icon: Wand2 },
  { to: "/itinerary", label: "Itinerary AI", icon: Sparkles },
  { to: "/stays", label: "Stays", icon: BedDouble },
  { to: "/transport", label: "Transport", icon: Plane },
  { to: "/bookings", label: "My Bookings", icon: Ticket },
  { to: "/maps", label: "Smart Maps", icon: Map },
  { to: "/live", label: "Live Intel", icon: Activity },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/saved", label: "Saved Trips", icon: Bookmark },
  { to: "/memory", label: "Memory", icon: Brain },
  { to: "/community", label: "Community", icon: Users },
  { to: "/marketplace", label: "Marketplace", icon: Store },
  { to: "/admin", label: "Admin", icon: Shield },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/insights", label: "Insights", icon: Lightbulb },
  { to: "/pricing", label: "Pricing", icon: Crown },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground bg-glow">
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 glass-strong border-r border-border/40 transition-transform ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex h-16 items-center justify-between px-5 border-b border-border/40">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-aurora shadow-glow flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-background" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Tripify <span className="text-gradient">India</span></span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="p-3 space-y-0.5 overflow-y-auto h-[calc(100vh-4rem)] pb-20">
          {nav.map((n) => {
            const active = path === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active ? "bg-primary/15 text-primary ring-1 ring-primary/30 shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
              >
                <Icon className="h-4 w-4" />
                <span>{n.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 glass border-b border-border/40 flex items-center px-4 lg:px-8 gap-4">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <div className="flex-1 max-w-xl relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Ask AI: 'Peaceful Himachal under ₹25k'"
              className="w-full h-10 bg-secondary/40 border border-border/50 rounded-lg pl-10 pr-4 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <button className="relative h-10 w-10 rounded-lg border border-border/50 flex items-center justify-center hover:bg-secondary/50">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent animate-pulse" />
          </button>
          <ThemeToggle />
          <Link to="/login" className="h-10 w-10 rounded-full bg-aurora ring-1 ring-border/50 flex items-center justify-center text-sm font-semibold text-background">A</Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}