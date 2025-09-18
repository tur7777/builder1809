import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadOffers() {
      setLoading(true);
      setError(null);

      const query = q ? `?q=${encodeURIComponent(q)}` : "";
      const base = typeof window !== "undefined" ? window.location.origin : "";
      const candidates = [`/api/offers${query}`, `${base}/api/offers${query}`];

      for (const url of candidates) {
        try {
          const r = await fetch(url);
          if (!mounted) return;
          if (!r.ok) continue;
          const json = await r.json().catch(() => null);
          if (!json) continue;
          setOffers(
            (json.items || []).map((d: any) => ({
              id: String(d.id ?? crypto.randomUUID()),
              title: String(d.title ?? ""),
              budgetTON: Number(d.budgetTON ?? 0),
              status: String(d.status ?? "open"),
              createdAt: String(d.createdAt ?? new Date().toISOString()),
            })),
          );
          setLoading(false);
          return;
        } catch (_) {
          // try next candidate
        }
      }

      if (mounted) {
        setError("Network error while loading offers");
        setLoading(false);
      }
    }

    const t = setTimeout(loadOffers, 250);

    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [q]);

  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold">Take</h1>
        <p className="mt-2 text-white/70">
          Browse and accept offers. Escrow-backed payments ensure risk‑free
          collaboration.
        </p>

        <div className="mt-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search offers"
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="mt-4 space-y-3">
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
            <Link
              key={o.id}
              to={`/offer/${o.id}`}
              state={{ offer: o }}
              className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-medium">{o.title}</div>
                <div className="text-sm text-primary">{o.budgetTON} TON</div>
              </div>
              <div className="mt-1 text-xs text-white/60">
                Status: {o.status} • {new Date(o.createdAt).toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
