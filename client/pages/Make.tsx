import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import WalletGate from "@/components/WalletGate";

export default function Make() {
  const [tonInfo, setTonInfo] = useState<any>(null);
  useEffect(() => {
    fetch("/api/ton/info")
      .then((r) => r.json())
      .then(setTonInfo)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold">Make</h1>
        <WalletGate>
          <p className="mt-2 text-white/70">
            Create gigs or proposals powered by TON. Draft your offer, set
            milestones, and publish securely.
          </p>
          <Link
            to="/offer/new"
            className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create a New Offer
          </Link>
        </WalletGate>

        {tonInfo?.ok && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
            <div className="mb-2 font-semibold text-white">TON Chain Info</div>
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(tonInfo.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
