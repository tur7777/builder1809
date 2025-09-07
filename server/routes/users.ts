import type { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const upsertUser: RequestHandler = async (req, res) => {
  const address = String(req.body?.address || "").trim();
  if (!address) return res.status(400).json({ error: "address required" });
  const user = await prisma.user.upsert({
    where: { address },
    create: { address },
    update: {},
  });
  res.json({ ok: true, user });
};
