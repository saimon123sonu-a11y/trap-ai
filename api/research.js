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

  const target = "https://query1.finance.yahoo.com/" + raw;
  const headers = {
    "Accept": "application/json,text/plain",
    "User-Agent": "TRAP-AI/1.1 research backend",
    "Cache-Control": "no-cache"
  };
  // Current production runner evidence shows Yahoo direct returns HTTP 429,
  // while AllOrigins can return valid chart JSON. Prefer the working transport.
  const candidates = [
    {url:"https://api.allorigins.win/raw?url="+encodeURIComponent(target), parse:"json"},
    {url:"https://r.jina.ai/"+target, parse:"jina"},
    {url:target, parse:"json"}
  ];
  let lastError = null;
  for (const candidate of candidates) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    try {
      const r = await fetch(candidate.url, {headers, signal:controller.signal});
      if (!r.ok) {
        lastError = new Error("HTTP "+r.status);
        continue;
      }
      const text = await r.text();
      let body = text;
      if (candidate.parse === "jina") {
        const first = text.indexOf("{");
        const last = text.lastIndexOf("}");
        if (first < 0 || last <= first) throw new Error("Jina returned non-JSON content");
        body = text.slice(first,last+1);
      } else {
        JSON.parse(text); // validate before returning
      }
      res.status(200);
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "public, s-maxage=20, stale-while-revalidate=40");
      return res.send(body);
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
  }
  return res.status(502).json({
    error:"All public market-data transports failed",
    detail:String(lastError?.message || lastError || "unknown upstream error")
  });
}
