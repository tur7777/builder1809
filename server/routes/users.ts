import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma";

export const upsertUser: RequestHandler = async (req, res) => {
  const address = String(req.body?.address || "").trim();
  if (!address) return res.status(400).json({ error: "address required" });
  try {
    const user = await prisma.user.upsert({
      where: { address },
      update: {},
      create: { address },
    });
    res.json({ ok: true, user });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
};
