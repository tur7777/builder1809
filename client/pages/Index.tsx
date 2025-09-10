import { Bot, ChevronRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type BotItem = {
  name: string;
  path: string;
  handle?: string;
  color: string;
  image?: string;
};

const BOTS: BotItem[] = [
  { name: "Make", path: "/make", color: "bg-violet-500" },
  { name: "Take", path: "/take", color: "bg-amber-500" },
  { name: "Learn", path: "/learn", color: "bg-emerald-500" },
  { name: "Profile", path: "/profile", color: "bg-sky-500" },
];

function BotRow({ item }: { item: BotItem }) {
  return (
    <Link
      to={item.path}
      className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/5"
    >
      <Avatar className="h-10 w-10">
        {item.image ? (
          <AvatarImage src={item.image} alt={item.name} />
        ) : (
          <AvatarFallback className={`${item.color} text-white`}>
            {item.name.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-white truncate">
          {item.name}
        </div>
        {item.handle && (
          <div className="text-xs text-white/60 truncate">{item.handle}</div>
        )}
      </div>
      <ChevronRight className="size-5 text-white/40" />
    </Link>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-10">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg" />
            <div className="relative grid place-items-center rounded-full bg-gradient-to-b from-white/10 to-white/5 p-[2px]">
              <div className="grid size-20 place-items-center rounded-full bg-[hsl(218,28%,13%)]">
                <Bot className="size-10 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="mt-5 text-center text-2xl font-bold tracking-tight">
          FreelTON
        </h1>
        <div className="mt-2 text-center text-sm text-white/70 space-y-1">
          <p>FreelTON is crypto freelance based on TON.</p>
          <p className="font-semibold text-[16px]">
            Freedom to Create. Assurance to Launch. Risk-Free
          </p>
          <a className="text-primary hover:underline" href="#">
            Learn more
          </a>
        </div>

        <div className="mt-6 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <Input
            placeholder="Search"
            className="h-11 rounded-xl bg-white/5 pl-10 text-white placeholder:text-white/50 border-white/10 focus-visible:ring-primary"
          />
        </div>

        <h2 className="mt-6 text-xs font-semibold uppercase tracking-wider text-white/60">
          My bots
        </h2>

        <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <Button
            asChild
            variant="ghost"
            className="h-9 rounded-lg px-2 text-primary hover:bg-primary/10"
          >
            <Link to="/offer/new">
              <Plus className="mr-2 size-4" /> Create a New Offer
            </Link>
          </Button>
        </div>

        <Separator className="my-4 bg-white/10" />
      </div>
    </div>
  );
}
