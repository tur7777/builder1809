import type { RequestHandler } from "express";
import { getSupabaseServer } from "../lib/supabase";

export const listOffers: RequestHandler = async (_req, res) => {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("offers")
    .select("id,title,budgetTON,status,createdAt")
    .order("createdAt", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ items: data || [] });
};

export const createOffer: RequestHandler = async (req, res) => {
  const { title, budgetTON } = req.body ?? {};
  if (!title || typeof budgetTON !== "number" || budgetTON < 0) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const supabase = getSupabaseServer();
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
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

export const tonChainInfo: RequestHandler = async (_req, res) => {
  try {
    const base = process.env.TON_API_BASE || "https://tonapi.io"; // allow testnet or TON Access
    const origin = base.replace(/\/$/, "");
    const candidates = [
      `${origin}/v2/blockchain/info`,
      `${origin}/v2/blockchain/config`,
    ];
    const key = process.env.TON_API_KEY;

    const headers: Record<string, string> = { Accept: "application/json" };
    if (key) {
      headers["Authorization"] = `Bearer ${key}`;
      headers["X-API-Key"] = key;
    }

    for (const url of candidates) {
      try {
        const r = await fetch(url, { headers });
        const contentType = r.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");
        if (!r.ok) continue;
        const data = isJson ? await r.json() : await r.text();
        return res.json({ ok: true, data, url });
      } catch (_) {
        // try next
      }
    }

    return res
      .status(502)
      .json({ ok: false, error: "All TON API candidates failed", candidates });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
};
