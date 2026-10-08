const state={tab:"market",updated:new Date("2026-10-08T15:30:00+05:30")};

const marketData={
  nifty:{value:"22,231.80",move:"−1.64%"},
  sensex:{value:"72,404.17",move:"−1.55%"},
  bank:{value:"54,515.05",move:"−0.98%"},
  vix:{value:"15.25",move:"+1.35"},
  fii:"−₹12,944 Cr",dii:"+₹10,703 Cr",
  breadth:"11 up / 203 down",pcr:"0.90",
  regime:"BEARISH · VOLATILITY EXPANSION"
};

const selected=[
 {rank:1,symbol:"ADANIGREEN",direction:"BEARISH",move:"−7.88%",sentiment:-7.8,confidence:82,signal:"WAIT → PUT IF BREAKDOWN"},
 {rank:2,symbol:"JUBLFOOD",direction:"BEARISH",move:"−7.16%",sentiment:-7.2,confidence:79,signal:"PUT WATCH"},
 {rank:3,symbol:"INOXWIND",direction:"BEARISH",move:"−6.96%",sentiment:-7.0,confidence:77,signal:"PUT WATCH"},
 {rank:4,symbol:"TIINDIA",direction:"BEARISH",move:"−6.16%",sentiment:-6.4,confidence:76,signal:"PUT WATCH"},
 {rank:5,symbol:"ADANIENT",direction:"BEARISH",move:"−5.36%",sentiment:-6.1,confidence:80,signal:"PUT WATCH"},
 {rank:1,symbol:"LICHSGFIN",direction:"BULLISH",move:"+4.19%",sentiment:7.1,confidence:74,signal:"CALL WATCH"},
 {rank:2,symbol:"ICICIGI",direction:"BULLISH",move:"+2.14%",sentiment:5.2,confidence:72,signal:"CALL WATCH"},
 {rank:3,symbol:"PNBHOUSING",direction:"BULLISH",move:"+1.68%",sentiment:4.6,confidence:70,signal:"CALL WATCH"},
 {rank:4,symbol:"SRF",direction:"BULLISH",move:"+1.02%",sentiment:3.4,confidence:68,signal:"CALL WATCH"},
 {rank:5,symbol:"MPHASIS",direction:"BULLISH",move:"+0.63%",sentiment:2.8,confidence:66,signal:"CALL WATCH"},
 {rank:1,symbol:"M&M",direction:"REVERSAL",move:"RSI 8.9",sentiment:-8.2,confidence:81,signal:"REVERSAL WATCH"},
 {rank:2,symbol:"BAJAJ-AUTO",direction:"REVERSAL",move:"RSI 9.5",sentiment:-7.9,confidence:78,signal:"REVERSAL WATCH"},
 {rank:3,symbol:"EICHERMOT",direction:"REVERSAL",move:"RSI 12.3",sentiment:-7.1,confidence:75,signal:"REVERSAL WATCH"},
 {rank:4,symbol:"ADANIENT",direction:"REVERSAL",move:"RSI ~22–31",sentiment:-6.1,confidence:75,signal:"REVERSAL WATCH"},
 {rank:5,symbol:"JSWSTEEL",direction:"REVERSAL",move:"RSI ~22–26",sentiment:-6.4,confidence:73,signal:"REVERSAL WATCH"}
];

const validatedNextDay=[];

function shell(){
 return `<header class="top">
  <div class="brand"><div><b>TRAP AI</b><br><small>AI Market Intelligence · Decision System</small><div class="status">● RESEARCH ENGINE · LIVE BACKEND NOT CONNECTED</div></div><div style="text-align:right"><div class="label">NEXT-DAY MODE</div><b>VALIDATE → POST</b></div></div>
  <nav class="nav">
   <button class="${state.tab==="market"?"active":""}" onclick="go('market')">1 · MARKET WATCH</button>
   <button class="${state.tab==="options"?"active":""}" onclick="go('options')">2 · STOCK OPTIONS</button>
   <button class="${state.tab==="stocks"?"active":""}" onclick="go('stocks')">3 · STOCK INFORMATION</button>
  </nav>
 </header>
 <main class="main"><div id="content"></div><div class="footer">Research snapshot: 08 Oct 2026 EOD. Next-day BUY/PUT/CALL plans are posted only after timestamp-safe historical validation and live confirmation. No fabricated live signal.</div></main>`;
}

function market(){
 return `<section class="market-head"><div><div class="label">PAGE 1 · MARKET WATCH</div><h1>Market Watch</h1></div><span class="live-badge">INDEX + BEST INDEX OPTION</span></section>
 <div class="index-strip">
  <div class="index-card"><span>NIFTY 50</span><strong>${marketData.nifty.value}</strong><em class="bear">${marketData.nifty.move}</em></div>
  <div class="index-card"><span>SENSEX</span><strong>${marketData.sensex.value}</strong><em class="bear">${marketData.sensex.move}</em></div>
  <div class="index-card"><span>BANK NIFTY</span><strong>${marketData.bank.value}</strong><em class="bear">${marketData.bank.move}</em></div>
  <div class="index-card"><span>INDIA VIX</span><strong>${marketData.vix.value}</strong><em>${marketData.vix.move}</em></div>
 </div>
 <section class="card"><div class="signal"><div><div class="label">MARKET REGIME</div><h2>${marketData.regime}</h2></div><span class="pill">EOD CONTEXT</span></div>
  <div class="grid"><div class="card metric"><span>FII</span><strong>${marketData.fii}</strong></div><div class="card metric"><span>DII</span><strong>${marketData.dii}</strong></div><div class="card metric"><span>BREADTH</span><strong>${marketData.breadth}</strong></div><div class="card metric"><span>PCR</span><strong>${marketData.pcr}</strong></div></div>
  <div class="notice section"><b>Index-option rule:</b> decide the index direction first. Then select only the best liquid NIFTY/BANKNIFTY contract after checking IV, Greeks, OI, spread, expected move and the 5-minute activation gate. If the gate is not confirmed: <b>NO TRADE</b>.</div>
  <div class="rows section">
   <div class="row"><b>NIFTY</b><span class="bear">BEARISH BIAS</span><span>PUT only after 5M continuation confirmation.</span><span class="right">WAIT</span></div>
   <div class="row"><b>BANK NIFTY</b><span class="bear">BEARISH BIAS</span><span>Same confirmation-first rule.</span><span class="right">WAIT</span></div>
  </div>
 </section>`;
}

function optionRow(x){
 return `<div class="tr"><b>${x.symbol}</b><span>${x.direction}</span><span>${x.move}</span><span class="${x.sentiment>0?"bull":"bear"}">${x.sentiment>0?"+":""}${x.sentiment}</span><span>${x.confidence}%</span><span>${x.signal}</span></div>`;
}

function options(){
 return `<section class="market-head"><div><div class="label">PAGE 2 · STOCK OPTIONS</div><h1>Stock Options</h1></div><span class="live-badge">NO ACTIONABLE TAB</span></section>
 <section class="card"><div class="notice"><b>This page is an option research board only.</b> There is deliberately no separate “Actionable Trade” page. Stock option decisions are made from the validated next-day plan inside Stock Information, then activated only when the live trigger confirms.</div>
 <div class="grid section"><div class="card metric"><span>UNDERLYING FIRST</span><strong>YES</strong><span>Direction before contract</span></div><div class="card metric"><span>OPTION CHECK</span><strong>IV + GREEKS</strong><span>Delta / gamma / theta / vega</span></div><div class="card metric"><span>LIQUIDITY</span><strong>MANDATORY</strong><span>Spread / depth / OI</span></div><div class="card metric"><span>TARGET</span><strong>3× / 4×</strong><span>Opportunity test, never guarantee</span></div></div>
 <div class="signal-section"><h2>Current EOD option candidates — research only</h2><div class="signal-table"><div class="tr head"><b>STOCK</b><b>BIAS</b><b>MOVE</b><b>SENTIMENT</b><b>AI CONF.</b><b>STATUS</b></div>${selected.filter(x=>x.direction!=="REVERSAL").map(optionRow).join("")}</div></div>
 <div class="notice section"><b>Important:</b> these are not orders or next-day recommendations. A candidate becomes a posted next-day plan only after the full historical/forward validation process is passed.</div>
 </section>`;
}

function stockRow(x){
 return `<div class="tr"><b>${x.symbol}</b><span>${x.direction}</span><span>${x.move}</span><span class="${x.sentiment>0?"bull":"bear"}">${x.sentiment>0?"+":""}${x.sentiment}</span><span>${x.confidence}%</span><span>${x.signal}</span></div>`;
}

function stocks(){
 const posted=validatedNextDay.length>0;
 return `<section class="market-head"><div><div class="label">PAGE 3 · STOCK INFORMATION</div><h1>Stock Information · Next-Day Plan</h1></div><span class="live-badge">${posted?"VALIDATED PLAN":"NOT POSTED"}</span></section>
 <section class="card"><div class="grid">
  <div class="card metric"><span>UNIVERSE</span><strong>150</strong><span>Liquid F&O working universe</span></div>
  <div class="card metric"><span>SHORTLIST</span><strong>15</strong><span>5 bearish + 5 bullish + 5 reversal</span></div>
  <div class="card metric"><span>VISIBLE AI</span><strong>SENTIMENT + CONF.</strong><span>Composite intelligence stays backend-only</span></div>
  <div class="card metric"><span>EOD PROCESS</span><strong>SCAN → PRACTICE</strong><span>Validate before posting</span></div>
 </div>
 <div class="notice section"><b>Next-day plan rule:</b> the 150-stock scan happens first. The system then selects the strongest candidates, tests them against timestamp-safe historical behaviour and option outcomes, checks the current regime/news/OI/RSI/divergence evidence, and only then posts a BUY/PUT/CALL plan. If validation is insufficient, the plan remains <b>NO TRADE / NOT POSTED</b>.</div>
 </section>
 <section class="card result-section"><div class="signal"><h2>15-stock research pool</h2><span class="pill">NOT A BUY LIST</span></div>
  <div class="signal-table result-table stock-table"><div class="tr head"><b>STOCK</b><b>BIAS</b><b>MOVE</b><b>SENTIMENT</b><b>AI CONF.</b><b>STATUS</b></div>${selected.map(stockRow).join("")}</div>
 </section>
 <section class="card section"><div class="label">NEXT-DAY PLAN — POST ONLY AFTER PRACTICE</div>
  ${posted?validatedNextDay.map(x=>`<div class="row"><b>${x.symbol}</b><span class="bull">BUY PLAN</span><span>${x.plan}</span><span class="right">Validated</span></div>`).join(""):`<div class="notice"><b>NO VALIDATED BUY PLAN POSTED.</b><br><br>The current GitHub Pages build does not have the required historical option/OI/intraday backend connected. Therefore I will not convert the EOD research pool into a “buy tomorrow” recommendation. This is intentional risk control, not a missing UI feature.</div>`}
 </section>
 <section class="card section"><div class="label">WHAT MUST PASS BEFORE POSTING</div><div class="research-grid">
  <div><b>1 · MARKET REGIME</b><span>Weekly → daily → 3H → 1H structure agrees or contradiction is explicitly resolved.</span></div>
  <div><b>2 · RSI / DIVERGENCE</b><span>Continuation and reversal are evaluated separately.</span></div>
  <div><b>3 · OI / VOLUME</b><span>Fresh positioning must confirm the underlying thesis.</span></div>
  <div><b>4 · NEWS / CATALYST</b><span>AI reads relevant company, sector, macro and market news and checks whether price agrees.</span></div>
  <div><b>5 · HISTORICAL PRACTICE</b><span>Walk-forward, no-look-ahead validation including underlying and options where data exists.</span></div>
  <div><b>6 · EXECUTION GATE</b><span>Liquidity + 5M trigger + invalidation must be defined before any plan is posted.</span></div>
 </div></section>`;
}

function render(){
 document.getElementById("app").innerHTML=shell();
 document.getElementById("content").innerHTML=({market,options,stocks}[state.tab])();
}
function go(t){state.tab=t;render()}
render();
