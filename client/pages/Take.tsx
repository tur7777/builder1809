import { useEffect, useState } from "react";

interface Offer { id: string; title: string; budgetTON: number; status: string; createdAt: string }

export default function Take() {
  const [offers, setOffers] = useState<Offer[]>([]);
  useEffect(() => {
    fetch("/api/offers").then((r) => r.json()).then((d) => setOffers(d.items)).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold">Take</h1>
        <p className="mt-2 text-white/70">Browse and accept offers. Escrow-backed payments ensure risk‑free collaboration.</p>

        <div className="mt-6 space-y-3">
          {offers.length === 0 && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-white/70">No offers yet. Be the first to create one.</div>
          )}
          {offers.map((o) => (
            <div key={o.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="text-base font-medium">{o.title}</div>
                <div className="text-sm text-primary">{o.budgetTON} TON</div>
              </div>
              <div className="mt-1 text-xs text-white/60">Status: {o.status} • {new Date(o.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
