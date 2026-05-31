export type Destination = {
  id: string;
  name: string;
  region: string;
  tagline: string;
  image: string;
  scores: {
    weather: number;
    crowd: number;
    budget: number;
    safety: number;
    satisfaction: number;
    eco: number;
  };
  bestMonths: string[];
  priceTrend: number;
  category: string[];
  hero: string;
  coords: { x: number; y: number };
};

const img = (q: string, seed: number) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=1200&q=80&ixid=${q}`;

export const destinations: Destination[] = [
  { id: "kashmir", name: "Kashmir", region: "Jammu & Kashmir", tagline: "Paradise on Earth", image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1800&q=80", scores: { weather: 91, crowd: 72, budget: 68, safety: 78, satisfaction: 94, eco: 82 }, bestMonths: ["Apr","May","Jun","Sep","Oct"], priceTrend: 12, category: ["nature","adventure","honeymoon"], coords: { x: 32, y: 12 } },
  { id: "ladakh", name: "Ladakh", region: "Ladakh", tagline: "Land of High Passes", image: "https://images.unsplash.com/photo-1589182337358-2cb63099350c?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1589182337358-2cb63099350c?auto=format&fit=crop&w=1800&q=80", scores: { weather: 88, crowd: 65, budget: 60, safety: 82, satisfaction: 96, eco: 90 }, bestMonths: ["Jun","Jul","Aug","Sep"], priceTrend: 18, category: ["adventure","photography"], coords: { x: 40, y: 14 } },
  { id: "goa", name: "Goa", region: "Goa", tagline: "Sun, Sand, Soul", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1800&q=80", scores: { weather: 78, crowd: 42, budget: 70, safety: 80, satisfaction: 88, eco: 64 }, bestMonths: ["Nov","Dec","Jan","Feb"], priceTrend: 22, category: ["beach","nightlife","family"], coords: { x: 26, y: 60 } },
  { id: "kerala", name: "Kerala", region: "Kerala", tagline: "God's Own Country", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=80", scores: { weather: 84, crowd: 70, budget: 76, safety: 91, satisfaction: 92, eco: 88 }, bestMonths: ["Sep","Oct","Nov","Feb","Mar"], priceTrend: 8, category: ["nature","wellness","honeymoon"], coords: { x: 32, y: 78 } },
  { id: "rajasthan", name: "Rajasthan", region: "Rajasthan", tagline: "Land of Kings", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1800&q=80", scores: { weather: 72, crowd: 60, budget: 74, safety: 85, satisfaction: 90, eco: 70 }, bestMonths: ["Oct","Nov","Dec","Jan","Feb"], priceTrend: 6, category: ["heritage","culture"], coords: { x: 30, y: 32 } },
  { id: "himachal", name: "Himachal Pradesh", region: "Himachal", tagline: "Devbhoomi", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1800&q=80", scores: { weather: 90, crowd: 55, budget: 78, safety: 86, satisfaction: 93, eco: 84 }, bestMonths: ["Mar","Apr","May","Sep","Oct"], priceTrend: 14, category: ["mountain","adventure"], coords: { x: 38, y: 22 } },
  { id: "uttarakhand", name: "Uttarakhand", region: "Uttarakhand", tagline: "Simply Heaven", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1800&q=80", scores: { weather: 87, crowd: 58, budget: 75, safety: 84, satisfaction: 91, eco: 86 }, bestMonths: ["Mar","Apr","May","Sep","Oct","Nov"], priceTrend: 10, category: ["spiritual","mountain"], coords: { x: 42, y: 24 } },
  { id: "meghalaya", name: "Meghalaya", region: "North-East", tagline: "Abode of Clouds", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1800&q=80", scores: { weather: 82, crowd: 88, budget: 80, safety: 88, satisfaction: 95, eco: 96 }, bestMonths: ["Oct","Nov","Dec","Mar","Apr"], priceTrend: -4, category: ["nature","hidden-gem"], coords: { x: 78, y: 38 } },
  { id: "andaman", name: "Andaman", region: "Andaman & Nicobar", tagline: "Emerald Isles", image: "https://images.unsplash.com/photo-1583843353448-0d3edbe55fbc?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1583843353448-0d3edbe55fbc?auto=format&fit=crop&w=1800&q=80", scores: { weather: 83, crowd: 75, budget: 55, safety: 90, satisfaction: 94, eco: 92 }, bestMonths: ["Nov","Dec","Jan","Feb","Mar"], priceTrend: 16, category: ["beach","honeymoon"], coords: { x: 75, y: 78 } },
  { id: "varanasi", name: "Varanasi", region: "Uttar Pradesh", tagline: "Spiritual Capital", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1800&q=80", scores: { weather: 70, crowd: 40, budget: 88, safety: 76, satisfaction: 90, eco: 60 }, bestMonths: ["Nov","Dec","Jan","Feb"], priceTrend: 4, category: ["spiritual","heritage"], coords: { x: 56, y: 38 } },
  { id: "rishikesh", name: "Rishikesh", region: "Uttarakhand", tagline: "Yoga Capital", image: "https://images.unsplash.com/photo-1591018653757-95dabb6e3905?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1591018653757-95dabb6e3905?auto=format&fit=crop&w=1800&q=80", scores: { weather: 86, crowd: 62, budget: 82, safety: 84, satisfaction: 92, eco: 80 }, bestMonths: ["Feb","Mar","Apr","Sep","Oct"], priceTrend: 8, category: ["spiritual","wellness","adventure"], coords: { x: 42, y: 26 } },
  { id: "darjeeling", name: "Darjeeling", region: "West Bengal", tagline: "Queen of Hills", image: "https://images.unsplash.com/photo-1626621331169-2b03d7c4be3c?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1626621331169-2b03d7c4be3c?auto=format&fit=crop&w=1800&q=80", scores: { weather: 84, crowd: 68, budget: 78, safety: 85, satisfaction: 89, eco: 82 }, bestMonths: ["Apr","May","Oct","Nov"], priceTrend: 6, category: ["mountain","heritage"], coords: { x: 72, y: 34 } },
  { id: "ooty", name: "Ooty", region: "Tamil Nadu", tagline: "Nilgiri Queen", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1800&q=80", scores: { weather: 88, crowd: 60, budget: 76, safety: 88, satisfaction: 90, eco: 80 }, bestMonths: ["Mar","Apr","May","Sep","Oct"], priceTrend: 5, category: ["mountain","family"], coords: { x: 38, y: 76 } },
  { id: "munnar", name: "Munnar", region: "Kerala", tagline: "Tea Country", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=80", scores: { weather: 90, crowd: 66, budget: 74, safety: 90, satisfaction: 93, eco: 88 }, bestMonths: ["Sep","Oct","Nov","Dec","Jan"], priceTrend: 9, category: ["nature","honeymoon"], coords: { x: 36, y: 80 } },
  { id: "jaipur", name: "Jaipur", region: "Rajasthan", tagline: "Pink City", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1800&q=80", scores: { weather: 74, crowd: 52, budget: 80, safety: 86, satisfaction: 91, eco: 70 }, bestMonths: ["Oct","Nov","Dec","Jan","Feb"], priceTrend: 7, category: ["heritage","culture"], coords: { x: 36, y: 34 } },
  { id: "udaipur", name: "Udaipur", region: "Rajasthan", tagline: "City of Lakes", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1800&q=80", scores: { weather: 78, crowd: 58, budget: 72, safety: 88, satisfaction: 94, eco: 76 }, bestMonths: ["Oct","Nov","Dec","Jan","Feb","Mar"], priceTrend: 11, category: ["heritage","honeymoon"], coords: { x: 32, y: 38 } },
  { id: "manali", name: "Manali", region: "Himachal", tagline: "Snowy Escape", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1800&q=80", scores: { weather: 87, crowd: 38, budget: 70, safety: 84, satisfaction: 90, eco: 78 }, bestMonths: ["Dec","Jan","Feb","May","Jun"], priceTrend: 17, category: ["mountain","adventure","honeymoon"], coords: { x: 38, y: 20 } },
  { id: "shimla", name: "Shimla", region: "Himachal", tagline: "Colonial Charm", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1800&q=80", scores: { weather: 85, crowd: 50, budget: 76, safety: 86, satisfaction: 88, eco: 76 }, bestMonths: ["Mar","Apr","May","Sep","Oct"], priceTrend: 9, category: ["mountain","family"], coords: { x: 39, y: 22 } },
  { id: "pondicherry", name: "Pondicherry", region: "Tamil Nadu", tagline: "French Riviera of East", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1800&q=80", scores: { weather: 80, crowd: 72, budget: 82, safety: 89, satisfaction: 91, eco: 80 }, bestMonths: ["Oct","Nov","Dec","Jan","Feb","Mar"], priceTrend: 5, category: ["beach","culture"], coords: { x: 44, y: 76 } },
  { id: "mysore", name: "Mysore", region: "Karnataka", tagline: "Royal Heritage", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1800&q=80", scores: { weather: 82, crowd: 70, budget: 84, safety: 88, satisfaction: 89, eco: 78 }, bestMonths: ["Oct","Nov","Dec","Jan","Feb"], priceTrend: 4, category: ["heritage","family"], coords: { x: 38, y: 72 } },
  { id: "agra", name: "Agra", region: "Uttar Pradesh", tagline: "Eternal Love", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=80", scores: { weather: 70, crowd: 30, budget: 86, safety: 80, satisfaction: 92, eco: 64 }, bestMonths: ["Oct","Nov","Dec","Jan","Feb"], priceTrend: 6, category: ["heritage"], coords: { x: 46, y: 34 } },
  { id: "delhi", name: "Delhi", region: "Delhi NCR", tagline: "Dilwalon ki Dilli", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1800&q=80", scores: { weather: 65, crowd: 28, budget: 82, safety: 72, satisfaction: 84, eco: 50 }, bestMonths: ["Oct","Nov","Feb","Mar"], priceTrend: 3, category: ["heritage","city"], coords: { x: 42, y: 30 } },
  { id: "mumbai", name: "Mumbai", region: "Maharashtra", tagline: "City of Dreams", image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1800&q=80", scores: { weather: 72, crowd: 32, budget: 64, safety: 80, satisfaction: 86, eco: 58 }, bestMonths: ["Nov","Dec","Jan","Feb"], priceTrend: 12, category: ["city","nightlife"], coords: { x: 28, y: 54 } },
  { id: "bengaluru", name: "Bengaluru", region: "Karnataka", tagline: "Silicon Valley of India", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1800&q=80", scores: { weather: 88, crowd: 48, budget: 70, safety: 84, satisfaction: 85, eco: 70 }, bestMonths: ["Sep","Oct","Nov","Dec","Jan","Feb"], priceTrend: 8, category: ["city","nomad"], coords: { x: 40, y: 72 } },
  { id: "chennai", name: "Chennai", region: "Tamil Nadu", tagline: "Gateway to South", image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1800&q=80", scores: { weather: 74, crowd: 56, budget: 78, safety: 86, satisfaction: 84, eco: 66 }, bestMonths: ["Nov","Dec","Jan","Feb"], priceTrend: 4, category: ["city","culture"], coords: { x: 46, y: 74 } },
  { id: "hyderabad", name: "Hyderabad", region: "Telangana", tagline: "City of Pearls", image: "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80", hero: "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1800&q=80", scores: { weather: 78, crowd: 60, budget: 82, safety: 84, satisfaction: 87, eco: 68 }, bestMonths: ["Oct","Nov","Dec","Jan","Feb"], priceTrend: 6, category: ["heritage","city"], coords: { x: 44, y: 60 } },
];

export const aiAgents = [
  { name: "Planner AI", status: "active", insight: "Optimized 7-day Himachal route saves 4hrs", confidence: 94, color: "primary" },
  { name: "Budget AI", status: "active", insight: "Goa hotels +22% next week, book today", confidence: 88, color: "warning" },
  { name: "Weather AI", status: "active", insight: "Kashmir weather window opens June 14", confidence: 96, color: "info" },
  { name: "Crowd AI", status: "active", insight: "Meghalaya 38% lower crowd this week", confidence: 91, color: "success" },
  { name: "Safety AI", status: "alert", insight: "Landslide risk on NH-44, alt route ready", confidence: 86, color: "destructive" },
  { name: "Food AI", status: "active", insight: "12 verified street stalls in Old Delhi", confidence: 89, color: "accent" },
  { name: "Hotel AI", status: "active", insight: "Lake-view rooms 18% cheaper in Udaipur", confidence: 92, color: "primary" },
  { name: "Transport AI", status: "active", insight: "Vande Bharat to Varanasi 2hr saved", confidence: 95, color: "info" },
  { name: "Event AI", status: "active", insight: "Pushkar Mela starts in 12 days", confidence: 99, color: "accent" },
  { name: "Packing AI", status: "idle", insight: "Generated 24-item Ladakh checklist", confidence: 90, color: "muted" },
  { name: "Document AI", status: "active", insight: "ILP permit auto-renewed for Arunachal", confidence: 93, color: "success" },
  { name: "Expense AI", status: "active", insight: "₹2,340 saved vs avg traveler", confidence: 87, color: "success" },
  { name: "Eco AI", status: "active", insight: "Suggested 3 carbon-neutral stays", confidence: 84, color: "success" },
  { name: "Voice AI", status: "active", insight: "Live translate: Hindi → English", confidence: 92, color: "primary" },
  { name: "News AI", status: "alert", insight: "Bandh in Manali Oct 18, reroute", confidence: 90, color: "warning" },
];

export const alerts = [
  { type: "warning", title: "Heavy rainfall in Munnar", desc: "Expected next 48 hours. Consider rescheduling outdoor activities.", time: "12m ago" },
  { type: "danger", title: "Landslide risk: NH-44 Kashmir", desc: "Use alternate Mughal Road. AI rerouted 132 active itineraries.", time: "1h ago" },
  { type: "info", title: "Pushkar Mela early booking window", desc: "Hotel prices expected to surge 60% in 9 days.", time: "3h ago" },
  { type: "success", title: "Low crowd window: Meghalaya", desc: "Tourist density 38% below avg. Best 6 days starting tomorrow.", time: "5h ago" },
];

export const itinerary = [
  { day: 1, title: "Arrival & Old Delhi", items: [ { t: "09:00", a: "Land at IGI T3", icon: "Plane" }, { t: "12:00", a: "Check-in The Lodhi", icon: "Hotel" }, { t: "16:00", a: "Jama Masjid + Chandni Chowk walk", icon: "MapPin" }, { t: "20:00", a: "Karim's heritage dinner", icon: "Utensils" } ] },
  { day: 2, title: "Imperial Delhi", items: [ { t: "08:00", a: "Sunrise at Humayun's Tomb", icon: "Sunrise" }, { t: "11:00", a: "Qutub Minar complex", icon: "Landmark" }, { t: "15:00", a: "India Gate & Rajpath", icon: "Flag" }, { t: "19:00", a: "Indian Accent tasting menu", icon: "Utensils" } ] },
  { day: 3, title: "Agra Day Trip", items: [ { t: "06:00", a: "Gatimaan Express to Agra", icon: "Train" }, { t: "09:30", a: "Taj Mahal sunrise tour", icon: "Landmark" }, { t: "14:00", a: "Agra Fort + Mehtab Bagh", icon: "Castle" }, { t: "21:00", a: "Return to Delhi", icon: "Train" } ] },
  { day: 4, title: "Fly to Udaipur", items: [ { t: "10:00", a: "Flight to Udaipur", icon: "Plane" }, { t: "14:00", a: "City Palace + Jagdish Temple", icon: "Landmark" }, { t: "18:00", a: "Lake Pichola boat sunset", icon: "Sun" }, { t: "20:00", a: "Ambrai rooftop dinner", icon: "Utensils" } ] },
];

export const trendData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  visitors: 120 + Math.round(Math.sin(i / 1.6) * 60 + Math.random() * 30),
  satisfaction: 70 + Math.round(Math.cos(i / 2) * 12 + Math.random() * 8),
  price: 50 + Math.round(Math.sin(i / 2.2) * 25 + Math.random() * 10),
}));

export const radarData = [
  { axis: "Weather", v: 88 }, { axis: "Crowd", v: 72 }, { axis: "Budget", v: 64 },
  { axis: "Safety", v: 86 }, { axis: "Food", v: 90 }, { axis: "Eco", v: 82 },
];

export const personas = [
  { id: "family", name: "Family", icon: "Users", desc: "Safe, comfortable, kid-friendly" },
  { id: "backpacker", name: "Backpacker", icon: "Backpack", desc: "Budget, raw, untouched" },
  { id: "luxury", name: "Luxury", icon: "Crown", desc: "5-star, curated, exclusive" },
  { id: "adventure", name: "Adventure", icon: "Mountain", desc: "Trek, raft, climb" },
  { id: "spiritual", name: "Spiritual", icon: "Sparkles", desc: "Temples, retreats, silence" },
  { id: "solo", name: "Solo", icon: "User", desc: "Safe, social, self-paced" },
  { id: "nomad", name: "Digital Nomad", icon: "Laptop", desc: "Wifi, cafés, coliving" },
];

export const marketplace = [
  { name: "Tenzin Norbu", role: "Ladakh Guide", rating: 4.9, reviews: 248, price: "₹3,500/day", trust: 96, verified: true },
  { name: "Riya Menon", role: "Kerala Photographer", rating: 4.8, reviews: 186, price: "₹6,000/session", trust: 94, verified: true },
  { name: "Pankaj Sharma", role: "Himalayan Trek Lead", rating: 5.0, reviews: 412, price: "₹4,200/day", trust: 98, verified: true },
  { name: "Aarti Devi", role: "Rajasthan Artisan", rating: 4.7, reviews: 92, price: "₹800/piece", trust: 90, verified: true },
  { name: "Karim Bhai", role: "Delhi Food Walk", rating: 4.9, reviews: 311, price: "₹1,500/walk", trust: 95, verified: true },
  { name: "Lalrinawmi", role: "Meghalaya Homestay", rating: 4.8, reviews: 78, price: "₹2,200/night", trust: 92, verified: true },
];

export const stories = [
  { user: "Anika S.", place: "Spiti Valley", quote: "AI rerouted us around a snowstorm — saved the trip.", likes: 1240, image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80" },
  { user: "Rohan K.", place: "Hampi", quote: "Hidden boulder café Tripify suggested was unreal.", likes: 892, image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80" },
  { user: "Maya P.", place: "Meghalaya", quote: "Living root bridges with zero crowd. Magic.", likes: 1576, image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80" },
];

export const pricingPlans = [
  { name: "Explorer", price: "Free", tag: "Forever", features: ["10 AI plans/mo","Basic predictions","Community access","Map access"], cta: "Start free", highlight: false },
  { name: "Voyager", price: "₹499", tag: "/month", features: ["Unlimited AI plans","Live predictions","Crowd & price alerts","Priority assistant","Offline maps","Voice translator"], cta: "Go Voyager", highlight: true },
  { name: "Nomad", price: "₹1,499", tag: "/month", features: ["Everything in Voyager","Multi-city optimizer","AR navigation","Concierge AI","Premium marketplace","Insurance intelligence"], cta: "Go Nomad", highlight: false },
];

export const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];