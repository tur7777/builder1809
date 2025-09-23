import { RequestHandler } from "express";
import { mockPrisma } from "../lib/mock-prisma";

// Use mock prisma for testing when real Prisma client can't be generated
const prisma = mockPrisma as any;

export const getOrders: RequestHandler = async (req, res) => {
  try {
    const {
      address = "",
      role = "any",
      status = "",
    } = req.query as any;
    const where: any = {};
    if (status) where.status = status;
    if (address) {
      if (role === "maker") where.makerAddress = String(address);
      else if (role === "taker") where.takerAddress = String(address);
      else
        where.OR = [
          { makerAddress: String(address) },
          { takerAddress: String(address) },
        ];
    }
    const items = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ items });
  } catch (e: any) {
    return res.status(500).json({ error: "internal_error" });
  }
};

export const createOrder: RequestHandler = async (req, res) => {
  try {
    const { title = "", makerAddress = "", priceTON, offerId = null } = req.body;
    const price = Number(priceTON);
    if (!title || !makerAddress || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ error: "invalid_payload" });
    }
    const makerDeposit = +(price * (1 + 1 / 100)).toFixed(9);
    const takerStake = +(price * 0.2).toFixed(9);
    // If creating a pre-chat thread for an offer, reuse existing 'created' order without taker
    if (offerId) {
      const existing = await prisma.order.findFirst({
        where: { offerId, status: "created" },
        orderBy: { createdAt: "desc" },
      });
      if (existing) return res.status(200).json(existing);
    }
    const created = await prisma.order.create({
      data: {
        title,
        makerAddress,
        priceTON: price,
        nPercent: 1,
        makerDeposit,
        takerStake,
        offerId,
      },
    });
    return res.status(201).json(created);
  } catch (e: any) {
    return res.status(500).json({ error: "internal_error" });
  }
};