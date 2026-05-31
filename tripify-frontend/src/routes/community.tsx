import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Heart, MessageCircle, TrendingUp, Plus, MapPin, Send, Loader2, X, Trash2 } from "lucide-react";
import { getCommunityPosts, createPost, likePost, getToken } from "@/api";

export const Route = createFileRoute("/community")({ component: C, head: () => ({ meta: [{ title: "Community — Tripify India" }] }) });

const trending = ["#spiti", "#monsoonkerala", "#hampi", "#ziro", "#dzukou", "#chopta", "#tawang", "#ladakh", "#goa2026", "#incredibleindia"];

const placeholderPosts = [
  { id: 101, place: "Spiti Valley", quote: "The most surreal landscape I've ever seen. Silence, stars and snow — absolutely magical!", author_name: "Priya Sharma", likes: 284, created_at: "2026-05-20" },
  { id: 102, place: "Kerala Backwaters", quote: "Waking up on a houseboat to misty canals and birdsong. Nothing compares to this.", author_name: "Rahul Verma", likes: 196, created_at: "2026-05-18" },
  { id: 103, place: "Hampi", quote: "Every stone here tells a story. The Vijayanagara Empire lives on in these ruins.", author_name: "Ananya Iyer", likes: 342, created_at: "2026-05-15" },
  { id: 104, place: "Gulmarg", quote: "First snowfall of the season hit while we were there. Pure magic!", author_name: "Kabir Singh", likes: 218, created_at: "2026-05-12" },
  { id: 105, place: "Varanasi", quote: "The Ganga aarti at dusk is something every Indian must witness at least once.", author_name: "Meera Nair", likes: 445, created_at: "2026-05-10" },
  { id: 106, place: "Jaisalmer", quote: "Slept under the stars on Sam sand dunes. Camel safari at sunrise was unforgettable.", author_name: "Arjun Patel", likes: 167, created_at: "2026-05-08" },
];

const gradients = [
  "from-blue-500/20 to-cyan-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-orange-500/20 to-yellow-500/20",
  "from-purple-500/20 to-pink-500/20",
  "from-red-500/20 to-orange-500/20",
  "from-indigo-500/20 to-blue-500/20",
];

function C() {
  const [posts, setPosts] = useState<any[]>(placeholderPosts);
  const [showForm, setShowForm] = useState(false);
  const [place, setPlace] = useState("");
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    getCommunityPosts().then(data => {
      if (data.posts && data.posts.length > 0) {
        setPosts([...data.posts, ...placeholderPosts]);
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!place || !quote) return;
    setSubmitting(true);
    try {
      const data = await createPost({ place, quote, tags: [] });
      if (data.post) {
        setPosts(prev => [{ ...data.post, author_name: 'You', likes: 0 }, ...prev]);
        setPlace("");
        setQuote("");
        setShowForm(false);
      }
    } catch {}
    setSubmitting(false);
  };

  const handleLike = async (id: number) => {
    if (likedPosts.has(id)) return;
    try {
      await likePost(id);
    } catch {}
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
    setLikedPosts(prev => new Set([...prev, id]));
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/community/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
    } catch {}
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Social"
        title="Community & Stories"
        desc="Live updates, hidden-gem reports and crowd-sourced intelligence from travelers."
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />Share your story
          </Button>
        }
      />

      {/* Post form */}
      {showForm && (
        <GlassCard className="mb-6" glow>
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-bold">Share your travel story</div>
            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground hover:text-foreground" /></button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs uppercase text-muted-foreground">Destination</label>
              <div className="relative mt-1">
                <MapPin className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                  placeholder="Where did you go?"
                  className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg pl-9 pr-3 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase text-muted-foreground">Your story</label>
              <textarea
                value={quote}
                onChange={e => setQuote(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="mt-1 w-full bg-secondary/40 border border-border/60 rounded-lg px-3 py-2 text-sm resize-none"
              />
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={submitting || !place || !quote}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {submitting ? "Posting..." : "Post story"}
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Stories grid */}
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        {posts.map((post, i) => (
          <GlassCard key={post.id || i} className="!p-0 overflow-hidden hover:ring-1 hover:ring-primary/30 transition-all">
            <div className={`aspect-video w-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center relative`}>
              <MapPin className="h-10 w-10 text-white/20" />
              <span className="absolute text-xl font-display font-bold text-white/20 text-center px-4">{post.place}</span>
            </div>
            <div className="p-4">
              <Badge tone="primary">{post.place}</Badge>
              <div className="font-display font-bold mt-2">{post.author_name || 'Traveler'}</div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">"{post.quote}"</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 transition-colors ${likedPosts.has(post.id) ? 'text-red-400' : 'hover:text-red-400'}`}
                >
                  <Heart className={`h-3 w-3 ${likedPosts.has(post.id) ? 'fill-red-400 text-red-400' : ''}`} />
                  {post.likes || 0}
                </button>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {20 + (i * 7) % 40}
                </span>
                <span className="ml-auto text-[10px]">
                  {post.created_at ? new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                </span>
                {post.author_name === 'You' && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-400/60 hover:text-red-400 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Trending */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="font-display font-bold">Trending in community</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trending.map(t => (
            <span key={t} className="px-3 py-1 rounded-full bg-secondary/50 text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-colors">{t}</span>
          ))}
        </div>
      </GlassCard>
    </AppShell>
  );
}