import { useEffect, useState, useMemo } from "react";
import { useWalletAddress } from "@/hooks/useTon";
import { Link } from "react-router-dom";

interface Order {
  id: string;
  title: string;
  status: "created" | "in_progress" | "completed" | "cancelled";
  makerAddress: string;
  takerAddress?: string | null;
  createdAt: string;
}

export default function Chat() {
  const addr = useWalletAddress();
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!addr) return;
    let mounted = true;
    setLoading(true);
    fetch(`/api/orders?address=${encodeURIComponent(addr)}&role=any`)
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        const list = (j.items || []) as any[];
        setItems(
          list.map((o) => ({
            id: String(o.id),
            title: String(o.title || "Order"),
            status: o.status,
            makerAddress: String(o.makerAddress || ""),
            takerAddress: o.takerAddress || null,
            createdAt: String(o.createdAt || new Date().toISOString()),
          })),
        );
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [addr]);

  const sections = useMemo(() => {
    const inProgress = items.filter((i) => i.status === "in_progress" || i.status === "created");
    const completed = items.filter((i) => i.status === "completed");
    return { inProgress, completed };
  }, [items]);

  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold">Chat</h1>
        {!addr && <div className="mt-3 text-white/70">Connect wallet to see your threads.</div>}

        {loading && <div className="mt-4 text-white/70">Loading…</div>}

        {!loading && (
          <>
            <h2 className="mt-6 text-sm font-semibold text-white/60">In Progress</h2>
            <div className="mt-2 space-y-2">
              {sections.inProgress.length === 0 && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-white/70">No active threads.</div>
              )}
              {sections.inProgress.map((o) => (
                <Link
                  key={o.id}
                  to={`/chat/${o.id}`}
                  className="block rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10"
                >
                  <div className="font-medium truncate">{o.title}</div>
                  <div className="text-xs text-white/60 mt-1">
                    {o.status} • {new Date(o.createdAt).toLocaleString()}
                  </div>
                </Link>
              ))}
            </div>

            <h2 className="mt-6 text-sm font-semibold text-white/60">Completed</h2>
            <div className="mt-2 space-y-2">
              {sections.completed.length === 0 && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-white/70">No completed orders yet.</div>
              )}
              {sections.completed.map((o) => (
                <Link
                  key={o.id}
                  to={`/chat/${o.id}`}
                  className="block rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10"
                >
                  <div className="font-medium truncate">{o.title}</div>
                  <div className="text-xs text-white/60 mt-1">
                    completed • {new Date(o.createdAt).toLocaleString()}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
