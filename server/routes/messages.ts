
import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma";

export const listMessages: RequestHandler = async (req, res) => {
  try {
    const orderId = String((req.query as any)?.orderId || "").trim();

import { RequestHandler } from "express";
import { mockPrisma } from "../lib/mock-prisma";

// Use mock prisma for testing when real Prisma client can't be generated
const prisma = mockPrisma as any;

export const getMessages: RequestHandler = async (req, res) => {
  try {
    const orderId = String(req.query?.orderId || "");

    if (!orderId) return res.status(400).json({ error: "orderId_required" });
    const items = await prisma.message.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
    });

    res.json({ items });
  } catch (e) {
    console.error("listMessages error:", e);
    res.status(500).json({ error: "internal_error" });

    return res.status(200).json({ items });
  } catch (e) {
    return res.status(500).json({ error: "internal_error" });

  }
};

export const createMessage: RequestHandler = async (req, res) => {
  try {

    const { orderId = "", sender = "", text = "" } = req.body ?? {};

    const { orderId = "", sender = "", text = "" } = req.body;

    if (!orderId || !sender || !text)
      return res.status(400).json({ error: "invalid_payload" });
    const created = await prisma.message.create({
      data: { orderId, sender, text },
    });

    res.status(201).json(created);
  } catch (e) {
    console.error("createMessage error:", e);
    res.status(500).json({ error: "internal_error" });
  }
};

    return res.status(201).json(created);
  } catch (e) {
    return res.status(500).json({ error: "internal_error" });
  }
};

