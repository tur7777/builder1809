export default async function handler(req: any, res: any) {
  try {
    const proto = (
      req.headers["x-forwarded-proto"] ||
      req.protocol ||
      "https"
    ).toString();
    const host = (
      req.headers["x-forwarded-host"] ||
      req.headers.host ||
      ""
    ).toString();
    const base = host ? `${proto}://${host}` : "";
    const url = base || process.env.PUBLIC_BASE_URL || "";

    const manifest = {
      manifestVersion: "1.1",
      url,
      name: "FreelTON",
      iconUrl: `${url}/api/icon.png`,
      termsOfUseUrl: `${url}/terms`,
      privacyPolicyUrl: `${url}/privacy`,
      ton: {
        default: {
          name: "TON",
          description: "TON blockchain",
          servers: [
            {
              name: "tonapi",
              url: (process.env.TON_API_BASE || "https://tonapi.io").replace(
                /\/$/,
                "",
              ),
            },
          ],
        },
      },
    };

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(manifest);
  } catch (e) {
    return res.status(500).json({ error: "manifest build error" });
  }
}
