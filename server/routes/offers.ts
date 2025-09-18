import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { TON_API_BASE, TON_API_KEY } from "../config";

export const getOfferById: RequestHandler = async (req, res) => {
  const id = String(req.params.id || "").trim();
  if (!id) return res.status(400).json({ error: "id required" });
  try {
    const offer = await prisma.offer.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        budgetTON: true,
        status: true,
        createdAt: true,
      },
    });
    if (!offer) return res.status(404).json({ error: "not found" });
    res.json({ offer });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
};

export const listOffers: RequestHandler = async (req, res) => {
  try {
    const qRaw = String((req.query?.q as string) || "").trim();
    const tokens = qRaw ? qRaw.split(/\s+/).filter(Boolean) : [];
    const where = tokens.length
      ? {
          AND: tokens.map((t) => ({
            OR: [
              { title: { contains: t, mode: "insensitive" as const } },
              { description: { contains: t, mode: "insensitive" as const } },
            ],
          })),
        }
      : undefined;

    const items = await prisma.offer.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        budgetTON: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ items });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
};

export const createOffer: RequestHandler = async (req, res) => {
  const { title, description = "", budgetTON } = req.body ?? {};
  if (!title || typeof budgetTON !== "number" || budgetTON < 0) {
    return res.status(400).json({ error: "Invalid payload" });
  }
  try {
    const created = await prisma.offer.create({
      data: { title, description, budgetTON, status: "open" },
    });
    res.status(201).json(created);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
};

export const tonChainInfo: RequestHandler = async (_req, res) => {
  try {
    const origin = TON_API_BASE.replace(/\/$/, "");
    const candidates = [
      `${origin}/v2/blockchain/info`,
      `${origin}/v2/blockchain/config`,
    ];

    const headers: Record<string, string> = { Accept: "application/json" };
    if (TON_API_KEY) {
      headers["Authorization"] = `Bearer ${TON_API_KEY}`;
      headers["X-API-Key"] = TON_API_KEY;
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
