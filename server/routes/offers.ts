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
