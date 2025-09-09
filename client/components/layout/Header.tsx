import {
  TonConnectButton,
  TonConnectUIProvider,
  useTonWallet,
} from "@tonconnect/ui-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import BottomNav from "./BottomNav";

function UpsertOnConnect() {
  const wallet = useTonWallet();
  useEffect(() => {
    const address = wallet?.account?.address;
    if (address) {
      fetch("/api/users/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      }).catch(console.error);
    }
  }, [wallet?.account?.address]);
  return null;
}

export default function Header({ children }: { children?: React.ReactNode }) {
  const manifestUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/tonconnect-manifest.json`
      : "/tonconnect-manifest.json";
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <UpsertOnConnect />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[hsl(217,33%,9%)]/80 backdrop-blur">
        <div className="mx-auto mt-[69px] sm:mt-[60px] flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <Link
            to="/"
            className="text-sm font-semibold text-white/80 hover:text-white"
          >
            FreelTON
          </Link>
          <div className="w-fit">
            <TonConnectButton className="[&_*]:!font-medium" />
          </div>
        </div>
      </header>
      {children}
      <div className="h-[70px]" />
      <BottomNav />
    </TonConnectUIProvider>
  );
}
