import { getSupabaseServer } from "../server/lib/supabase";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const supabase = getSupabaseServer();

    if (req.method === "GET") {
      if (!supabase) return res.status(200).json({ items: [] });
      const { data, error } = await supabase
        .from("offers")
        .select("id,title,budgetTON,status,createdAt")
        .order("createdAt", { ascending: false });
      if (error) throw error;
      return res.status(200).json({ items: data || [] });
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string"
          ? JSON.parse(req.body || "{}")
          : req.body || {};
      const { title, budgetTON } = body;
      if (!title || typeof budgetTON !== "number" || budgetTON < 0) {
        return res.status(400).json({ error: "Invalid payload" });
      }
      if (!supabase)
        return res
          .status(501)
          .json({ error: "Supabase not configured on server" });
      const { data, error } = await supabase
        .from("offers")
        .insert({
          title,
          budgetTON,
          status: "open",
          createdAt: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || String(e) });
  }
}
