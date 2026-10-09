import fs from "node:fs";
import assert from "node:assert/strict";

const html = fs.readFileSync("index.html", "utf8");
const js = fs.readFileSync("alpha.js", "utf8");
const css = fs.readFileSync("alpha.css", "utf8");

assert.equal((html.match(/data-view=/g) || []).length, 4, "the existing shell must retain exactly four tabs");
for (const label of ["Fast Market", "Stocks for Next Day", "Actionable", "Research"]) assert.ok(html.includes(label), "missing tab: " + label);
for (const marker of [
  'class="stock-row"', 'function openDetail(', 'function lineChart(', 'function flowProxy(',
  'function aiAnalysis(', 'confidenceIndex', 'rsi20', 'macdHist', 'crowdingPct', 'openDetail(state.researchResult.record.symbol', 'function tradePlan(', 'function closeDetail(',
  'data-close-detail', 'Buyer pressure proxy', 'Seller pressure proxy',
  'verified option chain', 'Tentative entry timing', 'Expected holding period'
]) assert.ok(js.includes(marker), "missing detail-screen feature marker: " + marker);
assert.ok(css.includes(".detail-layer") && css.includes(".detail-drawer"), "detail drawer styles missing");
assert.ok(css.includes(".stock-row:hover"), "clickable stock affordance missing");
assert.ok(js.includes("not an intraday stop order"), "daily reference levels must not be presented as live order levels");
assert.ok(js.includes("does not reveal actual buyer/seller identities"), "flow proxy limitations must be disclosed");
assert.ok(js.includes("No contract is invented"), "missing option-chain data must not fabricate an option contract");
console.log(JSON.stringify({test:"FOUR_TAB_DETAIL_UI_STATIC_CHECK_PASS",tabs:4,features:["clickable rows","instrument detail drawer","historical chart","buyer/seller proxy","AI analysis point","conditional trade planner","explicit option/data limitations"]}));
