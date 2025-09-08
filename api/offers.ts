import prismaPkg from "@prisma/client";
const { PrismaClient } = prismaPkg as any;

const globalForPrisma = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") (globalForPrisma.prisma = prisma);

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method === "GET") {
    const items = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ items });
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
    const offer = await prisma.offer.create({ data: { title, budgetTON } });
    return res.status(201).json(offer);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
