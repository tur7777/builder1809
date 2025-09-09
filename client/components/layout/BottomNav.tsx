import { Link, useLocation } from "react-router-dom";

const items = [
  { to: "/make", label: "Make" },
  { to: "/take", label: "Take" },
  { to: "/learn", label: "Learn" },
  { to: "/profile", label: "Profile" },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 h-[70px] border-t border-white/10 bg-[hsl(217,33%,9%)]/80 backdrop-blur"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-around px-4">
        {items.map((i) => {
          const active = pathname === i.to;
          return (
            <Link
              key={i.to}
              to={i.to}
              className={
                "text-sm font-medium transition-colors " +
                (active ? "text-white" : "text-white/70 hover:text-white")
              }
            >
              {i.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
