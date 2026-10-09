// Public EOD fallback for Alpha Trap.
// This is deliberately an end-of-day baseline only. It must never be presented as intraday data.
import { mkdir, readFile, writeFile } from "node:fs/promises";

const STOCKS = [
  "RELIANCE","HDFCBANK","ICICIBANK","SBIN","AXISBANK","KOTAKBANK","INDUSINDBK","BAJFINANCE","BAJAJFINSV","SHRIRAMFIN",
  "INFY","TCS","HCLTECH","WIPRO","TECHM","LT","BHARTIARTL","ITC","HINDUNILVR","NESTLEIND",
  "TATAMOTORS","MARUTI","M&M","EICHERMOT","BAJAJ-AUTO","TITAN","TRENT","ADANIENT","ADANIPORTS","ADANIGREEN",
  "NTPC","POWERGRID","ONGC","COALINDIA","TATASTEEL","JSWSTEEL","HINDALCO","SUNPHARMA","CIPLA","DRREDDY",
  "BEL","BHEL","HAL","DLF","LTIM","APOLLOHOSP","MAXHEALTH","SBILIFE","HDFCLIFE","TATACONSUM"
];
const CORE = ["NIFTY","BANKNIFTY","SENSEX","INDIAVIX","BTC","USDINR","DXY","US10Y","BRENT","GOLD","SPX","NDX"];
const UA = "Alpha-Trap-public-EOD-fallback/1.0";

async function getHistory(symbol) {
  const url = "https://api.tejhq.dev/v1/ohlcv/nse/" + encodeURIComponent(symbol) +
    "?from=" + new Date(Date.now() - 150 * 86400000).toISOString().slice(0,10) +
    "&to=" + new Date().toISOString().slice(0,10);
  const response = await fetch(url, {headers: {"Accept":"application/json","User-Agent":UA}, signal: AbortSignal.timeout(12000)});
  if (!response.ok) throw new Error("TejHQ HTTP " + response.status);
  const body = await response.json();
  const rows = Array.isArray(body) ? body : (Array.isArray(body?.data) ? body.data : null);
  if (!rows) throw new Error("Unexpected TejHQ response schema");
  return rows.map(r => ({
    date: String(r.date || r.session_date || ""),
    open: Number(r.open), high: Number(r.high), low: Number(r.low), close: Number(r.close),
    volume: Number(r.volume)
  })).filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r.date) &&
    [r.open,r.high,r.low,r.close,r.volume].every(Number.isFinite) &&
    r.open > 0 && r.high > 0 && r.low > 0 && r.close > 0 && r.volume >= 0 &&
    r.high >= Math.max(r.open,r.close,r.low) && r.low <= Math.min(r.open,r.close,r.high))
    .sort((a,b)=>a.date.localeCompare(b.date));
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length); let next = 0;
  async function worker() {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      try { out[i] = await fn(items[i]); }
      catch (e) { console.error(JSON.stringify({symbol:items[i],provider:"TejHQ EOD",status:"FETCH_FAILED",error:String(e?.message||e).slice(0,160)})); out[i] = null; }
    }
  }
  await Promise.all(Array.from({length:Math.min(limit,items.length)},worker));
  return out;
}

const generatedAt = new Date().toISOString();
const rows = await mapLimit(STOCKS, 5, async symbol => {
  const history = await getHistory(symbol);
  if (history.length < 2) throw new Error("Fewer than two valid EOD candles");
  const last = history.at(-1), previous = history.at(-2);
  const changePct = (last.close / previous.close - 1) * 100;
  // NSE session close 15:30 IST == 10:00 UTC. Timestamp is the session close, not fetch time.
  const asOf = new Date(last.date + "T10:00:00.000Z").toISOString();
  return [symbol, {
    symbol, assetClass:"INDIA F&O / EQUITY", dataStatus:"EOD_PUBLIC_HISTORY",
    provider:"TejHQ public NSE EOD OHLCV (exchange-derived bhavcopy)",
    sourceNote:"End-of-day historical data only; not an intraday feed. Live signals disabled.",
    asOf, price:last.close, open:last.open, high:last.high, low:last.low, volume:last.volume,
    changePct, dayChange:changePct,
    eodHistoryRows:history.length, historyStart:history[0].date, historyEnd:last.date,
    intradayAvailable:false, liveSignalEligible:false
  }];
});
const symbols = Object.fromEntries(rows.filter(Boolean).flat());
const valid = Object.values(symbols).filter(r => Number.isFinite(r.price) && r.price > 0 && r.asOf).length;
const minimumValid = 20;
if (valid < minimumValid) {
  console.error(JSON.stringify({refreshStatus:"EOD_FALLBACK_ABORTED",generatedAt,validSymbols:valid,minimumValid,totalRequested:STOCKS.length}));
  throw new Error("EOD fallback refused to publish: insufficient validated rows");
}
for (const symbol of CORE) symbols[symbol] = {
  symbol, dataStatus:"DATA_UNAVAILABLE", price:null, asOf:null,
  sourceNote:"No validated public source available in this run; no substitute value generated."
};
let previousGeneratedAt = null;
try { previousGeneratedAt = JSON.parse(await readFile("data/latest.json","utf8")).generatedAt || null; } catch {}
const snapshot = {
  generatedAt, provider:"TejHQ public EOD fallback", refreshStatus:"EOD_BASELINE_ONLY",
  liveSignalsEnabled:false, intradayAvailable:false, symbols, news:[],
  coverage:{requestedStocks:STOCKS.length,validEodStocks:valid,unavailableStocks:STOCKS.length-valid,coreInstruments:CORE.length},
  previousGeneratedAt,
  limitations:["End-of-day data only; not suitable for intraday triggers.","No verified option-chain, OI, PCR, IV, Greeks or crowding feed.","No live BUY/SELL signals are emitted by this fallback."]
};
await mkdir("data",{recursive:true});
await writeFile("data/latest.json", JSON.stringify(snapshot,null,2)+"\n","utf8");
console.log(JSON.stringify({refreshStatus:"EOD_FALLBACK_SUCCESS",generatedAt,validSymbols:valid,minimumValid,totalRequested:STOCKS.length,provider:"TejHQ public EOD OHLCV",liveSignalsEnabled:false}));
