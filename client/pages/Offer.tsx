import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`/api/offers/${id}`);
        if (!mounted) return;
        if (!r.ok) throw new Error(`Failed: ${r.status}`);
        const json = await r.json();
        setOffer(json.offer);
      } catch (e: any) {
        if (!mounted) return;
        setError(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <div className="mb-4 text-sm text-white/60"><Link to="/take" className="hover:underline">← Back to offers</Link></div>
        {loading && <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-white/70">Loading…</div>}
        {error && <div className="rounded-lg border border-red-600 bg-red-900/30 p-4 text-red-200">{error}</div>}
        {offer && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-1 text-2xl font-semibold">{offer.title}</div>
            <div className="text-sm text-white/60 mb-4">{new Date(offer.createdAt).toLocaleString()}</div>
            <div className="mb-4 whitespace-pre-wrap text-white/80">{offer.description || "No description"}</div>
            <div className="text-primary text-lg font-medium">{offer.budgetTON} TON</div>
            <div className="mt-1 text-xs text-white/60">Status: {offer.status}</div>
          </div>
        )}
      </div>
    </div>
  );
}
