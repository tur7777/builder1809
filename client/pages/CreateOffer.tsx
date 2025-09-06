import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CreateOffer() {
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("0.1");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, budgetTON: Number(budget) }),
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      navigate("/take");
    } catch (e) {
      console.error(e);
      alert("Failed to create offer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(217,33%,9%)] text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold">Create a New Offer</h1>
        <p className="mt-2 text-white/70">Define the title and budget in TON. Escrow and on-chain actions подключим позже.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/70">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Landing page design" className="bg-white/5 text-white border-white/10" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/70">Budget (TON)</label>
            <Input type="number" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)} className="bg-white/5 text-white border-white/10" />
          </div>
          <Button onClick={submit} disabled={loading || !title} className="bg-primary text-primary-foreground">
            {loading ? "Creating..." : "Create Offer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
