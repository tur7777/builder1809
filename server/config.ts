export const DATABASE_URL = process.env.DATABASE_URL || "";
export const TON_API_BASE = process.env.TON_API_BASE || "https://tonapi.io";
export const TON_API_KEY = process.env.TON_API_KEY || "";
export const PING_MESSAGE = process.env.PING_MESSAGE ?? "ping";
export const PORT = Number(process.env.PORT || 3000);
export const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

export default {
  DATABASE_URL,
  TON_API_BASE,
  TON_API_KEY,
  PING_MESSAGE,
  PORT,
  ADMIN_SECRET,
};
