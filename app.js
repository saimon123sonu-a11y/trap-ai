const state={tab:"market",updated:new Date("2026-10-08T15:30:00+05:30")};

const marketData={
  nifty:{value:"22,231.80",move:"−1.64%",direction:"BEARISH",sentiment:"−7.2",confidence:"86%"},
  sensex:{value:"72,404.17",move:"−1.55%",direction:"BEARISH",sentiment:"−6.4",confidence:"81%"},
  bank:{value:"54,515.05",move:"−0.98%",direction:"BEARISH",sentiment:"−7.6",confidence:"88%"},
  vix:{value:"15.25",move:"+1.35%",direction:"VOLATILITY UP",sentiment:"—",confidence:"91%"}
};

/*
  UI contract:
  1) Global macro/crypto/FX intelligence is backend-only input.
  2) No breadth, market-rhythm or FII/DII cards on the decision page.
  3) No fake option contract, entry time or exit time when live chain/timing data is absent.
  4) Sentiment + AI Confidence are the only visible score-like fields.
*/
const stockPool=[
 {symbol:"ADANIGREEN",direction:"BEARISH",move:"−7.88%",sentiment:"−7.8",confidence:"82%",status:"WAIT FOR LIVE TRIGGER"},
 {symbol:"JUBLFOOD",direction:"BEARISH",move:"−7.16%",sentiment:"−7.2",confidence:"79%",status:"WAIT FOR LIVE TRIGGER"},
 {symbol:"INOXWIND",direction:"BEARISH",move:"−6.96%",sentiment:"−7.0",confidence:"77%",status:"WAIT FOR LIVE TRIGGER"},
 {symbol:"TIINDIA",direction:"BEARISH",move:"−6.16%",sentiment:"−6.4",confidence:"76%",status:"WAIT FOR LIVE TRIGGER"},
 {symbol:"ADANIENT",direction:"BEARISH",move:"−5.36%",sentiment:"−6.1",confidence:"80%",status:"WAIT FOR LIVE TRIGGER"},
 {symbol:"LICHSGFIN",direction:"BULLISH",move:"+4.19%",sentiment:"+7.1",confidence:"74%",status:"WAIT FOR LIVE TRIGGER"},
 {symbol:"ICICIGI",direction:"BULLISH",move:"+2.14%",sentiment:"+5.2",confidence:"72%",status:"WAIT FOR LIVE TRIGGER"},
 {symbol:"PNBHOUSING",direction:"BULLISH",move:"+1.68%",sentiment:"+4.6",confidence:"70%",status:"WAIT FOR LIVE TRIGGER"},
 {symbol:"SRF",direction:"BULLISH",move:"+1.02%",sentiment:"+3.4",confidence:"68%",status:"WAIT FOR LIVE TRIGGER"},
 {symbol:"MPHASIS",direction:"BULLISH",move:"+0.63%",sentiment:"+2.8",confidence:"66%",status:"WAIT FOR LIVE TRIGGER"},
 {symbol:"M&M",direction:"REVERSAL",move:"RSI 8.9",sentiment:"−8.2",confidence:"81%",status:"REVERSAL GATE REQUIRED"},
 {symbol:"BAJAJ-AUTO",direction:"REVERSAL",move:"RSI 9.5",sentiment:"−7.9",confidence:"78%",status:"REVERSAL GATE REQUIRED"},
 {symbol:"EICHERMOT",direction:"REVERSAL",move:"RSI 12.3",sentiment:"−7.1",confidence:"75%",status:"REVERSAL GATE REQUIRED"},
 {symbol:"ADANIENT",direction:"REVERSAL",move:"RSI ~22–31",sentiment:"−6.1",confidence:"75%",status:"REVERSAL GATE REQUIRED"},
 {symbol:"JSWSTEEL",direction:"REVERSAL",move:"RSI ~22–26",sentiment:"−6.4",confidence:"73%",status:"REVERSAL GATE REQUIRED"}
];

function scoreClass(v){return String(v).startsWith("+")?"bull":String(v).startsWith("−")?"bear":"neutral"}
function shell(){
 return `<header class="top">
  <div class="brand"><div><b>TRAP AI</b><br><small>AI Market Intelligence · Decision System</small><div class="status">● RESEARCH BUILD · LIVE BACKEND NOT CONNECTED</div></div><div class="mode"><span>NEXT-DAY ENGINE</span><b>SCAN → PRACTICE → POST</b></div></div>
  <nav class="nav">
   <button class="${state.tab==="market"?"active":""}" onclick="go('market')">1 · MARKET WATCH</button>
   <button class="${state.tab==="options"?"active":""}" onclick="go('options')">2 · STOCK OPTIONS</button>
   <button class="${state.tab==="stocks"?"active":""}" onclick="go('stocks')">3 · STOCK INFORMATION</button>
  </nav>
 </header>
 <main class="main"><div id="content"></div><div class="footer">EOD research snapshot: 08 Oct 2026. Live global feeds, option-chain data, intraday timing and historical option validation are not connected in this GitHub Pages build. No fabricated contract or trade time is displayed.</div></main>`;
}

function indexRow(label,d){
 return `<div class="market-row"><b>${label}</b><span>${d.value}</span><span class="${d.move.startsWith("+")?"bull":"bear"}">${d.move}</span><span>${d.direction}</span><span class="${scoreClass(d.sentiment)}">${d.sentiment}</span><span>${d.confidence}</span></div>`;
}

function market(){
 return `<section class="page-head"><div><div class="label">PAGE 1 · MARKET WATCH</div><h1>Market Watch</h1><p>Global context is analysed first; only the final India/index decision is shown here.</p></div><span class="live-badge">INDEX + BEST INDEX OPTION</span></section>

 <section class="card">
  <div class="table-title"><h2>Index decision table</h2><span class="pill">NO BREADTH · NO MARKET RHYTHM</span></div>
  <div class="market-table">
   <div class="market-row head"><b>INSTRUMENT</b><b>LEVEL</b><b>CHANGE</b><b>DIRECTION</b><b>SENTIMENT</b><b>AI CONF.</b></div>
   ${indexRow("NIFTY 50",marketData.nifty)}
   ${indexRow("SENSEX",marketData.sensex)}
   ${indexRow("BANK NIFTY",marketData.bank)}
   ${indexRow("INDIA VIX",marketData.vix)}
  </div>
 </section>

 <section class="card section">
  <div class="table-title"><h2>Best index option — engine output</h2><span class="pill">UNDERLYING → CONTRACT → TIMING</span></div>
  <div class="option-decision">
   <div><span>INDEX</span><strong>NIFTY</strong></div>
   <div><span>BEST OPTION</span><strong class="pending">PENDING LIVE CHAIN</strong></div>
   <div><span>EXPECTED ENTRY</span><strong class="pending">NOT CALCULATED</strong></div>
   <div><span>EXPECTED EXIT</span><strong class="pending">NOT CALCULATED</strong></div>
   <div><span>HOLDING</span><strong class="pending">NOT CALCULATED</strong></div>
  </div>
  <div class="notice section"><b>How the engine chooses it:</b> global risk regime → USD/INR → crude → BTC/ETH → world indices → yields/DXY → India VIX → NIFTY structure → RSI/divergence → OI/volume → option IV/Greeks → OI concentration + fresh activity → spread/depth → 5M trigger → historical validation. Highest OI alone never selects the contract.</div>
  <div class="decision-gate section"><b>Current display:</b> NO TRADE / NO CONTRACT POSTED because the live option chain and timestamp-safe timing engine are not connected. A value such as “NIFTY 22,200 PE, 09:42 entry” will only appear after those inputs are actually available.</div>
 </section>

 <section class="card section">
  <div class="table-title"><h2>Global intelligence layer</h2><span class="pill">BACKEND INPUTS</span></div>
  <div class="global-grid">
   <div><b>WORLD MARKETS</b><span>US · Europe · Asia</span></div>
   <div><b>COMMODITIES</b><span>Crude · Gold</span></div>
   <div><b>CRYPTO</b><span>BTC · ETH</span></div>
   <div><b>FX / RATES</b><span>USD · DXY · USD/INR · yields</span></div>
   <div><b>VOLATILITY</b><span>India VIX + expected move</span></div>
   <div><b>OUTPUT</b><span>30m · 3h · next-session regime</span></div>
  </div>
 </section>`;
}

function optionResearchRow(x){
 return `<div class="stock-option-row"><b>${x.symbol}</b><span class="${x.direction==="BULLISH"?"bull":"bear"}">${x.direction}</span><span class="${scoreClass(x.sentiment)}">${x.sentiment}</span><span>${x.confidence}</span><span class="pending">LIVE CHAIN</span><span class="pending">OI + ACTIVITY PENDING</span><span class="pending">TIMING PENDING</span></div>`;
}

function options(){
 return `<section class="page-head"><div><div class="label">PAGE 2 · STOCK OPTIONS</div><h1>Stock Options</h1><p>Research board: the engine finds the strongest underlying first, then selects the most active/liquid option contract.</p></div><span class="live-badge">RESEARCH ONLY</span></section>
 <section class="card">
  <div class="option-rules">
   <div><b>1</b><span>Underlying direction first</span></div><div><b>2</b><span>Highest-quality active option zone</span></div><div><b>3</b><span>OI + fresh activity + liquidity</span></div><div><b>4</b><span>IV + Greeks + expected move</span></div><div><b>5</b><span>Timing window calculated</span></div>
  </div>
  <div class="notice section"><b>Contract selection rule:</b> maximum OI by itself is not sufficient. TRAP AI ranks strikes using total OI, change in OI, volume, premium turnover, bid/ask spread, depth, delta, gamma, theta, vega, IV, expiry and proximity to the underlying. It then checks whether the activity agrees with the underlying thesis.</div>
  <div class="signal-section"><div class="table-title"><h2>15-stock option research pool</h2><span class="pill">NO ORDERS</span></div>
   <div class="stock-option-table">
    <div class="stock-option-row head"><b>STOCK</b><b>BIAS</b><b>SENTIMENT</b><b>AI CONF.</b><b>BEST OPTION</b><b>OI / ACTIVITY</b><b>ENTRY / EXIT</b></div>
    ${stockPool.map(optionResearchRow).join("")}
   </div>
  </div>
 </section>`;
}

function stockRow(x){
 return `<div class="stock-info-row"><b>${x.symbol}</b><span>${x.direction}</span><span>${x.move}</span><span class="${scoreClass(x.sentiment)}">${x.sentiment}</span><span>${x.confidence}</span><span class="pending">${x.status}</span></div>`;
}

function stocks(){
 return `<section class="page-head"><div><div class="label">PAGE 3 · STOCK INFORMATION</div><h1>Stock Information · Next-Day Plan</h1><p>150-stock scan → 15 candidates → practice/validation → only then publish the next-day plan.</p></div><span class="live-badge">VALIDATION GATE</span></section>

 <section class="card">
  <div class="summary-grid">
   <div><span>UNIVERSE</span><strong>150</strong><small>Liquid F&O working universe</small></div>
   <div><span>SHORTLIST</span><strong>15</strong><small>5 bearish + 5 bullish + 5 reversal</small></div>
   <div><span>VISIBLE OUTPUT</span><strong>SENTIMENT</strong><small>+ AI Confidence only</small></div>
   <div><span>POSTING RULE</span><strong>PRACTICE FIRST</strong><small>Never fabricate a next-day plan</small></div>
  </div>
 </section>

 <section class="card section">
  <div class="table-title"><h2>15-stock research pool</h2><span class="pill">NOT A BUY LIST</span></div>
  <div class="stock-info-table">
   <div class="stock-info-row head"><b>STOCK</b><b>BIAS</b><b>MOVE</b><b>SENTIMENT</b><b>AI CONF.</b><b>PLAN STATUS</b></div>
   ${stockPool.map(stockRow).join("")}
  </div>
 </section>

 <section class="card section">
  <div class="table-title"><h2>Validated next-day plan</h2><span class="pill">POST ONLY AFTER PRACTICE</span></div>
  <div class="plan-grid">
   <div><span>BEST STOCK</span><strong class="pending">NOT POSTED</strong></div>
   <div><span>BEST OPTION</span><strong class="pending">NOT POSTED</strong></div>
   <div><span>ENTRY WINDOW</span><strong class="pending">NOT POSTED</strong></div>
   <div><span>EXPECTED EXIT</span><strong class="pending">NOT POSTED</strong></div>
   <div><span>HOLDING</span><strong class="pending">NOT POSTED</strong></div>
   <div><span>AI CONFIDENCE</span><strong class="pending">NOT POSTED</strong></div>
  </div>
  <div class="notice section"><b>NO VALIDATED BUY PLAN POSTED.</b> The current Pages build has no connected historical option/OI/intraday backend, so it cannot honestly calculate a contract, entry time, exit time or next-day BUY/PUT/CALL. Once the backend is connected, this exact panel becomes the single next-day plan output.</div>
 </section>

 <section class="card section">
  <div class="table-title"><h2>Validation sequence</h2><span class="pill">ALL MUST PASS</span></div>
  <div class="validation-grid">
   <div><b>01 · GLOBAL REGIME</b><span>World indices, crude, BTC/ETH, USD/INR, DXY, yields and event risk.</span></div>
   <div><b>02 · MULTI-TIMEFRAME</b><span>1W → 1D → 3H → 1H → 15M → 5M.</span></div>
   <div><b>03 · RSI / DIVERGENCE</b><span>Continuation and reversal are kept separate.</span></div>
   <div><b>04 · OI / VOLUME</b><span>Fresh positioning must confirm the thesis.</span></div>
   <div><b>05 · OPTION ACTIVITY</b><span>Best active/liquid contract, not simply maximum OI.</span></div>
   <div><b>06 · TIMING MODEL</b><span>Forecast activation window and expected exit window.</span></div>
   <div><b>07 · HISTORICAL PRACTICE</b><span>Walk-forward, timestamp-safe, no look-ahead.</span></div>
   <div><b>08 · FINAL GATE</b><span>Trigger + liquidity + invalidation + acceptable risk.</span></div>
  </div>
 </section>`;
}

function render(){
 document.getElementById("app").innerHTML=shell();
 document.getElementById("content").innerHTML=({market,options,stocks}[state.tab])();
}
function go(t){state.tab=t;render()}
render();