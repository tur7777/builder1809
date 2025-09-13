import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { ADMIN_SECRET } from "../config";

export const resetDatabase: RequestHandler = async (req, res) => {
  const provided = String(req.headers["x-admin-secret"] || req.query.secret || "");
  if (!ADMIN_SECRET || provided !== ADMIN_SECRET) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    await prisma.$transaction([
      prisma.review.deleteMany({}),
      prisma.job.deleteMany({}),
      prisma.offer.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
};
