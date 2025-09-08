import type { RequestHandler } from "express";
import { getSupabaseServer } from "../lib/supabase";

export const upsertUser: RequestHandler = async (req, res) => {
  const address = String(req.body?.address || "").trim();
  if (!address) return res.status(400).json({ error: "address required" });
  const supabase = getSupabaseServer();
  if (!supabase) return res.status(200).json({ ok: true });
  const { data, error } = await supabase
    .from("users")
    .upsert({ address }, { onConflict: "address" })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, user: data });
};
