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

  return app;
}
