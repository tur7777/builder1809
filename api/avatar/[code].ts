export default async function handler(req: any, res: any) {
  try {
    const code = decodeURIComponent(String(req.query.code || "").trim());
    const size = Number(req.query.size || 180);
    const bg = String(req.query.bg || "#111827");
    const emoji = code || "😎";

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="${Math.round(size/6)}" fill="url(#g)" />
  <text x="50%" y="54%" font-size="${Math.round(size*0.6)}" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
</svg>`;

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.status(200).send(svg);
  } catch (e) {
    return res.status(500).end();
  }
}
