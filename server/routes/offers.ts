import type { RequestHandler } from "express";
import prismaPkg from "@prisma/client";
const { PrismaClient } = prismaPkg as any;

const prisma = new PrismaClient();

export const listOffers: RequestHandler = async (_req, res) => {
  const items = await prisma.offer.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ items });
};

export const createOffer: RequestHandler = async (req, res) => {
  const { title, budgetTON } = req.body ?? {};
  if (!title || typeof budgetTON !== "number" || budgetTON < 0) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const offer = await prisma.offer.create({ data: { title, budgetTON } });
  res.status(201).json(offer);
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
