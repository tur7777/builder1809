import { mockPrisma } from "./mock-prisma";

// Use mock prisma for testing when real Prisma client can't be generated
export const prisma = mockPrisma as any;
export default prisma;
