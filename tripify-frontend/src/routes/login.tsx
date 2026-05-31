import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Mail, Lock, Smartphone, FileBadge2 } from "lucide-react";
import { Button } from "@/components/common";
import { useState } from "react";
import { loginUser, registerUser, saveToken } from "@/api";

export const Route = createFileRoute("/login")({ component: Login, head: () => ({ meta: [{ title: "Sign in — Tripify India" }] }) });

function Login() {
  return <AuthLayout title="Welcome back" subtitle="Your AI travel intelligence is ready." mode="login" />;
}

export function AuthLayout({ title, subtitle, mode }: { title: string; subtitle: string; mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      let data;
      if (mode === "login") {
        data = await loginUser(email, password);
      } else {
        data = await registerUser(name, email, password);
      }

      if (data.token) {
        saveToken(data.token);
        localStorage.setItem('tripify_user', JSON.stringify(data.user));
        navigate({ to: "/dashboard" });
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Could not connect to server");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background bg-glow">
      <div className="hidden lg:flex flex-1 relative overflow-hidden grid-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
        <div className="relative z-10 p-12 flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-aurora shadow-glow flex items-center justify-center"><Sparkles className="h-4 w-4 text-background" /></div>
            <span className="font-display font-bold text-lg">Tripify <span className="text-gradient">India</span></span>
          </Link>
          <div>
            <h2 className="font-display text-5xl font-bold leading-tight">Predict the<br/><span className="text-gradient">perfect trip.</span></h2>
            <p className="text-muted-foreground mt-4 max-w-md">15 AI agents watching weather, crowd, price and safety across 26 destinations — so you never travel blind.</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-strong rounded-2xl p-8">
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1">{subtitle}</p>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {mode === "signup" && (
            <div className="mt-6">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Full name</label>
              <input
                className="mt-1 w-full h-11 bg-secondary/40 border border-border/60 rounded-lg px-4 text-sm"
                placeholder="Anika Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="mt-4">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
            <div className="relative mt-1">
              <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg pl-10 pr-4 text-sm"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Password</label>
            <div className="relative mt-1">
              <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg pl-10 pr-4 text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            className="mt-6 w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />or continue with<div className="h-px flex-1 bg-border" /></div>
          <div className="grid grid-cols-3 gap-2">
            {[{i:Mail,l:"Google"},{i:Smartphone,l:"OTP"},{i:FileBadge2,l:"DigiLocker"}].map((b)=>(
              <button key={b.l} className="h-11 rounded-lg border border-border/60 hover:bg-secondary/40 flex items-center justify-center gap-2 text-xs"><b.i className="h-4 w-4" />{b.l}</button>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "New here? " : "Already a member? "}
            <Link to={mode === "login" ? "/signup" : "/login"} className="text-primary font-semibold">{mode === "login" ? "Create account" : "Sign in"}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}