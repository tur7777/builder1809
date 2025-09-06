import type { RequestHandler } from "express";

export type Offer = {
  id: string;
  title: string;
  budgetTON: number;
  status: "open" | "taken" | "done";
  createdAt: string;
};

const offers: Offer[] = [];

export const listOffers: RequestHandler = (_req, res) => {
  res.json({ items: offers });
};

export const createOffer: RequestHandler = (req, res) => {
  const { title, budgetTON } = req.body ?? {};
  if (!title || typeof budgetTON !== "number" || budgetTON < 0) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const offer: Offer = {
    id: Math.random().toString(36).slice(2),
    title,
    budgetTON,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  offers.unshift(offer);
  res.status(201).json(offer);
};

export const tonChainInfo: RequestHandler = async (_req, res) => {
  try {
    const base = process.env.TON_API_BASE || "https://tonapi.io"; // allow testnet or TON Access
    const url = `${base.replace(/\/$/, "")}/v2/blockchain/info`;
    const key = process.env.TON_API_KEY;
    const r = await fetch(url, {
      headers: key
        ? { Authorization: `Bearer ${key}`, "X-API-Key": key }
        : undefined,
    });
    const data = await r.json();
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
};
