import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useWalletAddress } from "@/hooks/useTon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  sender: string;
  text: string;
  createdAt: string;
}

export default function ChatRoom() {
  const { id } = useParams<{ id: string }>();
  const me = useWalletAddress();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/messages?orderId=${encodeURIComponent(id)}`);
      const j = await r.json();
      setMessages(
        (j.items || []).map((m: any) => ({
          id: String(m.id),
          sender: String(m.sender),
          text: String(m.text),
          createdAt: String(m.createdAt),
        })),
      );
    } finally {
      setLoading(false);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    }
  }

  useEffect(() => {
    let tm: any;
    load();
    tm = setInterval(load, 4000);
    return () => clearInterval(tm);
  }, [id]);

  async function send() {
    if (!id || !me || !text.trim()) return;
    const payload = { orderId: id, sender: me, text };
    setText("");
    await fetch(`/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  }

  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto flex h-[calc(100vh-100px)] w-full max-w-2xl flex-col px-4 py-6">
        <div className="mb-3 text-lg font-semibold">Chat</div>
        <div className="flex-1 space-y-2 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-3">
          {loading && <div className="text-white/70">Loading…</div>}
          {!loading && messages.length === 0 && (
            <div className="text-white/70">No messages yet.</div>
          )}
          {messages.map((m) => {
            const mine = me && m.sender && me === m.sender;
            return (
              <div key={m.id} className={mine ? "text-right" : "text-left"}>
                <div className="inline-block max-w-[85%] rounded-lg bg-white/10 px-3 py-2 text-sm">
                  <div className="opacity-70 text-[11px]">
                    {mine ? "You" : m.sender.slice(0, 6) + "…"}
                  </div>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message…"
            className="bg-white/5 text-white border-white/10"
          />
          <Button onClick={send} className="bg-primary text-primary-foreground">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
