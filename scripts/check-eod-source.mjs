// One-request smoke test for the keyless public TejHQ NSE EOD endpoint.
const from = new Date(Date.now() - 45 * 86400000).toISOString().slice(0,10);
const to = new Date().toISOString().slice(0,10);
const url = `https://api.tejhq.dev/v1/ohlcv/nse/RELIANCE?from=${from}&to=${to}`;
const response = await fetch(url, {
  headers: {"Accept":"application/json","User-Agent":"Alpha-Trap-public-source-check/1.0"},
  signal: AbortSignal.timeout(12000)
});
if (!response.ok) throw new Error(`TejHQ returned HTTP ${response.status}`);
const body = await response.json();
const rows = Array.isArray(body) ? body : (Array.isArray(body?.data) ? body.data : null);
if (!rows || rows.length < 2) throw new Error("Unexpected or insufficient EOD response rows");
const valid = rows.filter(r =>
  /^\d{4}-\d{2}-\d{2}$/.test(String(r.date || "")) &&
  [r.open,r.high,r.low,r.close,r.volume].every(v => Number.isFinite(Number(v))) &&
  Number(r.close) > 0 && Number(r.high) >= Number(r.low)
);
if (valid.length < 2) throw new Error("No valid OHLCV rows in EOD response");
console.log(JSON.stringify({
  smokeTest:"PASS",provider:"TejHQ public NSE EOD OHLCV",symbol:"RELIANCE",
  validRows:valid.length,firstDate:valid[0].date,lastDate:valid.at(-1).date,
  latestClose:Number(valid.at(-1).close),intraday:false
}));
