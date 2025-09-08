import { useEffect, useState } from "react";

interface Offer {
  id: string;
  title: string;
  budgetTON: number;
  status: string;
  createdAt: string;
}

export default function Take() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadOffers() {
      setLoading(true);
      setError(null);

      try {
        const { supabase } = await import("@/lib/supabase");
        if (supabase) {
          const { data, error } = await supabase
            .from("offers")
            .select("id,title,budgetTON,status,createdAt")
            .order("createdAt", { ascending: false });
          if (error) throw error;
          if (!mounted) return;
          setOffers((data || []).map((d: any) => ({
            id: String(d.id ?? crypto.randomUUID()),
            title: String(d.title ?? ""),
            budgetTON: Number(d.budgetTON ?? 0),
            status: String(d.status ?? "open"),
            createdAt: String(d.createdAt ?? new Date().toISOString()),
          })));
          setLoading(false);
          return;
        }
      } catch (e) {
        // fall back to API below
      }

      const paths = ["/api/offers", `${window.location.origin}/api/offers`];
      for (const p of paths) {
        try {
          const res = await fetch(p, { credentials: "same-origin" });
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`HTTP ${res.status} - ${text}`);
          }
          const json = await res.json().catch(() => null);
          if (!json || !mounted) return;
          const items = Array.isArray(json.items) ? json.items : json;
          setOffers(items || []);
          setLoading(false);
          return;
        } catch (e: any) {
          console.warn("fetch /api/offers failed for", p, e?.message || e);
          if (p === paths[paths.length - 1]) {
            setError(String(e?.message || e));
            setLoading(false);
          }
        }
      }
    }

    loadOffers();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold">Take</h1>
        <p className="mt-2 text-white/70">
          Browse and accept offers. Escrow-backed payments ensure risk‑free
          collaboration.
        </p>

        <div className="mt-6 space-y-3">
          {loading && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-white/70">
              Loading offers...
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-600 bg-red-900/30 p-4 text-red-200">
              Failed to load offers: {error}
            </div>
          )}

          {!loading && !error && offers.length === 0 && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-white/70">
              No offers yet. Be the first to create one.
            </div>
          )}

          {offers.map((o) => (
            <div
              key={o.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-medium">{o.title}</div>
                <div className="text-sm text-primary">{o.budgetTON} TON</div>
              </div>
              <div className="mt-1 text-xs text-white/60">
                Status: {o.status} • {new Date(o.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
