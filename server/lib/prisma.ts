import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "../config";

let prismaClient: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prismaClient = global.__prisma;
}

export const prisma = prismaClient;
export default prismaClient;
