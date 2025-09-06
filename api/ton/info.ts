export default async function handler(_req: any, res: any) {
  try {
    const base = process.env.TON_API_BASE || "https://tonapi.io"; // e.g. https://testnet.tonapi.io or TON Access endpoint
    const url = `${base.replace(/\/$/, "")}/v2/blockchain/info`;
    const key = process.env.TON_API_KEY;
    const r = await fetch(url, {
      headers: key
        ? {
            Authorization: `Bearer ${key}`,
            "X-API-Key": key,
          }
        : undefined,
    });
    const data = await r.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
