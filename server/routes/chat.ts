import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma";

export const ensureSelfChat: RequestHandler = async (req, res) => {
  try {
    const address = String(
      req.body?.address || req.query?.address || "",
    ).trim();
    if (!address) return res.status(400).json({ error: "address_required" });

    // Try to find an existing self chat
    let order = await prisma.order.findFirst({
      where: { makerAddress: address, takerAddress: address },
      orderBy: { createdAt: "desc" },
    });

    if (!order) {
      order = await prisma.order.create({
        data: {
          title: "Favorites",
          makerAddress: address,
          takerAddress: address,
          priceTON: 0,
          nPercent: 0,
          makerDeposit: 0,
          takerStake: 0,
          status: "created",
        },
      });
    }

    res.json({ ok: true, order });
  } catch (e) {
    console.error("ensureSelfChat error:", e);
    res.status(500).json({ error: "internal_error" });
  }
};
