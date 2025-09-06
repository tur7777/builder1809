import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { createOffer, listOffers, tonChainInfo } from "./routes/offers";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Offers API
  app.get("/api/offers", listOffers);
  app.post("/api/offers", createOffer);

  // TON chain info proxy
  app.get("/api/ton/info", tonChainInfo);

  // Serve TonConnect manifest with CORS to satisfy wallets
  app.get("/tonconnect-manifest.json", async (_req, res) => {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const content = await fs.readFile(
        path.resolve(process.cwd(), "public/tonconnect-manifest.json"),
        "utf-8",
      );
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(content);
    } catch (e) {
      res.status(500).json({ error: "manifest read error" });
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
