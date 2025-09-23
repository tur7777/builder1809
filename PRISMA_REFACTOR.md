# Prisma Client Refactoring - Vercel Best Practices

This document outlines the refactoring changes made to optimize Prisma client usage for Vercel deployments.

## Changes Made

### 1. Centralized Prisma Client (`api/_prisma.ts`)

All API routes now import the Prisma client from a single centralized module:

```typescript
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const globalForPrisma = globalThis as unknown as {
  prisma?: InstanceType<typeof PrismaClient>;
};

export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
```

### 2. Updated API Routes

All API routes have been updated to:
- Import `prisma` from `api/_prisma.ts` instead of creating their own instances
- Use proper Next.js types (`NextApiRequest`, `NextApiResponse`)

**Files Updated:**
- `api/offers.ts`
- `api/offers/[id].ts`
- `api/admin/reset.ts`
- `api/users/upsert.ts`
- `api/orders.ts`
- `api/orders/[id].ts`
- `api/messages.ts`
- `api/ton/info.ts`
- `api/ton/manifest.ts`
- `api/icon.png.ts`

### 3. Type Safety Improvements

All handlers now use proper Next.js types:

```typescript
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // handler logic
}
```

## Benefits

### 1. Vercel Optimization
- **Single Prisma Instance**: Prevents connection pool exhaustion in serverless environments
- **Global Singleton Pattern**: Reuses the same client instance across function invocations
- **Connection Efficiency**: Reduces database connection overhead

### 2. Development Benefits
- **Development Mode Optimization**: In development, the client is stored in `globalThis` to persist across hot reloads
- **Production Mode**: Creates a new client instance for each deployment

### 3. Maintainability
- **Centralized Configuration**: All Prisma configuration is in one place
- **Type Safety**: Proper TypeScript types throughout the API layer
- **Consistency**: All routes follow the same pattern

## Best Practices Implemented

### 1. Singleton Pattern for Serverless
```typescript
// Global singleton to prevent multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma?: InstanceType<typeof PrismaClient>;
};

export const prisma = globalForPrisma.prisma || new PrismaClient();
```

### 2. Environment-Specific Behavior
```typescript
// Only store in global during development for hot reload support
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 3. Proper Type Usage
```typescript
import type { NextApiRequest, NextApiResponse } from "next";
// Ensures proper TypeScript checking and IntelliSense
```

## Verification

To verify the refactoring:

1. **No Direct Instantiation**: Search for `new PrismaClient()` - should only appear in `api/_prisma.ts`
2. **Centralized Imports**: All API routes import from `api/_prisma.ts`
3. **Type Safety**: All handlers use `NextApiRequest`/`NextApiResponse`
4. **Postinstall Script**: `package.json` includes `prisma generate` in postinstall

## Future Maintenance

When adding new API routes:
1. Import prisma: `import { prisma } from "./_prisma";` (or `"../_prisma"` for subdirectories)
2. Use proper types: `import type { NextApiRequest, NextApiResponse } from "next";`
3. Never create new PrismaClient instances directly in API routes

This ensures consistent, optimized database connectivity across all API endpoints.