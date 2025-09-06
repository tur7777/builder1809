import { TonConnectButton, TonConnectUIProvider } from "@tonconnect/ui-react";
import { Link } from "react-router-dom";

export default function Header({ children }: { children?: React.ReactNode }) {
  const manifestUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/tonconnect-manifest.json`
      : "/tonconnect-manifest.json";
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[hsl(217,33%,9%)]/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <Link
            to="/"
            className="text-sm font-semibold text-white/80 hover:text-white"
          >
            FreelTON
          </Link>
          <TonConnectButton className="[&_*]:!font-medium" />
        </div>
      </header>
      {children}
    </TonConnectUIProvider>
  );
}
