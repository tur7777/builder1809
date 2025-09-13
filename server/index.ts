import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { createOffer, listOffers, tonChainInfo } from "./routes/offers";
import { upsertUser } from "./routes/users";

import { PING_MESSAGE, TON_API_BASE } from "./config";
import { getUserByAddress, setNickname, upsertUser } from "./routes/users";
import { resetDatabase } from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: PING_MESSAGE });
  });

  app.get("/api/demo", handleDemo);

  // Users API
  app.post("/api/users/upsert", upsertUser);
  app.get("/api/users/:address", getUserByAddress);
  app.post("/api/users/set-nickname", setNickname);

  // Offers API
  app.get("/api/offers", listOffers);
  app.post("/api/offers", createOffer);

  // TON chain info proxy
  app.get("/api/ton/info", tonChainInfo);

  // Admin
  app.post("/api/admin/reset", resetDatabase);

  // Serve TonConnect manifest with CORS to satisfy wallets
  app.get("/tonconnect-manifest.json", async (req, res) => {
    try {
      const base = `${req.protocol}://${req.get("host")}`;
      const origin = base.replace(/\/$/, "");
      const tonServer = (TON_API_BASE || "").replace(/\/$/, "");

      const manifest = {
        manifestVersion: "1.1",
        url: base,
        name: "FreelTON",
        iconUrl: `${base}/placeholder.svg`,
        termsOfUseUrl: `${base}/terms`,
        privacyPolicyUrl: `${base}/privacy`,
        ton: {
          default: {
            name: "TON",
            description: "TON blockchain",
            servers: [{ name: "tonapi", url: tonServer }],
          },
        },
      };
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.json(manifest);
    } catch (e) {
      res.status(500).json({ error: "manifest build error" });
    }
  });

  // Serve placeholder icon with CORS
  app.get("/placeholder.svg", async (_req, res) => {
    try {
      const path = await import("path");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.sendFile(path.resolve(process.cwd(), "public/placeholder.svg"));
    } catch (e) {
      res.status(404).end();
    }
  });

  return app;
}
