import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge } from "@/components/common";
import { MapPin, Layers, Activity, Cloud, Users, Search } from "lucide-react";
import { getPlaces } from "@/api";

export const Route = createFileRoute("/maps")({ component: Maps, head: () => ({ meta: [{ title: "Smart Maps & Heatmaps — Tripify India" }] }) });

const cityCoords: Record<string, { x: number; y: number }> = {
  'Goa': { x: 22, y: 62 }, 'Old Goa': { x: 22, y: 63 },
  'Mumbai': { x: 20, y: 55 }, 'Delhi': { x: 35, y: 28 },
  'Jaipur': { x: 30, y: 35 }, 'Agra': { x: 37, y: 33 },
  'Varanasi': { x: 48, y: 38 }, 'Kolkata': { x: 65, y: 45 },
  'Chennai': { x: 45, y: 72 }, 'Hyderabad': { x: 40, y: 62 },
  'Bengaluru': { x: 38, y: 70 }, 'Kochi': { x: 33, y: 78 },
  'Alleppey': { x: 32, y: 80 }, 'Mysore': { x: 36, y: 72 },
  'Coorg': { x: 34, y: 72 }, 'Munnar': { x: 32, y: 76 },
  'Srinagar': { x: 30, y: 12 }, 'Gulmarg': { x: 28, y: 11 },
  'Pahalgam': { x: 30, y: 13 }, 'Sonamarg': { x: 31, y: 11 },
  'Manali': { x: 32, y: 18 }, 'Shimla': { x: 33, y: 22 },
  'Dharamshala': { x: 30, y: 20 }, 'Spiti': { x: 34, y: 17 },
  'Amritsar': { x: 28, y: 24 }, 'Jodhpur': { x: 24, y: 38 },
  'Udaipur': { x: 25, y: 42 }, 'Jaisalmer': { x: 18, y: 38 },
  'Pushkar': { x: 27, y: 38 }, 'Sawai Madhopur': { x: 34, y: 38 },
  'Rishikesh': { x: 36, y: 24 }, 'Haridwar': { x: 36, y: 25 },
  'Nainital': { x: 40, y: 24 }, 'Kedarnath': { x: 37, y: 21 },
  'Badrinath': { x: 38, y: 20 }, 'Chamoli': { x: 38, y: 22 },
  'Ramnagar': { x: 40, y: 26 }, 'Kaziranga': { x: 78, y: 30 },
  'Majuli': { x: 76, y: 28 }, 'Shillong': { x: 76, y: 35 },
  'Cherrapunji': { x: 75, y: 36 }, 'Tawang': { x: 82, y: 25 },
  'Tirupati': { x: 43, y: 68 }, 'Madurai': { x: 40, y: 78 },
  'Rameswaram': { x: 42, y: 82 }, 'Thanjavur': { x: 42, y: 76 },
  'Hampi': { x: 35, y: 63 }, 'Badami': { x: 32, y: 60 },
  'Gokarna': { x: 26, y: 62 }, 'Jog Falls': { x: 26, y: 64 },
  'Aurangabad': { x: 28, y: 52 }, 'Lonavala': { x: 22, y: 53 },
  'Mahabaleshwar': { x: 22, y: 56 }, 'Kutch': { x: 14, y: 42 },
  'Somnath': { x: 16, y: 50 }, 'Gir National Park': { x: 18, y: 48 },
  'Dwarka': { x: 12, y: 46 }, 'Junagadh': { x: 16, y: 48 },
  'Khajuraho': { x: 44, y: 40 }, 'Umaria': { x: 46, y: 45 },
  'Sanchi': { x: 38, y: 45 }, 'Pachmarhi': { x: 40, y: 47 },
  'Puri': { x: 60, y: 52 }, 'Konark': { x: 61, y: 53 },
  'Chilika': { x: 59, y: 54 }, 'Havelock Island': { x: 88, y: 60 },
  'Port Blair': { x: 87, y: 62 }, 'Neil Island': { x: 88, y: 63 },
  'Varkala': { x: 31, y: 79 }, 'Kovalam': { x: 31, y: 80 },
  'Ooty': { x: 36, y: 75 }, 'Kodaikanal': { x: 38, y: 77 },
  'Wayanad': { x: 33, y: 73 }, 'Thekkady': { x: 33, y: 76 },
  'Fort Kochi': { x: 32, y: 78 }, 'Visakhapatnam': { x: 54, y: 56 },
  'Araku Valley': { x: 54, y: 54 }, 'Charminar': { x: 40, y: 62 },
  'Golconda Fort': { x: 40, y: 62 },
};

const categoryColors: Record<string, string> = {
  'Beach': '#38bdf8', 'Nature': '#34d399', 'Heritage': '#facc15',
  'Temple': '#fb923c', 'Fort': '#f87171', 'Palace': '#c084fc',
  'Monument': '#f472b6', 'Spiritual': '#818cf8', 'Adventure': '#22d3ee',
  'Landmark': '#fbbf24', 'Religious': '#a78bfa',
};

function Maps() {
  const [places, setPlaces] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    getPlaces().then(data => setPlaces(data.places || []));
  }, []);

  const categories = ["all", ...Array.from(new Set(places.map(p => p.category)))];
  const filtered = places.filter(p => {
    const matchCat = filter === "all" || p.category === filter;
    const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  const placesWithCoords = filtered.filter(p => cityCoords[p.city]);

  return (
    <AppShell>
      <PageHeader eyebrow="Geo intelligence" title="Smart Maps & Heatmaps" desc="Live tourism density across India." />

      <div className="grid lg:grid-cols-4 gap-4">
        <GlassCard className="lg:col-span-3 !p-0 overflow-hidden">
          <div className="p-3 border-b border-border/40 flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-48">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations..." className="w-full h-9 bg-secondary/40 border border-border/60 rounded-lg pl-9 pr-3 text-xs" />
            </div>
            <div className="flex gap-1 flex-wrap">
              {categories.slice(0, 7).map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`px-2 h-9 rounded-lg text-xs font-medium capitalize transition-all ${filter === c ? "bg-primary/20 text-primary border border-primary/40" : "bg-secondary/40 text-muted-foreground hover:text-foreground"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Map with detailed India SVG */}
          <div className="relative w-full overflow-hidden bg-slate-950" style={{ aspectRatio: '4/3' }}>

            {/* Real India SVG outline */}
            <svg viewBox="0 0 500 550" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
              {/* Ocean background */}
              <rect width="500" height="550" fill="#0a0f1e" />
              {/* Grid lines */}
              {[100,200,300,400].map(x => <line key={x} x1={x} y1="0" x2={x} y2="550" stroke="#1e293b" strokeWidth="0.5" />)}
              {[100,200,300,400,500].map(y => <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#1e293b" strokeWidth="0.5" />)}

              {/* Main India body */}
              <path
                d="M 155 25 L 165 22 L 178 24 L 192 22 L 205 26 L 220 23 L 232 28 L 244 25 L 256 30 L 268 28 L 278 35 L 285 45 L 290 58 L 294 70 L 292 82 L 286 92 L 280 100 L 278 112 L 272 122 L 266 132 L 260 142 L 255 152 L 250 162 L 244 170 L 238 178 L 232 186 L 226 193 L 220 200 L 214 207 L 208 215 L 202 222 L 196 230 L 190 238 L 184 246 L 178 254 L 172 261 L 166 268 L 160 274 L 154 279 L 148 283 L 142 286 L 138 290 L 136 295 L 138 300 L 142 304 L 146 308 L 144 312 L 140 315 L 135 313 L 131 308 L 128 302 L 125 295 L 122 288 L 119 280 L 116 272 L 113 264 L 110 255 L 107 247 L 104 238 L 101 230 L 98 221 L 95 213 L 92 204 L 90 196 L 88 188 L 86 180 L 84 172 L 82 163 L 80 155 L 78 147 L 76 138 L 74 130 L 72 122 L 70 114 L 68 105 L 67 97 L 65 89 L 64 81 L 64 73 L 65 66 L 67 59 L 70 53 L 74 47 L 79 42 L 84 37 L 90 32 L 96 28 L 102 25 L 108 23 L 115 22 L 122 22 L 129 23 L 136 24 L 143 24 L 150 24 Z"
                fill="rgba(99,102,241,0.08)"
                stroke="rgba(99,102,241,0.6)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Kashmir region */}
              <path
                d="M 140 22 L 148 17 L 158 14 L 168 13 L 178 15 L 186 20 L 190 27 L 187 34 L 180 38 L 172 40 L 164 38 L 156 33 L 148 28 Z"
                fill="rgba(99,102,241,0.08)"
                stroke="rgba(99,102,241,0.5)"
                strokeWidth="1"
              />

              {/* Northeast India */}
              <path
                d="M 278 35 L 290 30 L 302 28 L 314 30 L 324 36 L 330 44 L 326 52 L 318 58 L 308 62 L 298 64 L 288 61 L 280 55 L 276 46 Z"
                fill="rgba(99,102,241,0.08)"
                stroke="rgba(99,102,241,0.5)"
                strokeWidth="1"
              />

              {/* Andaman Islands */}
              <ellipse cx="420" cy="310" rx="8" ry="20" fill="rgba(99,102,241,0.08)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />

              {/* Sri Lanka hint */}
              <ellipse cx="148" cy="325" rx="6" ry="10" fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.3)" strokeWidth="0.8" />

              {/* State boundary hints */}
              <path d="M 160 80 L 230 75 M 155 120 L 235 115 M 150 160 L 240 155" stroke="rgba(99,102,241,0.2)" strokeWidth="0.5" strokeDasharray="3 3" />

              {/* Compass */}
              <text x="460" y="30" fill="rgba(99,102,241,0.4)" fontSize="10" fontFamily="sans-serif">N</text>
              <line x1="464" y1="33" x2="464" y2="45" stroke="rgba(99,102,241,0.4)" strokeWidth="1" markerEnd="url(#arrow)" />

              {/* Scale bar */}
              <line x1="30" y1="530" x2="130" y2="530" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
              <text x="50" y="525" fill="rgba(99,102,241,0.4)" fontSize="8" fontFamily="sans-serif">500 km</text>
            </svg>

            {/* Destination dots */}
            {placesWithCoords.map((place) => {
              const coords = cityCoords[place.city];
              const color = categoryColors[place.category] || '#6366f1';
              const isSelected = selected?.id === place.id;
              return (
                <div
                  key={place.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  onClick={() => setSelected(selected?.id === place.id ? null : place)}
                >
                  <div className="absolute h-6 w-6 -translate-x-1/4 -translate-y-1/4 rounded-full animate-ping opacity-20" style={{ background: color }} />
                  <div className={`h-3 w-3 rounded-full ring-2 ring-black/50 shadow-lg transition-transform ${isSelected ? 'scale-200' : 'hover:scale-150'}`} style={{ background: color }} />
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 glass-strong rounded-lg px-2 py-1.5 text-xs whitespace-nowrap z-20 pointer-events-none transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="font-semibold text-white">{place.name}</div>
                    <div className="text-gray-400 text-[10px]">{place.city} · ★ {place.rating}</div>
                    <div className="text-[10px]" style={{ color }}>{place.category}</div>
                  </div>
                </div>
              );
            })}

            {/* Top label */}
            <div className="absolute top-3 left-3 glass-strong rounded-lg px-3 py-1.5 text-xs flex items-center gap-2 z-10">
              <Layers className="h-3 w-3 text-primary" />
              <span>India · {placesWithCoords.length} destinations · Live</span>
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 glass-strong rounded-lg p-2.5 text-xs space-y-1 z-10">
              {Object.entries(categoryColors).slice(0, 6).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-gray-400">{cat}</span>
                </div>
              ))}
            </div>

            {/* Selected card */}
            {selected && (
              <div className="absolute bottom-3 right-3 glass-strong rounded-xl p-3 text-sm max-w-52 z-20">
                <div className="font-bold text-white">{selected.name}</div>
                <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />{selected.city}, {selected.state}
                </div>
                <div className="text-xs mt-1.5 text-gray-400 line-clamp-2">{selected.description}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: categoryColors[selected.category] || '#6366f1' }}>{selected.category}</span>
                  <span className="text-xs text-yellow-400">★ {selected.rating}</span>
                </div>
                <button onClick={() => setSelected(null)} className="text-[10px] text-gray-500 mt-1.5 hover:text-white">Close ×</button>
              </div>
            )}
          </div>

          {/* Legend bottom */}
          <div className="p-3 border-t border-border/40 flex flex-wrap gap-3">
            {Object.entries(categoryColors).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: color }} />
                {cat}
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          {[
            { i: Activity, l: "Destinations", v: String(placesWithCoords.length) },
            { i: Cloud, l: "Categories", v: String(categories.length - 1) },
            { i: Users, l: "Live tourists", v: "248K" },
            { i: MapPin, l: "States covered", v: String(new Set(places.map(p => p.state)).size) }
          ].map((s, i) => (
            <GlassCard key={i}>
              <div className="flex items-center gap-2 mb-1">
                <s.i className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase text-muted-foreground">{s.l}</span>
              </div>
              <div className="font-display text-xl font-bold">{s.v}</div>
            </GlassCard>
          ))}
          {selected && (
            <GlassCard glow>
              <div className="font-display font-bold">{selected.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />{selected.city}, {selected.state}
              </div>
              <div className="text-xs mt-2 text-muted-foreground line-clamp-3">{selected.description}</div>
              <div className="flex items-center justify-between mt-2">
                <Badge tone="primary">{selected.category}</Badge>
                <span className="text-xs text-yellow-400">★ {selected.rating}</span>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {filtered.slice(0, 8).map(place => (
          <GlassCard key={place.id}
            className={`cursor-pointer transition-all hover:ring-1 hover:ring-primary/40 ${selected?.id === place.id ? 'ring-1 ring-primary' : ''}`}
            onClick={() => setSelected(selected?.id === place.id ? null : place)}
          >
            <Badge tone="primary">{place.category}</Badge>
            <div className="font-display font-bold mt-2">{place.name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />{place.city}, {place.state}
            </div>
            <div className="text-xs text-yellow-400 mt-1">★ {place.rating}</div>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  );
}