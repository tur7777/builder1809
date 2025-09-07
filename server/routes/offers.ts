import type { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

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
    const url = `${base.replace(/\/$/, "")}/v2/blockchain/info`;
    const key = process.env.TON_API_KEY;

    const headers: Record<string, string> = { Accept: "application/json" };
    if (key) {
      headers["Authorization"] = `Bearer ${key}`;
      headers["X-API-Key"] = key;
    }

    const r = await fetch(url, { headers });
    const contentType = r.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!r.ok) {
      const bodyText = await r.text().catch(() => "");
      return res.status(r.status).json({ ok: false, status: r.status, url, error: bodyText || "Upstream request failed" });
    }

    const data = isJson ? await r.json() : await r.text();
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
};
