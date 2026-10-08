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

/* These are the verified 08-Oct research candidates. They are NOT presented as live scores.
   The production backend will replace feature fields with timestamped 5M/15M/1H/3H/1D/1W data. */
const selected=[
 {rank:1,symbol:"ADANIGREEN",direction:"BEARISH",move:"−7.88%",sentiment:-7.8,crowding:91,confidence:82,correlation:74,trap:88,reversal:"HIGH",signal:"WAIT → PUT IF BREAKDOWN",reason:"Bearish continuation is strong, but reversal risk is elevated. PUT requires 5M breakdown + OI/volume confirmation."},
 {rank:2,symbol:"JUBLFOOD",direction:"BEARISH",move:"−7.16%",sentiment:-7.2,crowding:86,confidence:79,correlation:68,trap:84,reversal:"HIGH",signal:"PUT WATCH",reason:"Sharp weakness and positioning pressure; continuation must be re-confirmed next session."},
 {rank:3,symbol:"INOXWIND",direction:"BEARISH",move:"−6.96%",sentiment:-7.0,crowding:83,confidence:77,correlation:61,trap:82,reversal:"HIGH",signal:"PUT WATCH",reason:"Extreme weakness; avoid chasing a gap-down without fresh 5M confirmation."},
 {rank:4,symbol:"TIINDIA",direction:"BEARISH",move:"−6.16%",sentiment:-6.4,crowding:79,confidence:76,correlation:72,trap:77,reversal:"HIGH",signal:"PUT WATCH",reason:"Weak structure; continuation preferred only after trigger and liquidity check."},
 {rank:5,symbol:"ADANIENT",direction:"BEARISH",move:"−5.36%",sentiment:-6.1,crowding:82,confidence:80,correlation:76,trap:80,reversal:"MEDIUM",signal:"PUT WATCH",reason:"Bearish structure and positioning dominate; oversold readings do not invalidate trend."},
 {rank:1,symbol:"LICHSGFIN",direction:"BULLISH",move:"+4.19%",sentiment:7.1,crowding:58,confidence:74,correlation:63,trap:41,reversal:"LOW",signal:"CALL WATCH",reason:"Relative strength on a broad risk-off day; needs 5M continuation confirmation."},
 {rank:2,symbol:"ICICIGI",direction:"BULLISH",move:"+2.14%",sentiment:5.2,crowding:52,confidence:72,correlation:70,trap:36,reversal:"LOW",signal:"CALL WATCH",reason:"Positive relative strength; no chase until higher-timeframe structure and 5M trigger agree."},
 {rank:3,symbol:"PNBHOUSING",direction:"BULLISH",move:"+1.68%",sentiment:4.6,crowding:49,confidence:70,correlation:59,trap:34,reversal:"LOW",signal:"CALL WATCH",reason:"Relative strength but evidence depth is below the actionable threshold."},
 {rank:4,symbol:"SRF",direction:"BULLISH",move:"+1.02%",sentiment:3.4,crowding:44,confidence:68,correlation:66,trap:31,reversal:"LOW",signal:"CALL WATCH",reason:"One of the few gainers; confirmation required."},
 {rank:5,symbol:"MPHASIS",direction:"BULLISH",move:"+0.63%",sentiment:2.8,crowding:41,confidence:66,correlation:73,trap:29,reversal:"LOW",signal:"CALL WATCH",reason:"Held positive while market sold off; trend confirmation required."},
 {rank:1,symbol:"M&M",direction:"REVERSAL",move:"RSI 8.9",sentiment:-8.2,crowding:94,confidence:81,correlation:77,trap:93,reversal:"HIGH",signal:"REVERSAL WATCH",reversalCandidate:true,reversalScore:92,reason:"Deeply oversold; CALL only after bullish RSI divergence + price reclaim + OI/volume confirmation."},
 {rank:2,symbol:"BAJAJ-AUTO",direction:"REVERSAL",move:"RSI 9.5",sentiment:-7.9,crowding:91,confidence:78,correlation:74,trap:90,reversal:"HIGH",signal:"REVERSAL WATCH",reversalCandidate:true,reversalScore:89,reason:"Extreme oversold condition; continuation risk remains."},
 {rank:3,symbol:"EICHERMOT",direction:"REVERSAL",move:"RSI 12.3",sentiment:-7.1,crowding:88,confidence:75,correlation:69,trap:87,reversal:"HIGH",signal:"REVERSAL WATCH",reversalCandidate:true,reversalScore:86,reason:"Oversold + strong downtrend; wait for bullish RSI divergence."},
 {rank:4,symbol:"ADANIENT",direction:"REVERSAL",move:"RSI ~22–31",sentiment:-6.1,crowding:82,confidence:75,correlation:76,trap:80,reversal:"MEDIUM",signal:"REVERSAL WATCH",reversalCandidate:true,reversalScore:79,reason:"Oversold readings do not invalidate the bearish structure."},
 {rank:5,symbol:"JSWSTEEL",direction:"REVERSAL",move:"RSI ~22–26",sentiment:-6.4,crowding:80,confidence:73,correlation:71,trap:79,reversal:"HIGH",signal:"REVERSAL WATCH",reversalCandidate:true,reversalScore:78,reason:"Strong-sell trend + oversold; reversal requires confirmed divergence."}
];

const carry={bearish:selected.filter(x=>x.direction==="BEARISH"),bullish:selected.filter(x=>x.direction==="BULLISH"),reversal:selected.filter(x=>x.direction==="REVERSAL")};

function shell(){
 return `<header class="top"><div class="brand"><div><b>TRAP AI</b><br><small>AI Market Intelligence · Decision System</small><div class="status">● 150-STOCK F&O SCAN · SENTIMENT-FIRST · BACKEND FEED PENDING</div></div><div style="text-align:right"><div class="label">ENGINE</div><b>5M CYCLE</b></div></div>
 <nav class="nav">${[
 ["options","1 · NIFTY OPTIONS"],["stocks","2 · STOCK INFORMATION"],["scanner","3 · ACTIONABLE"],["traps","FADE RADAR"],["replay","REPLAY"],["backtest","BACKTEST"]
 ].map(x=>`<button class="${state.tab===x[0]?"active":""}" onclick="go('${x[0]}')">${x[1]}</button>`).join("")}</nav></header>
 <main class="main"><div id="content"></div><div class="footer">Research snapshot: 08 Oct 2026 EOD. Live 5M/OI/IV/news feeds are not connected yet; no page may represent these EOD values as live or as a guaranteed probability.</div></main>`;
}
function option(){
 return `<section class="market-head"><div><div class="label">PHASE 1 · NIFTY OPTION DECISION</div><h1>Best NIFTY Option</h1></div><span class="live-badge">VIX-AWARE · LIVE FEED REQUIRED</span></section>
 <section class="card"><div class="signal"><div><div class="label">Underlying</div><h2>NIFTY bearish bias — PUT side preferred only if the continuation gate activates</h2></div><span class="pill">NO BLIND ENTRY</span></div>
 <div class="grid option-grid"><div class="card metric"><span>NIFTY</span><strong>22,231.80</strong><span>08-Oct EOD</span></div><div class="card metric"><span>VIX</span><strong>15.25</strong><span>Volatility expansion</span></div><div class="card metric"><span>FII / DII</span><strong>−₹12,944 / +₹10,703 Cr</strong><span>Risk-off flow</span></div><div class="card metric"><span>PLAN HORIZON</span><strong>1–3 sessions</strong><span>Recalculate every 5 min</span></div></div>
 <div class="section rows"><div class="row"><b>Primary contract</b><span class="bear">NIFTY PUT</span><span>Target strike = nearest liquid strike with delta/IV/spread inside backend gate</span><span class="right">Select live</span></div>
 <div class="row"><b>Entry</b><span>5M BREAK</span><span>Underlying breaks trigger + OI/volume confirms + no bullish RSI divergence</span><span class="right">Mandatory</span></div>
 <div class="row"><b>Target</b><span>TRAIL</span><span>Target based on expected move, VIX and option Greeks; no fixed % until live IV</span><span class="right">Dynamic</span></div>
 <div class="row"><b>Exit</b><span>INVALIDATION</span><span>5M reclaim, bullish divergence, IV collapse or liquidity deterioration</span><span class="right">Immediate</span></div></div>
 <div class="notice section"><b>Option-ranking rule:</b> direction first → expiry → delta → gamma/theta → IV percentile → spread/depth → OI/crowding → expected move → 1–3 session holding window. The engine must never choose an option only because it had a large previous-day percentage gain.</div></section>
 <section class="card section"><div class="label">Why VIX matters</div><div class="research-grid"><div><b>LOW VIX</b><span>Prefer closer-to-ATM contracts; avoid paying excessive IV.</span></div><div><b>RISING VIX</b><span>Favor liquid strikes and control theta/IV expansion risk.</span></div><div><b>HIGH VIX</b><span>Demand larger expected move and wider invalidation logic; no automatic chase.</span></div></div></section>`;
}
function stockRow(x){
 return `<div class="tr"><b>#${x.rank}</b><strong>${x.symbol}</strong><span class="${x.direction==="BEARISH"?"bear":x.direction==="BULLISH"?"bull":"neutral"}">${x.move}</span><strong>${x.sentiment>0?"+":""}${x.sentiment.toFixed(1)}</strong><span>${x.crowding}/100</span><span>${x.confidence}%</span><span>${x.correlation}%</span><span>${x.signal}</span></div>`;
}
function stocks(){
 return `<section class="market-head"><div><div class="label">PHASE 2 · STOCK INFORMATION</div><h1>150 F&O Intelligence Scan → 15 Carry-Forward</h1></div><span class="live-badge">SENTIMENT FIRST</span></section>
 <section class="card"><div class="grid"><div class="card metric"><span>UNIVERSE</span><strong>150</strong><span>Liquid F&O target universe</span></div><div class="card metric"><span>SHORTLIST</span><strong>15</strong><span>5 bearish + 5 bullish + 5 reversal</span></div><div class="card metric"><span>BACKEND MODEL</span><strong>HIDDEN</strong><span>Composite calculated only in backend</span></div><div class="card metric"><span>CORRELATION</span><strong>20D / 60D</strong><span>Stock vs NIFTY + sector</span></div></div>
 <div class="notice section"><b>Selection architecture:</b> scan all eligible NSE individual-security F&O underlyings, rank liquidity to a 150-stock working universe, then evaluate every stock across 1W/1D/3H/1H/15M/5M. Sentiment is deliberately heavy, but it cannot override contradictory price/RSI/OI evidence. Correlation is a context feature, not a directional signal.</div>
 </section>
 <section class="card result-section"><div class="signal"><h2>Carry-forward watchlist — only these names are monitored for tomorrow</h2><span class="pill">15 STOCKS</span></div>
 <div class="signal-table result-table stock-table"><div class="tr head"><b>#</b><b>STOCK</b><b>MOVE</b><b>SENTIMENT</b><b>CROWDING</b><b>AI CONF.</b><b>CORR.</b><b>SIGNAL</b></div>${selected.map(stockRow).join("")}</div></section>
 <section class="card result-section"><div class="label">How the backend will calculate each row</div><div class="research-grid"><div><b>SENTIMENT</b><span>Price/return + news/NLP + analyst/market tone + relative strength + OI context + contradictions.</span></div><div><b>CROWDING</b><span>OI concentration + PCR/strike walls + futures OI + participant positioning + volume/IV crowding.</span></div><div><b>CORRELATION %</b><span>Calculated in backend as context; not used as a displayed decision score.</span></div><div><b>AI CONFIDENCE</b><span>Evidence coverage + source quality + model agreement + regime consistency; not a win-rate claim.</span></div><div><b>REVERSAL</b><span>Oversold alone never qualifies. Divergence + reclaim + OI/volume + multi-timeframe confirmation required.</span></div><div><b>NO TRADE</b><span>Missing data, contradictory evidence, poor liquidity or failed 5M trigger blocks action.</span></div></div></section>`;
}
function actionable(){
 const active=selected.filter(x=>x.signal.includes("WATCH")||x.signal.includes("BREAKDOWN"));
 return `<section class="market-head"><div><div class="label">PHASE 3 · ACTIONABLE</div><h1>Only Selected Stocks · Trigger Monitor</h1></div><span class="live-badge">5M ACTIVATION GATE</span></section>
 <section class="card"><div class="notice"><b>Important:</b> this tab does not rescan the whole market for trades. It watches only the post-market 15-stock carry-forward list. An actionable signal is created only when the selected stock's continuation/reversal gate activates.</div>
 <div class="signal-table result-table stock-table section"><div class="tr head"><b>STOCK</b><b>DIRECTION</b><b>SENTIMENT</b><b>CROWDING</b><b>AI</b><b>CONF.</b><b>5M GATE</b><b>STATUS</b></div>${active.map(x=>`<div class="tr"><strong>${x.symbol}</strong><span>${x.direction}</span><span class="${x.sentiment>0?"bull":"bear"}">${x.sentiment>0?"+":""}${x.sentiment.toFixed(1)}</span><span>${x.crowding}</span><span>${x.confidence}%</span><span>WAITING FOR LIVE FEED</span><span class="neutral">NO LIVE SIGNAL</span></div>`).join("")}</div>
 <div class="notice section"><b>Alert rule:</b> if any selected stock activates, TRAP AI should report symbol → direction → trigger → option → entry → invalidation → target → holding duration → VIX/IV → crowding → sentiment → confidence. If no gate activates, it stays silent.</div></section>`;
}
function traps(){
 return `<section class="market-head"><div><div class="label">FADE RADAR</div><h1>Reversal Candidates</h1></div><span class="live-badge">STRICT CONFIRMATION</span></section>
 <section class="card"><div class="notice"><b>Reversal ≠ CALL.</b> A high reversal score means the continuation trade has elevated failure risk. CALL is allowed only after bullish RSI divergence + price reclaim + OI/volume confirmation. Otherwise: NO TRADE.</div>
 <div class="rows section">${carry.reversal.map(x=>`<div class="row"><b>${x.symbol}</b><span class="neutral">${x.signal}</span><span>${x.reason}</span><span class="right">Conf. ${x.confidence}%</span></div>`).join("")}</div></section>`;
}
function replay(){
 return `<section class="market-head"><div><div class="label">REPLAY</div><h1>08 Oct 2026 Verified Session</h1></div><span class="live-badge">EOD</span></section>
 <section class="card"><div class="grid"><div class="card metric"><span>NIFTY</span><strong>−1.64%</strong><span>22,231.80 close</span></div><div class="card metric"><span>BANK NIFTY</span><strong>−0.98%</strong><span>54,515.05 close</span></div><div class="card metric"><span>FII / DII</span><strong>−12,944 / +10,703 Cr</strong><span>Cash market</span></div><div class="card metric"><span>BREADTH</span><strong>11 / 203</strong><span>F&amp;O advancers / decliners</span></div></div>
 <div class="notice section"><b>Replay integrity:</b> the historical 5M feed is not connected, so this page does not claim TRAP AI issued intraday alerts on 08 Oct.</div></section>`;
}
function backtest(){
 return `<section class="market-head"><div><div class="label">BACKTEST</div><h1>Validation Status</h1></div><span class="live-badge">NO LOOK-AHEAD</span></section>
 <section class="card"><div class="grid">${["2007–2009","2016–2018","2020–2022","2024–2026"].map(p=>`<div class="card metric"><span>${p}</span><strong>NOT RUN</strong><span>Timestamped option/OI/IV history required</span></div>`).join("")}</div>
 <div class="notice section"><b>No invented statistics.</b> Win rate, profit factor, drawdown, Sharpe and 3×/4× opportunity rates will appear only after walk-forward validation with timestamped production gates.</div></section>`;
}
function render(){document.getElementById("app").innerHTML=shell();document.getElementById("content").innerHTML=({options:option,stocks,scanner:actionable,traps,replay,backtest}[state.tab])();}
function go(t){state.tab=t;render()} render();