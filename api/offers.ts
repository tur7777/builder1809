import type { VercelRequest, VercelResponse } from "@vercel/node";

let offers: {
  id: string;
  title: string;
  budgetTON: number;
  status: "open" | "taken" | "done";
  createdAt: string;
}[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method === "GET") {
    return res.status(200).json({ items: offers });
  }

  if (req.method === "POST") {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
    const { title, budgetTON } = body;
    if (!title || typeof budgetTON !== "number" || budgetTON < 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    const offer = {
      id: Math.random().toString(36).slice(2),
      title,
      budgetTON,
      status: "open" as const,
      createdAt: new Date().toISOString(),
    };
    offers.unshift(offer);
    return res.status(201).json(offer);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
