// Validates one-year public EOD history and computes reproducible research features for 10 instruments.
import { readFile } from "node:fs/promises";
const snapshot = JSON.parse(await readFile("data/latest.json", "utf8"));
const symbols = ["RELIANCE","SBIN","ITC","TCS","INFY","HDFCBANK","NTPC","TATASTEEL","BEL","SUNPHARMA"];
const reports = [];
for (const symbol of symbols) {
  const row = snapshot.symbols?.[symbol];
  if (!row || row.dataStatus !== "EOD_PUBLIC_HISTORY" || !Number.isFinite(row.price) || row.price <= 0) {
    throw new Error("Missing verified EOD price for research sample: " + symbol);
  }
  const history = (row.history || []).filter(x => x && Number.isFinite(x.close) && x.close > 0).sort((a,b)=>a.date.localeCompare(b.date));
  if (history.length < 100) throw new Error(symbol + " has only " + history.length + " daily bars; expected at least 100");
  const avg = n => history.slice(-n).reduce((s,x)=>s+x.close,0)/n;
  const ret = n => history.length > n ? (history.at(-1).close/history.at(-1-n).close-1)*100 : null;
  const sma20=avg(20), sma50=avg(50), r5=ret(5), r20=ret(20);
  if (![sma20,sma50,r5,r20].every(Number.isFinite)) throw new Error("Non-finite research feature for " + symbol);
  reports.push({symbol, bars:history.length, from:history[0].date, to:history.at(-1).date, close:row.price, sma20:Number(sma20.toFixed(2)), sma50:Number(sma50.toFixed(2)), return5dPct:Number(r5.toFixed(2)), return20dPct:Number(r20.toFixed(2)), trend:row.price>sma20&&row.price>sma50?"BULLISH":row.price<sma20&&row.price<sma50?"BEARISH":"MIXED"});
}
console.log(JSON.stringify({test:"TEN_INSTRUMENT_ONE_YEAR_RESEARCH_PASS",provider:snapshot.provider,generatedAt:snapshot.generatedAt,samples:reports},null,2));
