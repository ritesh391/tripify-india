import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, TrendingUp } from "lucide-react";
import { Destination } from "@/lib/mock-data";
import { Badge } from "./index";

export function DestinationCard({ d, index = 0 }: { d: Destination; index?: number }) {
  const avg = Math.round(Object.values(d.scores).reduce((a, b) => a + b, 0) / 6);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
      <Link to="/destination/$id" params={{ id: d.id }} className="group block glass rounded-2xl overflow-hidden hover:ring-1 hover:ring-primary/40 hover:shadow-glow transition-all">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge tone="primary">AI Score {avg}</Badge>
            {d.priceTrend > 10 && <Badge tone="warning"><TrendingUp className="h-3 w-3" />+{d.priceTrend}%</Badge>}
          </div>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{d.region}</div>
            <div className="font-display text-xl font-bold">{d.name}</div>
            <div className="text-xs text-muted-foreground">{d.tagline}</div>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between text-xs">
          <div className="flex gap-3">
            <span className="text-info">☼ {d.scores.weather}</span>
            <span className="text-success">⚑ {d.scores.safety}</span>
            <span className="text-accent">♥ {d.scores.satisfaction}</span>
          </div>
          <span className="text-muted-foreground">Best: {d.bestMonths.slice(0, 3).join(", ")}</span>
        </div>
      </Link>
    </motion.div>
  );
}