import { prisma } from "../server/lib/prisma";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    if (req.method === "GET") {
      const items = await prisma.offer.findMany({
        select: { id: true, title: true, description: true, budgetTON: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({ items });
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string"
          ? JSON.parse(req.body || "{}")
          : req.body || {};
      const { title, description = "", budgetTON } = body;
      if (!title || typeof budgetTON !== "number" || budgetTON < 0) {
        return res.status(400).json({ error: "Invalid payload" });
      }
      const created = await prisma.offer.create({
        data: { title, description, budgetTON, status: "open" },
      });
      return res.status(201).json(created);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || String(e) });
  }
}
