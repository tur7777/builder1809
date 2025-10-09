import pkg from "@prisma/client";

// Access PrismaClient in a way that works across different module interop setups
const PrismaClientCtor: any = (pkg as any).PrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma?: any;
};

export const prisma: any = globalForPrisma.prisma ?? new PrismaClientCtor();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
