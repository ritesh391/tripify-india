import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { Bot, Send, Sparkles, Languages, Loader2, User } from "lucide-react";
import { getToken } from "@/api";

export const Route = createFileRoute("/assistant")({ component: A, head: () => ({ meta: [{ title: "AI Assistant — Tripify India" }] }) });

const suggestions = [
  "Best low-crowd spot in India right now",
  "Plan 3-day Goa trip under ₹15k",
  "What to pack for Himachal in December?",
  "Best time to visit Kerala backwaters",
  "Hidden gems near Mumbai for weekend",
  "Budget trip to Rajasthan for 2 people",
];

type Message = { role: "user" | "ai"; text: string };

function A() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Namaste! 🙏 I'm your Tripify AI Travel Assistant. Ask me anything about travelling in India — destinations, budgets, itineraries, packing, best time to visit and more!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.reply || "Sorry, I couldn't process that. Try again!" }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Connection error. Make sure the backend is running!" }]);
    }
    setLoading(false);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Conversational AI"
        title="AI Travel Assistant"
        desc="Ask anything about travelling in India — real AI powered answers."
        action={<Button variant="outline"><Languages className="h-4 w-4" />Hindi · English · Tamil</Button>}
      />
      <div className="grid lg:grid-cols-4 gap-6">
        <GlassCard className="lg:col-span-3 flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-md rounded-2xl p-3 text-sm ${m.role === "user" ? "bg-primary/15 ring-1 ring-primary/30" : "glass-strong"}`}>
                  {m.role === "ai" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-3 w-3 text-primary" />
                      <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">Tripify AI</span>
                    </div>
                  )}
                  {m.role === "user" && (
                    <div className="flex items-center gap-2 mb-1 justify-end">
                      <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">You</span>
                      <User className="h-3 w-3 text-primary" />
                    </div>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="glass-strong rounded-2xl p-3 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="h-3 w-3 text-primary" />
                    <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">Tripify AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span className="text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="mt-4 relative">
            <input
              className="w-full h-12 bg-secondary/40 border border-border/60 rounded-xl pl-4 pr-16 text-sm"
              placeholder="Ask anything about India travel..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-aurora flex items-center justify-center text-background disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard glow>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">Suggested</span>
            </div>
            <div className="space-y-2 text-sm">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="block w-full text-left p-2 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors text-xs"
                >
                  {s}
                </button>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <Badge tone="success">AI Powered</Badge>
            <div className="text-sm mt-3 text-muted-foreground">Powered by Llama 3.3 via Groq — real answers about Indian travel.</div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}