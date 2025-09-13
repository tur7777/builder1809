import WalletGate from "@/components/WalletGate";

import WalletGate from "@/components/WalletGate";
import { useWalletAddress } from "@/hooks/useTon";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const address = useWalletAddress();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!address) return;
      try {
        const r = await fetch(`/api/users/${address}`);
        if (!mounted) return;
        if (r.ok) {
          const json = await r.json();
          setNickname(json?.user?.nickname || "");
        }
      } catch {}
    }
    load();
    return () => {
      mounted = false;
    };
  }, [address]);

  async function saveNickname() {
    if (!address || !nickname) return;
    setLoading(true);
    setMessage(null);
    try {
      const r = await fetch("/api/users/set-nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, nickname }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to set nickname");
      }
      setMessage("Saved");
    } catch (e: any) {
      setMessage(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold">Profile</h1>
        <WalletGate>
          <p className="mt-2 text-white/70">
            Manage your identity, skills, and past work. Connect a TON wallet to
            get paid.
          </p>

          <div className="mt-6 space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <div>
              <div className="text-xs text-white/60">Wallet Address</div>
              <div className="font-mono break-all text-sm">
                {address || "Not connected"}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Nickname</label>
              <div className="flex gap-2">
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="your_nickname"
                  className="bg-white/5 text-white border-white/10"
                />
                <Button onClick={saveNickname} disabled={loading || !nickname}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
              <div className="mt-1 text-xs text-white/60">
                Unique, tied to your wallet. You can change it anytime.
              </div>
              {message && (
                <div className="mt-2 text-xs text-white/70">{message}</div>
              )}
            </div>
          </div>
        </WalletGate>
      </div>
    </div>
  );
}
