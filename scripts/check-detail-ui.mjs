import fs from "node:fs";
import assert from "node:assert/strict";

const html = fs.readFileSync("index.html", "utf8");
const js = fs.readFileSync("alpha.js", "utf8");
const css = fs.readFileSync("alpha.css", "utf8");

assert.equal((html.match(/data-view=/g) || []).length, 4, "the existing shell must retain exactly four tabs");
for (const label of ["Fast Market", "Stocks for Next Day", "Actionable", "Research"]) assert.ok(html.includes(label), "missing tab: " + label);
for (const marker of [
  'class="stock-row"', 'function openDetail(', 'function lineChart(', 'function flowProxy(',
  'function aiAnalysis(', 'function tradePlan(', 'function closeDetail(',
  'data-close-detail', 'Buyer pressure proxy', 'Seller pressure proxy',
  'verified option chain', 'Tentative entry timing', 'Expected holding period'
]) assert.ok(js.includes(marker), "missing detail-screen feature marker: " + marker);
assert.ok(css.includes(".detail-layer") && css.includes(".detail-drawer"), "detail drawer styles missing");
assert.ok(css.includes(".stock-row:hover"), "clickable stock affordance missing");
assert.ok(js.includes("not an intraday stop order"), "daily reference levels must not be presented as live order levels");
assert.ok(js.includes("does not reveal actual buyer/seller identities"), "flow proxy limitations must be disclosed");
assert.ok(js.includes("No contract is invented"), "missing option-chain data must not fabricate an option contract");
console.log(JSON.stringify({test:"FOUR_TAB_DETAIL_UI_STATIC_CHECK_PASS",tabs:4,features:["clickable rows","instrument detail drawer","historical chart","buyer/seller proxy","AI analysis point","conditional trade planner","explicit option/data limitations"]}));

assert.ok(js.includes("function lunarPhase("), "lunar phase must be calculated from a documented astronomical epoch");
assert.ok(js.includes("function lunarStudy("), "lunar full/new window comparison must use observed historical returns");
assert.ok(js.includes("function gannStudy("), "Gann-style price/time context must be computed from actual history");
assert.ok(js.includes("cycleAnalysis(record)"), "Research results must show lunar/Gann report");
assert.ok(js.includes("cycleAnalysis(r)"), "Clickable stock details must show lunar/Gann report");
assert.ok(js.includes("INSUFFICIENT SAMPLE"), "small lunar samples must not produce a trade signal");
assert.ok(js.includes("not established universally"), "lunar market effects must be clearly labeled unproven");
console.log("Lunar/Gann cycle-analysis regression checks passed.");

const collector = fs.readFileSync("scripts/refresh-market.mjs", "utf8");
assert.ok(collector.includes("function lunarCycleAgent("), "collector must compute historical lunar-cycle evidence");
assert.ok(collector.includes("slice(-10)"), "lunar analysis must cap observations to the latest ten cycles");
assert.ok(collector.includes("lunarAgent:lunar"), "lunar evidence must be included in the per-stock fusion inputs");
assert.ok(collector.includes("m.GOLD"), "cross-market fusion must consume gold context");
assert.ok(collector.includes("m.US10Y"), "cross-market fusion must consume US Treasury yield context");
assert.ok(collector.includes("(l.available?l.score:0)*.07"), "lunar evidence must remain a low-weight input");
console.log("Cross-market and last-ten lunar-cycle regression checks passed.");
