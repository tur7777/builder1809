export const TON_API_BASE = (
  process.env.TON_API_BASE || "https://tonapi.io"
).replace(/\/$/, "");
export const TON_API_KEY = process.env.TON_API_KEY || "";
export const DATABASE_URL = process.env.DATABASE_URL || "";
