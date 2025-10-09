import pkg from "@prisma/client";
import { mockPrisma } from "../server/lib/mock-prisma";

// Safe access to PrismaClient across CJS/ESM interop
const PrismaClientCtor: any = (pkg as any)?.PrismaClient;

function shouldUseMock() {
  const url = process.env.DATABASE_URL || "";
  // Likely invalid Postgres host (Prisma Data Proxy/Accelerate style not supported by direct driver here)
  if (/db\.prisma\.io/i.test(url)) return true;
  if (!PrismaClientCtor) return true;
  return false;
}

let client: any;
if (shouldUseMock()) {
  client = mockPrisma;
} else {
  try {
    client = new PrismaClientCtor();
  } catch (_e) {
    client = mockPrisma;
  }
}

export const prisma: any = client;
export default prisma;
