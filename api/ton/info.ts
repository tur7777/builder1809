export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const base = process.env.TON_API_BASE || "https://tonapi.io"; // e.g. https://testnet.tonapi.io or TON Access endpoint
    const url = `${base.replace(/\/$/, "")}/v2/blockchain/info`;
    const key = process.env.TON_API_KEY;

    const headers: Record<string, string> = { Accept: "application/json" };
    if (key) {
      headers["Authorization"] = `Bearer ${key}`;
      headers["X-API-Key"] = key;
    }

    const r = await fetch(url, { headers });

    const contentType = r.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!r.ok) {
      const bodyText = await r.text().catch(() => "");
      return res.status(r.status).json({ ok: false, status: r.status, url, error: bodyText || "Upstream request failed" });
    }

    const data = isJson ? await r.json() : await r.text();
    return res.status(200).json({ ok: true, data });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
