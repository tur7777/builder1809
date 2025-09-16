import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const globalForPrisma = globalThis as unknown as {
  prisma?: InstanceType<typeof PrismaClient>;
};
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
    let address = String(body.address || "").trim();
    // Basic guard: if address looks like raw wc:hex (e.g., 0:abcdef...), keep as-is; TonConnect usually provides base64url (UQ../EQ..)
    // If later you share a raw example, we can implement precise conversion to base64url.
    if (!address) return res.status(400).json({ error: "address required" });

    const EMOJIS = [
      "😎",
      "🚀",
      "🎯",
      "🔥",
      "🦄",
      "🧠",
      "💎",
      "🍀",
      "⚡",
      "🌈",
      "🐼",
      "🐳",
      "🦊",
      "🐸",
      "🐯",
      "��",
      "🐵",
      "🐱",
      "🐶",
      "🦁",
    ];
    const idx =
      Math.abs(
        Array.from(address).reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0),
      ) % EMOJIS.length;
    const emoji = EMOJIS[idx];
    const avatarUrl = `/api/avatar/${encodeURIComponent(emoji)}`;

    const user = await prisma.user.upsert({
      where: { address },
      update: { nickname: address, avatarUrl },
      create: { address, nickname: address, avatarUrl },
    });

    return res.status(200).json({ ok: true, user });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
