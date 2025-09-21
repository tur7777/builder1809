import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

export default function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const seed = (location.state as any)?.offer;
  const [offer, setOffer] = useState<any>(seed || null);
  const [loading, setLoading] = useState(!seed);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (seed || !id) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`/api/offers/${id}`);
        if (!mounted) return;
        if (!r.ok) throw new Error(`Failed: ${r.status}`);
        const ct = r.headers.get("content-type") || "";
        const data = ct.includes("application/json")
          ? await r.json()
          : { offer: null };
        if (!data.offer) throw new Error("No data");
        setOffer(data.offer);
      } catch (e: any) {
        if (!mounted) return;
        setError("Unable to load offer");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id, seed]);

  const minimal = offer
    ? {
        title: String(offer.title || "Offer"),
        budgetTON: Number(offer.budgetTON || 0),
        status: String(offer.status || "open"),
        createdAt: String(offer.createdAt || new Date().toISOString()),
      }
    : null;

  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <div className="mb-4 text-sm text-white/60">
          <Link to="/take" className="hover:underline">
            ← Back to offers
          </Link>
        </div>
        {loading && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-white/70">
            Loading…
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-600 bg-red-900/30 p-4 text-red-200">
            {error}
          </div>
        )}
        {minimal && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-1 text-2xl font-semibold">{minimal.title}</div>
            <div className="text-sm text-white/60 mb-4">
              {new Date(minimal.createdAt).toLocaleString()}
            </div>
            <div className="text-primary text-lg font-medium">
              {minimal.budgetTON} TON
            </div>
            <div className="mt-1 text-xs text-white/60">
              Status: {minimal.status}
            </div>
            {offer?.description && (
              <div className="mt-3 whitespace-pre-wrap text-sm text-white/80">
                {String(offer.description)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
