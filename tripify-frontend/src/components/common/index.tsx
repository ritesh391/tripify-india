import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";

export function PageHeader({ eyebrow, title, desc, action }: { eyebrow?: string; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        {eyebrow && <div className="text-xs font-semibold tracking-widest uppercase text-primary mb-2 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />{eyebrow}</div>}
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
        {desc && <p className="text-muted-foreground mt-2 max-w-2xl">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function GlassCard({ children, className = "", glow = false }: { children: ReactNode; className?: string; glow?: boolean }) {
  return <div className={`glass rounded-2xl p-5 ${glow ? "shadow-glow" : ""} ${className}`}>{children}</div>;
}

export function Stat({ label, value, delta, icon: Icon }: { label: string; value: string | number; delta?: number; icon?: any }) {
  const up = (delta ?? 0) >= 0;
  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-primary" />}
      </div>
      <div className="font-display text-3xl font-bold">{value}</div>
      {delta !== undefined && (
        <div className={`text-xs flex items-center gap-1 ${up ? "text-success" : "text-destructive"}`}>
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(delta)}% vs last week
        </div>
      )}
    </GlassCard>
  );
}

export function ScoreRing({ label, value, color = "primary" }: { label: string; value: number; color?: string }) {
  const r = 28; const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-20 w-20">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} stroke="currentColor" strokeWidth="6" fill="none" className="text-secondary" />
          <circle cx="36" cy="36" r={r} stroke={`var(--${color})`} strokeWidth="6" fill="none" strokeDasharray={c} strokeDashoffset={c - (value / 100) * c} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg">{value}</div>
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warning" | "info" | "danger" | "primary" }) {
  const tones: Record<string, string> = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-success/15 text-success ring-1 ring-success/30",
    warning: "bg-warning/15 text-warning ring-1 ring-warning/30",
    info: "bg-info/15 text-info ring-1 ring-info/30",
    danger: "bg-destructive/15 text-destructive ring-1 ring-destructive/30",
    primary: "bg-primary/15 text-primary ring-1 ring-primary/30",
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${tones[tone]}`}>{children}</span>;
}

export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay }}>{children}</motion.div>;
}

export function Button({ children, variant = "primary", className = "", ...rest }: any) {
  const v: Record<string, string> = {
    primary: "bg-aurora text-background hover:opacity-90 shadow-glow",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
    ghost: "hover:bg-secondary/60",
    outline: "border border-border/70 hover:bg-secondary/40",
  };
  return <button className={`inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold transition-all ${v[variant]} ${className}`} {...rest}>{children}</button>;
}

export function LinkArrow({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold">{children}<ArrowUpRight className="h-4 w-4" /></span>;
}