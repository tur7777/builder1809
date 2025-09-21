import pkg from "@prisma/client";
import { DATABASE_URL } from "../config";

const { PrismaClient } = pkg;

let prismaClient: InstanceType<typeof PrismaClient>;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: InstanceType<typeof PrismaClient> | undefined;
}

if (process.env.NODE_ENV === "production") {
  prismaClient = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prismaClient = global.__prisma as InstanceType<typeof PrismaClient>;
}

export const prisma = prismaClient;
export default prismaClient;
