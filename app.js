const state={tab:"options",updated:new Date("2026-10-08T15:30:00+05:30")};

const marketData={
  nifty:{value:"22,231.80",move:"−1.64%"},
  bank:{value:"54,515.05",move:"−0.98%"},
  vix:{value:"15.25",move:"+1.35"},
  fii:"−₹12,944 Cr",dii:"+₹10,703 Cr",
  breadth:"11 up / 203 down",pcr:"0.90",
  regime:"BEARISH · VOLATILITY EXPANSION",
  outlook:"Bearish bias; oversold rebound risk is high"
};

/*
  IMPORTANT:
  These are 08-Oct-2026 EOD research candidates only.
  They are NOT live signals and are NOT presented as the output of a connected
  150-stock production backend. Until a secure market-data backend is connected,
  TRAP AI must not invent a next-session score, option contract, or probability.
*/
const selected=[
 {rank:1,symbol:"ADANIGREEN",direction:"BEARISH",move:"−7.88%",sentiment:-7.8,confidence:82,signal:"WAIT → PUT IF BREAKDOWN",reason:"Bearish continuation is strong, but a breakdown must be confirmed next session; no blind put after a gap-down."},
 {rank:2,symbol:"JUBLFOOD",direction:"BEARISH",move:"−7.16%",sentiment:-7.2,confidence:79,signal:"PUT WATCH",reason:"Sharp weakness; continuation needs fresh 5M structure and volume/OI confirmation."},
 {rank:3,symbol:"INOXWIND",direction:"BEARISH",move:"−6.96%",sentiment:-7.0,confidence:77,signal:"PUT WATCH",reason:"Extreme weakness; avoid chasing an opening gap without confirmation."},
 {rank:4,symbol:"TIINDIA",direction:"BEARISH",move:"−6.16%",sentiment:-6.4,confidence:76,signal:"PUT WATCH",reason:"Weak structure; continuation is conditional on trigger and liquidity."},
 {rank:5,symbol:"ADANIENT",direction:"BEARISH",move:"−5.36%",sentiment:-6.1,confidence:80,signal:"PUT WATCH",reason:"Bearish structure dominates; oversold conditions do not automatically mean reversal."},
 {rank:1,symbol:"LICHSGFIN",direction:"BULLISH",move:"+4.19%",sentiment:7.1,confidence:74,signal:"CALL WATCH",reason:"Relative strength during a broad sell-off; needs 5M continuation confirmation."},
 {rank:2,symbol:"ICICIGI",direction:"BULLISH",move:"+2.14%",sentiment:5.2,confidence:72,signal:"CALL WATCH",reason:"Positive relative strength; no chase until structure and trigger agree."},
 {rank:3,symbol:"PNBHOUSING",direction:"BULLISH",move:"+1.68%",sentiment:4.6,confidence:70,signal:"CALL WATCH",reason:"Relative strength is useful but evidence depth is below the action threshold."},
 {rank:4,symbol:"SRF",direction:"BULLISH",move:"+1.02%",sentiment:3.4,confidence:68,signal:"CALL WATCH",reason:"One of the few gainers; confirmation required."},
 {rank:5,symbol:"MPHASIS",direction:"BULLISH",move:"+0.63%",sentiment:2.8,confidence:66,signal:"CALL WATCH",reason:"Held positive while the market sold off; trend confirmation required."},
 {rank:1,symbol:"M&M",direction:"REVERSAL",move:"RSI 8.9",sentiment:-8.2,confidence:81,signal:"REVERSAL WATCH",reason:"Deeply oversold. CALL only after bullish RSI divergence + price reclaim + OI/volume confirmation."},
 {rank:2,symbol:"BAJAJ-AUTO",direction:"REVERSAL",move:"RSI 9.5",sentiment:-7.9,confidence:78,signal:"REVERSAL WATCH",reason:"Extreme oversold condition; continuation risk remains."},
 {rank:3,symbol:"EICHERMOT",direction:"REVERSAL",move:"RSI 12.3",sentiment:-7.1,confidence:75,signal:"REVERSAL WATCH",reason:"Oversold + downtrend; wait for bullish divergence and reclaim."},
 {rank:4,symbol:"ADANIENT",direction:"REVERSAL",move:"RSI ~22–31",sentiment:-6.1,confidence:75,signal:"REVERSAL WATCH",reason:"Reversal risk is elevated, but that does not create an immediate CALL."},
 {rank:5,symbol:"JSWSTEEL",direction:"REVERSAL",move:"RSI ~22–26",sentiment:-6.4,confidence:73,signal:"REVERSAL WATCH",reason:"Strong-sell trend + oversold; reversal requires confirmed divergence."}
];

const carry={
  bearish:selected.filter(x=>x.direction==="BEARISH"),
  bullish:selected.filter(x=>x.direction==="BULLISH"),
  reversal:selected.filter(x=>x.direction==="REVERSAL")
};

function shell(){
 return `<header class="top"><div class="brand"><div><b>TRAP AI</b><br><small>AI Market Intelligence · Decision System</small><div class="status">● EOD ENGINE · 150 F&O SCAN · BACKEND DATA FEED NOT CONNECTED</div></div><div style="text-align:right"><div class="label">ENGINE</div><b>5M CYCLE</b></div></div>
 <nav class="nav">${[
 ["options","1 · NIFTY OPTIONS"],["stocks","2 · STOCK INFORMATION"],["scanner","3 · ACTIONABLE"],["traps","FADE RADAR"],["replay","REPLAY"],["backtest","BACKTEST"]
 ].map(x=>`<button class="${state.tab===x[0]?"active":""}" onclick="go('${x[0]}')">${x[1]}</button>`).join("")}</nav></header>
 <main class="main"><div id="content"></div><div class="footer">EOD research snapshot: 08 Oct 2026. Production next-session analysis requires a connected, timestamped market/OI/options/news backend. No live signal or win-rate is claimed.</div></main>`;
}

function option(){
 return `<section class="market-head"><div><div class="label">PHASE 1 · NIFTY OPTION DECISION</div><h1>Best NIFTY Option</h1></div><span class="live-badge">BACKEND REQUIRED</span></section>
 <section class="card"><div class="signal"><div><div class="label">EOD BIAS</div><h2>NIFTY bearish bias — PUT side only if the continuation gate activates</h2></div><span class="pill">NO BLIND ENTRY</span></div>
 <div class="grid option-grid"><div class="card metric"><span>NIFTY</span><strong>22,231.80</strong><span>08-Oct EOD</span></div><div class="card metric"><span>VIX</span><strong>15.25</strong><span>Volatility expansion</span></div><div class="card metric"><span>FII / DII</span><strong>−₹12,944 / +₹10,703 Cr</strong><span>Risk-off flow</span></div><div class="card metric"><span>PLAN HORIZON</span><strong>1–3 sessions</strong><span>Recalculate every 5 min</span></div></div>
 <div class="notice section"><b>Next-session rule:</b> underlying direction is decided first. Then the backend selects the most liquid option using expiry, delta, gamma/theta, IV percentile, spread/depth, OI and expected move. A large previous-day option gain can never be the selection rule.</div>
 <div class="rows section"><div class="row"><b>PUT entry</b><span>CONDITIONAL</span><span>5M bearish break + OI/volume confirmation + no bullish RSI divergence</span><span class="right">Required</span></div>
 <div class="row"><b>CALL entry</b><span>REVERSAL ONLY</span><span>Bullish RSI divergence + price reclaim + OI/volume confirmation</span><span class="right">Required</span></div>
 <div class="row"><b>Exit</b><span>INVALIDATION</span><span>5M reclaim against thesis, divergence failure, IV collapse or liquidity deterioration</span><span class="right">Immediate</span></div></div></section>
 <section class="card section"><div class="label">VIX / OPTION LOGIC</div><div class="research-grid"><div><b>LOW VIX</b><span>Closer-to-ATM contracts can be preferred; avoid paying excessive IV.</span></div><div><b>RISING VIX</b><span>Prioritize liquidity and control theta/IV expansion risk.</span></div><div><b>HIGH VIX</b><span>Demand a sufficiently large expected move; never chase blindly.</span></div></div></section>`;
}

function stockRow(x){
 return `<div class="tr"><b>#${x.rank}</b><strong>${x.symbol}</strong><span class="${x.direction==="BEARISH"?"bear":x.direction==="BULLISH"?"bull":"neutral"}">${x.move}</span><strong>${x.sentiment>0?"+":""}${x.sentiment.toFixed(1)}</strong><span>${x.confidence}%</span><span>${x.signal}</span></div>`;
}

function stocks(){
 return `<section class="market-head"><div><div class="label">PHASE 2 · STOCK INFORMATION</div><h1>150 F&O EOD Scan → 15 Carry-Forward</h1></div><span class="live-badge">EOD WORKFLOW</span></section>
 <section class="card"><div class="grid"><div class="card metric"><span>UNIVERSE</span><strong>150</strong><span>Liquid F&O working universe</span></div><div class="card metric"><span>SHORTLIST</span><strong>15</strong><span>5 bearish + 5 bullish + 5 reversal</span></div><div class="card metric"><span>VISIBLE AI OUTPUT</span><strong>SENTIMENT + CONF.</strong><span>All composite features remain backend-only</span></div><div class="card metric"><span>EOD RUN</span><strong>15:45 IST</strong><span>Freeze session, then calculate next-day candidates</span></div></div>
 <div class="notice section"><b>This is the correction:</b> at the end of each session the system must first ingest the complete session, then evaluate all 150 names across 1W/1D/3H/1H/15M/5M. It must not start from yesterday's Top 15 and it must not hard-code sentiment. Only after the full scan are 5 bearish, 5 bullish and 5 reversal candidates carried forward.</div></section>
 <section class="card result-section"><div class="signal"><h2>08-Oct EOD research candidates</h2><span class="pill">NOT LIVE / NOT PRE-TRADE GUARANTEE</span></div>
 <div class="signal-table result-table stock-table"><div class="tr head"><b>#</b><b>STOCK</b><b>MOVE</b><b>SENTIMENT</b><b>AI CONF.</b><b>STATUS</b></div>${selected.map(stockRow).join("")}</div></section>
 <section class="card result-section"><div class="label">Mandatory 15:45 → next-session workflow</div><div class="research-grid">
 <div><b>1 · FREEZE</b><span>Lock 15:30 EOD prices, volume, F&O OI, option chain, FII/DII, VIX, global/macro/news inputs with timestamps.</span></div>
 <div><b>2 · SCAN 150</b><span>Evaluate every stock; no cherry-picking. Rank bearish continuation, bullish continuation and reversal separately.</span></div>
 <div><b>3 · AI REVIEW</b><span>Use sentiment + price + RSI/divergence + OI/volume + options + regime + liquidity + catalyst, including contradictions.</span></div>
 <div><b>4 · HISTORICAL CHECK</b><span>Backtest every selected stock before promoting it to the next-session preferred list.</span></div>
 <div><b>5 · OPTION MAP</b><span>Only after stock direction passes, select the best liquid call/put contract and calculate entry/invalidation/target.</span></div>
 <div><b>6 · 5M GATE</b><span>Tomorrow's recommendation is conditional. Bearish today → PUT only if tomorrow's 5M continuation gate confirms; otherwise NO TRADE.</span></div>
 </div></section>`;
}

function actionable(){
 const active=selected;
 return `<section class="market-head"><div><div class="label">PHASE 3 · ACTIONABLE</div><h1>Only the 15 Carry-Forward Stocks</h1></div><span class="live-badge">5M ACTIVATION GATE</span></section>
 <section class="card"><div class="notice"><b>No whole-market chasing:</b> after the 15:45 EOD scan, only these 15 names are monitored intraday. A bearish EOD sentiment is a bias, not an automatic PUT. A bullish reversal requires its own confirmation gate.</div>
 <div class="signal-table result-table stock-table section"><div class="tr head"><b>STOCK</b><b>DIRECTION</b><b>SENTIMENT</b><b>AI CONF.</b><b>5M GATE</b><b>STATUS</b></div>${active.map(x=>`<div class="tr"><strong>${x.symbol}</strong><span>${x.direction}</span><span class="${x.sentiment>0?"bull":"bear"}">${x.sentiment>0?"+":""}${x.sentiment.toFixed(1)}</span><span>${x.confidence}%</span><span>WAITING FOR LIVE FEED</span><span class="neutral">NO LIVE SIGNAL</span></div>`).join("")}</div>
 <div class="notice section"><b>Decision rule:</b> continuation = higher-timeframe bearish/bullish structure + 5M trigger + volume/OI confirmation + no invalidating RSI divergence. Reversal = bullish/bearish divergence + price reclaim/break + OI/volume confirmation. If neither passes, the system says NO TRADE.</div></section>`;
}

function traps(){
 return `<section class="market-head"><div><div class="label">FADE RADAR</div><h1>Reversal Candidates</h1></div><span class="live-badge">STRICT CONFIRMATION</span></section>
 <section class="card"><div class="notice"><b>Reversal ≠ CALL.</b> High reversal risk means the continuation trade has a greater chance of failing. A CALL is allowed only after bullish RSI divergence + price reclaim + OI/volume confirmation.</div>
 <div class="rows section">${carry.reversal.map(x=>`<div class="row"><b>${x.symbol}</b><span class="neutral">${x.signal}</span><span>${x.reason}</span><span class="right">Conf. ${x.confidence}%</span></div>`).join("")}</div></section>`;
}

function replay(){
 return `<section class="market-head"><div><div class="label">REPLAY</div><h1>08 Oct 2026 Verified EOD Context</h1></div><span class="live-badge">EOD</span></section>
 <section class="card"><div class="grid"><div class="card metric"><span>NIFTY</span><strong>−1.64%</strong><span>22,231.80 close</span></div><div class="card metric"><span>BANK NIFTY</span><strong>−0.98%</strong><span>54,515.05 close</span></div><div class="card metric"><span>FII / DII</span><strong>−12,944 / +10,703 Cr</strong><span>Cash market</span></div><div class="card metric"><span>BREADTH</span><strong>11 / 203</strong><span>F&amp;O advancers / decliners</span></div></div>
 <div class="notice section"><b>Replay integrity:</b> the historical intraday feed is not connected, so TRAP AI does not claim that these were actual intraday alerts on 08 Oct.</div></section>`;
}

function backtest(){
 return `<section class="market-head"><div><div class="label">BACKTEST</div><h1>Selected-Stock Validation</h1></div><span class="live-badge">NO LOOK-AHEAD</span></section>
 <section class="card"><div class="grid">${["2007–2009","2016–2018","2020–2022","2024–2026"].map(p=>`<div class="card metric"><span>${p}</span><strong>NOT RUN</strong><span>Historical data connection required</span></div>`).join("")}</div>
 <div class="notice section"><b>Backtest rule now locked:</b> whenever the EOD engine selects the 15 stocks, every selected stock is validated against its historical record before it can become a preferred next-session trade. Validation must be walk-forward and timestamp-safe: no future prices, OI, news or option data may leak into the decision.</div>
 <div class="research-grid section">
  <div><b>UNDERLYING TEST</b><span>Daily/weekly direction, RSI divergence, continuation and reversal outcomes.</span></div>
  <div><b>OPTIONS TEST</b><span>Contract-level P&amp;L, IV, Greeks, spread and expiry effects where historical option data exists.</span></div>
  <div><b>3× / 4× TEST</b><span>Measure how often an option actually reaches 3× or 4× from the defined entry before invalidation, not a theoretical promise.</span></div>
  <div><b>METRICS</b><span>Win rate, expectancy, profit factor, max drawdown, Sharpe, average winner/loser, false-signal rate and 3×/4× hit rate.</span></div>
  <div><b>REGIME TEST</b><span>Separate bull, bear, sideways and high-volatility periods so the system is not optimized for one market regime.</span></div>
  <div><b>DECISION</b><span>A stock can be strong today and still fail validation. Failed validation downgrades or removes it from the next-session list.</span></div>
 </div>
 <div class="notice section"><b>Data limitation:</b> NSE provides historical contract-wise F&amp;O price/volume/OI data and daily reports, but the complete historical option/OI/intraday dataset needed for a faithful multi-year 3×/4× options backtest is not currently connected to this GitHub Pages app.</div></section>`;
}

function render(){
 document.getElementById("app").innerHTML=shell();
 document.getElementById("content").innerHTML=({options:option,stocks,scanner:actionable,traps,replay,backtest}[state.tab])();
}
function go(t){state.tab=t;render()}
render();
