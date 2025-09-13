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

export const getUserByAddress: RequestHandler = async (req, res) => {
  const address = String(req.params.address || "").trim();
  if (!address) return res.status(400).json({ error: "address required" });
  try {
    const user = await prisma.user.findUnique({ where: { address } });
    if (!user) return res.status(404).json({ error: "user not found" });
    res.json({ ok: true, user });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
};

export const setNickname: RequestHandler = async (req, res) => {
  const address = String(req.body?.address || "").trim();
  const nickname = String(req.body?.nickname || "").trim();
  if (!address || !nickname)
    return res.status(400).json({ error: "address and nickname required" });
  try {
    // ensure user exists
    await prisma.user.upsert({ where: { address }, update: {}, create: { address } });
    const updated = await prisma.user.update({
      where: { address },
      data: { nickname },
    });
    res.json({ ok: true, user: updated });
  } catch (e: any) {
    if (String(e?.message || "").includes("Unique constraint")) {
      return res.status(409).json({ error: "nickname already taken" });
    }
    res.status(500).json({ error: e?.message || String(e) });
  }
};
