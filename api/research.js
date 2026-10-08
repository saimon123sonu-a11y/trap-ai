// TRAP AI research proxy for Vercel.
// Keeps market-data requests server-side so the browser is not blocked by provider CORS.
// This is a transport layer only; TRAP scoring remains in the application engine.
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({error:"GET only"});

  const raw = String(req.query?.path || "");
  if (!raw || raw.length > 500) return res.status(400).json({error:"Missing path"});

  const allowed = [
    /^v8\/finance\/chart\/[A-Za-z0-9%._^=-]+\?/,
    /^v7\/finance\/options\/[A-Za-z0-9%._^=-]+(?:\?|$)/,
    /^v1\/finance\/search\?/
  ];
  if (!allowed.some(rx => rx.test(raw))) {
    return res.status(400).json({error:"Unsupported market-data route"});
  }

  const url = "https://query1.finance.yahoo.com/" + raw;
  try {
    const r = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "TRAP-AI/1.0 research backend"
      }
    });
    const body = await r.text();
    res.status(r.status);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.send(body);
  } catch (err) {
    return res.status(502).json({error:"Upstream market-data request failed",detail:String(err?.message || err)});
  }
}
