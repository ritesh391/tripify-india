import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader, GlassCard, Badge, Button } from "@/components/common";
import { CreditCard, ShieldCheck, Lock, User, Mail, Phone, Sparkles, Check, Wallet, Smartphone, Loader2 } from "lucide-react";
import { createBooking } from "@/api";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  validateSearch: (search: Record<string, unknown>) => ({
    type: (search.type as string) || 'Stay',
    stayName: (search.stayName as string) || '',
    stayCity: (search.stayCity as string) || '',
    roomName: (search.roomName as string) || 'Room',
    price: (search.price as number) || 0,
    nights: (search.nights as number) || 1,
    date: (search.date as string) || '',
    duration: (search.duration as string) || '',
  }),
  head: () => ({ meta: [{ title: "Checkout — Tripify India" }] })
});

function Checkout() {
  const navigate = useNavigate();
  const { type, stayName, stayCity, roomName, price: roomPrice, nights, date, duration } = Route.useSearch();
  const [pay, setPay] = useState("card");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [insurance, setInsurance] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const basePrice = roomPrice * nights;
  const taxes = Math.round(basePrice * 0.12);
  const insurancePrice = insurance ? 249 : 0;
  const discount = 820;
  const credit = 500;
  const total = basePrice + taxes + insurancePrice - discount - credit;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await createBooking({
        type: type,
        title: `${stayName} · ${stayCity}`,
        date: type === 'Stay' ? `${nights} nights` : date,
        price: total,
        details: { payment_method: pay, insurance, travelers: { name, email, phone } }
      });
      setStep(3);
      setTimeout(() => navigate({ to: '/bookings' }), 2000);
    } catch {
      alert('Booking failed. Please try again.');
    }
    setLoading(false);
  };

  const steps = ["Details", "Payment", "Confirm"];

  return (
    <AppShell>
      <PageHeader eyebrow="Secure checkout" title="Almost there" desc="Encrypted, AI-verified booking — your trip is one tap away." />

      <div className="flex items-center gap-3 mb-6 max-w-xl">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex items-center gap-3">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? "bg-aurora text-background shadow-glow" : "bg-secondary text-muted-foreground"}`}>
              {i < step - 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <div className="text-xs font-semibold">{s}</div>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step - 1 ? "bg-aurora" : "bg-border/60"}`} />}
          </div>
        ))}
      </div>

      {step === 3 ? (
        <GlassCard className="text-center py-20">
          <div className="h-16 w-16 rounded-full bg-aurora/20 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <div className="font-display text-2xl font-bold">Booking Confirmed! 🎉</div>
          <div className="text-muted-foreground mt-2">Redirecting to your bookings...</div>
          <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto mt-4" />
        </GlassCard>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {step === 1 && (
              <GlassCard>
                <div className="font-display font-bold mb-4">Lead traveler</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-muted-foreground">Full name</label>
                    <div className="relative mt-1">
                      <User className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="Aarav Mehta" className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg pl-9 pr-3 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-muted-foreground">Email</label>
                    <div className="relative mt-1">
                      <Mail className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg pl-9 pr-3 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-muted-foreground">Phone</label>
                    <div className="relative mt-1">
                      <Phone className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg pl-9 pr-3 text-sm" />
                    </div>
                  </div>
                </div>
                <Button className="mt-4 w-full" onClick={() => setStep(2)}>Continue to Payment</Button>
              </GlassCard>
            )}

            {step === 2 && (
              <>
                <GlassCard>
                  <div className="font-display font-bold mb-4">Payment method</div>
                  <div className="grid sm:grid-cols-3 gap-2 mb-4">
                    {[["card", "Card", CreditCard], ["upi", "UPI", Smartphone], ["wallet", "Wallet", Wallet]].map(([id, l, I]: any) => (
                      <button key={id} onClick={() => setPay(id)}
                        className={`p-3 rounded-xl border flex items-center gap-2 text-sm transition-all ${pay === id ? "bg-primary/15 border-primary/40 text-primary shadow-glow" : "border-border/60 hover:bg-secondary/40"}`}>
                        <I className="h-4 w-4" />{l}
                      </button>
                    ))}
                  </div>
                  {pay === "card" && (
                    <div className="space-y-3">
                      <div><label className="text-[10px] uppercase text-muted-foreground">Card number</label><input placeholder="•••• •••• •••• 4242" className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm font-mono" /></div>
                      <div className="grid grid-cols-3 gap-3">
                        <div><label className="text-[10px] uppercase text-muted-foreground">Expiry</label><input placeholder="MM/YY" className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm font-mono" /></div>
                        <div><label className="text-[10px] uppercase text-muted-foreground">CVC</label><input placeholder="•••" className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm font-mono" /></div>
                        <div><label className="text-[10px] uppercase text-muted-foreground">ZIP</label><input placeholder="110001" className="w-full h-11 bg-secondary/40 border border-border/60 rounded-lg px-3 text-sm font-mono" /></div>
                      </div>
                    </div>
                  )}
                  {pay === "upi" && <div className="p-4 rounded-lg bg-secondary/40 text-sm">Enter UPI ID <input placeholder="aarav@okhdfc" className="ml-2 bg-transparent border-b border-border/60 outline-none" /></div>}
                  {pay === "wallet" && <div className="grid grid-cols-3 gap-2">{["Paytm", "PhonePe", "Amazon Pay"].map(w => <div key={w} className="p-3 rounded-lg bg-secondary/40 text-center text-sm">{w}</div>)}</div>}
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground"><Lock className="h-3 w-3" />256-bit encrypted · PCI-DSS compliant</div>
                </GlassCard>

                <GlassCard glow>
                  <div className="flex items-center gap-2 mb-2"><Sparkles className="h-4 w-4 text-primary" /><span className="font-semibold">AI Travel Insurance</span></div>
                  <div className="text-sm text-muted-foreground mb-3">Risk score: <span className="text-success font-semibold">Low</span>. Standard cover ₹249 covers cancellations, delays, medical up to ₹2L.</div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={insurance} onChange={e => setInsurance(e.target.checked)} className="accent-primary" />
                    Add insurance · ₹249
                  </label>
                </GlassCard>
              </>
            )}
          </div>

          <div>
            <GlassCard className="sticky top-20">
              <div className="font-display font-bold mb-3">Payment summary</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{stayName} · {type === 'Stay' ? `${nights} nights` : duration || date}</span>
                  <span>₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground"><span>Taxes & fees</span><span>₹{taxes.toLocaleString()}</span></div>
                {insurance && <div className="flex justify-between text-muted-foreground"><span>Insurance</span><span>₹{insurancePrice}</span></div>}
                <div className="flex justify-between text-success"><span>AI discount</span><span>−₹{discount}</span></div>
                <div className="flex justify-between text-success"><span>Tripify credit</span><span>−₹{credit}</span></div>
                <div className="border-t border-border/40 pt-2 mt-2 flex justify-between font-display text-xl font-bold">
                  <span>Total</span><span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              {step === 1 ? (
                <Button className="w-full mt-4" onClick={() => setStep(2)}>Continue</Button>
              ) : (
                <Button className="w-full mt-4" onClick={handleConfirm} disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Processing...</> : <><ShieldCheck className="h-4 w-4 mr-2" />Confirm & Pay</>}
                </Button>
              )}
              <div className="text-[11px] text-muted-foreground text-center mt-2 flex items-center justify-center gap-1"><Lock className="h-3 w-3" />Secure · Free cancellation</div>
            </GlassCard>
          </div>
        </div>
      )}
    </AppShell>
  );
}