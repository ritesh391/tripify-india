import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Bookmark, Calendar, MapPin, Users, Trash2, Loader2, Plane } from "lucide-react";
import { getMyTrips, deleteTrip, getPlaces } from "@/api";

export const Route = createFileRoute("/saved")({ component: S, head: () => ({ meta: [{ title: "Saved Trips — Tripify India" }] }) });

function S() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
   Promise.all([getMyTrips(), getPlaces()]).then(([tripData, placeData]) => {
  setTrips(tripData.trips || []);
  setPlaces(placeData.places || []);
  setLoading(false);
});
  }, []);

  const handleDelete = async (id: number) => {
    await deleteTrip(id);
    setTrips(trips.filter(t => t.id !== id));
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow={`${trips.length} saved trips`}
        title="Saved Trips"
        desc="All your AI-generated plans and bookmarks in one place."
        action={<Link to="/planner"><Button><Bookmark className="h-4 w-4" />New trip</Button></Link>}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Plane className="h-14 w-14 mx-auto mb-4 text-primary/30" />
          <p className="font-display text-xl font-bold">No saved trips yet!</p>
          <p className="text-sm mt-2">Go to Trip Planner, generate a plan and save it!</p>
          <Link to="/planner"><Button className="mt-6">Plan your first trip</Button></Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip, i) => (
            <GlassCard key={trip.id} className="!p-0 overflow-hidden">
              {/* Header Image */}
             <div className="aspect-video w-full overflow-hidden">
               {(() => {
                const place = places.find(p => 
                p.city?.toLowerCase() === trip.destination?.toLowerCase() ||
                p.name?.toLowerCase().includes(trip.destination?.toLowerCase())
              );
              return place?.image_url ? (
               <img src={place.image_url} alt={trip.destination} className="w-full h-full object-cover" />
              ) : (
             <div className="aspect-video w-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 flex items-center justify-center">
             <MapPin className="h-12 w-12 text-primary/30" />
             </div>
              );
              })()}
             </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-display font-bold truncate">{trip.title}</div>
                  <Badge tone={trip.status === 'confirmed' ? 'success' : trip.status === 'planning' ? 'primary' : 'warning'}>
                    {trip.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 text-primary" />{trip.destination}
                </div>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {trip.start_date ? new Date(trip.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBD'}
                    {trip.end_date && ` → ${new Date(trip.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
                  </div>
                  <div>💰 ₹{Number(trip.budget).toLocaleString()} budget</div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-aurora" style={{ width: `${30 + i * 12 > 100 ? 100 : 30 + i * 12}%` }} />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Planning {30 + i * 12 > 100 ? 100 : 30 + i * 12}% complete
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link to="/itinerary">
                    <button className="text-xs text-primary hover:underline">View itinerary →</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </AppShell>
  );
}