const state={tab:"market",updated:new Date("2026-10-08T15:30:00+05:30")};

const marketData={
  nifty:{value:"22,231.80",move:"−1.64%"},
  bank:{value:"54,515.05",move:"−0.98%"},
  vix:{value:"15.25",move:"+1.35"},
  fii:"−₹12,944 Cr",dii:"+₹10,703 Cr",
  breadth:"11 up / 203 down",
  pcr:"0.90",
  regime:"BEARISH · VOLATILITY EXPANSION",
  outlook:"Bearish bias; oversold rebound risk is high",
  support:"22,100 → 21,950",
  resistance:"22,350 → 22,480"
};

const bearish=[
 {rank:1,symbol:"ADANIGREEN",move:"−7.88%",score:86,rev:"HIGH",decision:"WAIT → PUT IF BREAKDOWN",reason:"Bearish continuation score is high, but reversal risk is also high; do not buy PUT unless 5M breakdown confirms. CALL only after bullish RSI divergence + reclaim."},
 {rank:2,symbol:"JUBLFOOD",move:"−7.16%",score:81,rev:"HIGH",decision:"PUT WATCH",reason:"Sharpest weakness; OI +6.75%; volume ~3.5×; reversal risk elevated"},
 {rank:3,symbol:"INOXWIND",move:"−6.96%",score:77,rev:"HIGH",decision:"PUT WATCH",reason:"Extreme one-day weakness; continuation needs fresh 5M confirmation"},
 {rank:4,symbol:"TIINDIA",move:"−6.16%",score:76,rev:"HIGH",decision:"PUT WATCH",reason:"Second consecutive weak session; sector/breadth pressure"},
 {rank:5,symbol:"ADANIENT",move:"−5.36%",score:81,rev:"MEDIUM",decision:"PUT WATCH",reason:"Strong-sell setup; OI + short-build evidence; RSI oversold risk"}
];
const bullish=[
 {rank:1,symbol:"LICHSGFIN",move:"+4.19%",score:68,rev:"LOW",decision:"CALL WATCH",reason:"Best verified gainer; long build-up +7.98%; 3.6× volume; above 50/200-DMA"},
 {rank:2,symbol:"ICICIGI",move:"+2.14%",score:66,rev:"LOW",decision:"CALL WATCH",reason:"Relative strength on broad risk-off day; continuation still needs 5M trigger"},
 {rank:3,symbol:"PNBHOUSING",move:"+1.68%",score:63,rev:"LOW",decision:"CALL WATCH",reason:"Positive relative strength; not enough evidence for immediate chase"},
 {rank:4,symbol:"SRF",move:"+1.02%",score:60,rev:"LOW",decision:"CALL WATCH",reason:"One of few gainers; lower evidence depth than top two"},
 {rank:5,symbol:"MPHASIS",move:"+0.63%",score:58,rev:"LOW",decision:"CALL WATCH",reason:"Held positive while market sold off; trend confirmation required"}
];
const reversal=[
 {rank:1,symbol:"M&M",rsi:"8.9",score:79,decision:"NO CALL YET",reason:"Deeply oversold; strong downtrend means divergence + price reversal are mandatory"},
 {rank:2,symbol:"BAJAJ-AUTO",rsi:"9.5",score:76,decision:"NO CALL YET",reason:"Extreme oversold condition; continuation risk remains"},
 {rank:3,symbol:"EICHERMOT",rsi:"12.3",score:73,decision:"NO CALL YET",reason:"Oversold + strong downtrend; wait for bullish RSI divergence"},
 {rank:4,symbol:"ADANIENT",rsi:"~22–31",score:71,decision:"NO CALL YET",reason:"Oversold readings do not invalidate the bearish structure"},
 {rank:5,symbol:"JSWSTEEL",rsi:"~22–26",score:70,decision:"NO CALL YET",reason:"Strong-sell trend + oversold; reversal requires confirmed divergence"}
];

function shell(){
 return `<header class="top">
  <div class="brand">
   <div><b>TRAP AI</b><br><small>AI Market Intelligence · Decision System</small><div class="status">● VERIFIED EOD ENGINE · PRE-OPEN MODE · NO FABRICATED LIVE DATA</div></div>
   <div style="text-align:right"><div class="label">NEXT LIVE ENGINE</div><b>BACKEND PENDING</b></div>
  </div>
  <nav class="nav">${[["market","1 · MARKET RESEARCH"],["scanner","2 · ACTIONABLE"],["options","3 · BEST OPTION"],["traps","FADE RADAR"],["replay","REPLAY"],["backtest","BACKTEST"]].map(x=>`<button class="${state.tab===x[0]?"active":""}" onclick="go('${x[0]}')">${x[1]}</button>`).join("")}</nav>
 </header><main class="main"><div id="content"></div><div class="footer">Verified session: 08 Oct 2026. 09 Oct pre-open decisions must be revalidated with live 5M price, OI, IV, RSI divergence and liquidity before any trade.</div></main>`;
}
function market(){
 return `<section class="market-head"><div><div class="label">PAGE 1 · MARKET RESEARCH</div><h1>Market Context</h1></div><span class="live-badge">08 OCT EOD · PRE-OPEN FOR 09 OCT</span></section>
 <div class="index-strip">
  <div class="index-card"><span>NIFTY 50</span><strong>${marketData.nifty.value}</strong><em class="bear">${marketData.nifty.move}</em><small>Bearish</small></div>
  <div class="index-card"><span>BANK NIFTY</span><strong>${marketData.bank.value}</strong><em class="bear">${marketData.bank.move}</em><small>Relative strength vs Nifty</small></div>
  <div class="index-card"><span>INDIA VIX</span><strong>${marketData.vix.value}</strong><em class="bear">${marketData.vix.move}</em><small>Volatility expanding</small></div>
  <div class="index-card"><span>FII / DII</span><strong>${marketData.fii} / ${marketData.dii}</strong><em>FII risk</em><small>Cash market</small></div>
 </div>
 <section class="card section compact-research"><div class="signal"><div><div class="label">AI MARKET STATE</div><h2>${marketData.regime}</h2></div><span class="pill">CONTEXT ONLY</span></div>
 <div class="research-grid">
  <div><b>3–4H OUTLOOK</b><span>${marketData.outlook}</span></div>
  <div><b>BREADTH</b><span>${marketData.breadth} across F&amp;O stocks</span></div>
  <div><b>NIFTY PCR</b><span>${marketData.pcr} · lower than previous 1.10</span></div>
  <div><b>SUPPORT</b><span>${marketData.support}</span></div>
  <div><b>RESISTANCE</b><span>${marketData.resistance}</span></div>
  <div><b>STRUCTURE</b><span>Weekly → Daily → 3H → 1H → 15M → 5M</span></div>
 </div></section>
 <section class="card section"><div class="label">What matters before 09 Oct</div><div class="rows">
  <div class="row"><b>Macro</b><span class="bear">RISK-OFF</span><span>Crude, yields, rupee and tighter RBI stance remain pressure points</span><span class="right">High</span></div>
  <div class="row"><b>Institutional flow</b><span class="bear">FII SELLING</span><span>−₹12,944 Cr vs DII +₹10,703 Cr</span><span class="right">High</span></div>
  <div class="row"><b>Volatility</b><span class="bear">EXPANDING</span><span>VIX 15.25, highest close since June 11</span><span class="right">High</span></div>
  <div class="row"><b>Trigger</b><span class="neutral">WAIT</span><span>First 5–15 min must confirm continuation or reversal</span><span class="right">Mandatory</span></div>
 </div></section>`;
}
function table(rows,mode){
 return `<div class="signal-table result-table ${mode}"><div class="tr head"><b>#</b><b>STOCK</b><b>MOVE</b><b>AI SCORE</b><b>REVERSAL</b><b>DECISION</b></div>${rows.map(x=>`<div class="tr"><b>#${x.rank}</b><strong>${x.symbol}</strong><span class="${x.move?.startsWith("−")?"bear":"bull"}">${x.move||"RSI "+x.rsi}</span><strong>${x.score}%</strong><span>${x.rev||"WATCH"}</span><span>${x.decision}</span></div>`).join("")}</div>`;
}
function scanner(){
 return `<section class="market-head"><div><div class="label">PAGE 2 · ACTIONABLE</div><h1>Top 5 Bearish · Top 5 Bullish · Reversal Watch</h1></div><span class="live-badge">EOD VERIFIED · 08 OCT</span></section>
 <div class="notice"><b>Canonical AI weightage:</b> regime 18% · structure 18% · RSI 15% · divergence 14% · OI/volume 10% · options 8% · sentiment 7% · liquidity 5% · catalyst 3% · macro 2%. The displayed AI Score is computed from available evidence with missing factors excluded and weights renormalized. It is <b>not a calibrated win probability</b>.</div>
 <section class="card result-section"><div class="signal"><h2 class="bear">🔴 TOP 5 BEARISH</h2><span class="pill">HIGHEST VERIFIED DROPS</span></div>${table(bearish,"bear-result")}<div class="tiny-note"><b>IMPORTANT:</b> Bearish score and reversal risk are separate. “REVERSAL HIGH” means a high risk that the bearish move can reverse — it does <b>not</b> mean CALL. ADANIGREEN = <b>bearish bias, but NO IMMEDIATE PUT</b>; wait for the 5M trigger.</div></section>
 <section class="card result-section"><div class="signal"><h2 class="bull">🟢 TOP 5 BULLISH</h2><span class="pill">RELATIVE STRENGTH</span></div>${table(bullish,"bull-result")}</section>
 <section class="card result-section"><div class="signal"><h2 class="neutral">🟡 REVERSAL WATCH</h2><span class="pill">NO AUTOMATIC CALL</span></div>${table(reversal,"reversal-result")}</section>
 <section class="card section"><div class="label">Final gate for 09 Oct</div><div class="notice"><b>NO STOCK IS A PRE-AUTHORIZED TRADE.</b> Direction and reversal are separate decisions. A high bearish score means continuation is favored; a high reversal score means <b>entry must be delayed</b>. CALL requires bullish RSI divergence + price reclaim + OI/volume confirmation. PUT requires bearish continuation + 5M breakdown + OI/volume confirmation. If neither gate passes: <b>NO TRADE.</b></div></section>`;
}
function options(){
 const opts=[
  ["NIFTY 13 OCT 22200 PE","₹128.65","+335.36%","64.12L OI","OTM by 31.8 pts","PRIMARY RESEARCH"],
  ["NIFTY 13 OCT 22300 PE","₹177.45","+296.98%","High activity","ITM by 68.2 pts","BALANCED"],
  ["NIFTY 13 OCT 22400 PE","₹240.10","+256.23%","31.65L OI","ITM by 168.2 pts","LOWER GAMMA / HIGHER PREMIUM"]
 ];
 return `<section class="market-head"><div><div class="label">PAGE 3 · BEST OPTION</div><h1>Best Verified Option Setup</h1></div><span class="live-badge">13 OCT 2026 EXPIRY</span></section>
 <section class="card"><div class="signal"><div><div class="label">Underlying verdict</div><h2>NIFTY bearish bias — PUT side preferred, subject to 5M confirmation</h2></div><span class="pill">EOD CONTRACT DATA</span></div>
 <div class="grid option-grid"><div class="card metric"><span>NIFTY CLOSE</span><strong>22,231.80</strong><span>08 Oct EOD</span></div><div class="card metric"><span>PRIMARY</span><strong>22,200 PE</strong><span>13 Oct expiry</span></div><div class="card metric"><span>EOD LTP</span><strong>₹128.65</strong><span>Previous close ₹29.55</span></div><div class="card metric"><span>DAY VOLUME</span><strong>17.34 Cr</strong><span>Contracts</span></div></div>
 <div class="signal-table result-table option-result"><div class="tr head"><b>RANK</b><b>CONTRACT</b><b>LTP</b><b>DAY MOVE</b><b>OI</b><b>USE</b></div>${opts.map((o,i)=>`<div class="tr"><b>#${i+1}</b><strong>${o[0]}</strong><span>${o[1]}</span><span class="bull">${o[2]}</span><span>${o[3]}</span><span>${o[5]}</span></div>`).join("")}</div>
 <div class="notice"><b>Why 22,200 PE is primary:</b> it is close to the underlying, had very high volume and finished at ₹128.65. The 22,000 PE produced a larger percentage gain on 08 Oct, but that was a far-OTM, low-base outcome and should not be selected simply because its historical one-day percentage was higher.</div>
 <div class="notice"><b>Critical:</b> these are 08-Oct closing values, not 09-Oct live prices. At 09:20 the engine must re-rank 22,200/22,300/22,400 and other strikes using live IV, delta, spread, depth, OI and expected move. If the underlying reverses, the PUT thesis is cancelled.</div></section>`;
}
function traps(){
 return `<section class="market-head"><div><div class="label">FADE RADAR</div><h1>Contrarian Reversal Candidates</h1></div><span class="live-badge">STRICT FILTER</span></section>
 <section class="card"><div class="notice"><b>Oversold ≠ reversal.</b> These are only candidates where exhaustion may develop. A reversal requires bullish RSI divergence for CALLs or bearish RSI divergence for PUTs, price reversal, OI/volume confirmation and multi-timeframe alignment.</div>
 <div class="rows">${reversal.map(x=>`<div class="row"><b>${x.symbol}</b><span class="neutral">RSI ${x.rsi}</span><span>${x.reason}</span><span class="right">${x.decision}</span></div>`).join("")}</div></section>
 <section class="card section"><div class="label">Highest-risk false contrarian</div><div class="notice"><b>ADANIGREEN / JUBLFOOD / ADANIENT:</b> do not fade merely because the one-day fall is large. Their bearish structure and positioning evidence can continue to dominate after an oversold reading.</div></section>`;
}
function replay(){
 return `<section class="market-head"><div><div class="label">REPLAY</div><h1>08 Oct 2026 Verified Session</h1></div><span class="live-badge">EOD RECONSTRUCTION</span></section>
 <section class="card"><div class="grid"><div class="card metric"><span>NIFTY</span><strong>−1.64%</strong><span>22,231.80 close</span></div><div class="card metric"><span>BANK NIFTY</span><strong>−0.98%</strong><span>54,515.05 close</span></div><div class="card metric"><span>FII / DII</span><strong>−12,944 / +10,703 Cr</strong><span>Cash market</span></div><div class="card metric"><span>F&amp;O BREADTH</span><strong>11 / 203</strong><span>Advancers / decliners</span></div></div>
 <div class="rows"><div class="row"><b>Regime</b><span class="bear">BEARISH</span><span>Broad sell-off + volatility expansion</span><span class="right">Confirmed</span></div><div class="row"><b>Options</b><span class="bear">PUT MOMENTUM</span><span>13-Oct Nifty puts surged</span><span class="right">Confirmed</span></div><div class="row"><b>Contrarian</b><span class="neutral">NOT CONFIRMED</span><span>No verified intraday divergence/trigger dataset</span><span class="right">No trade</span></div></div>
 <div class="notice"><b>Replay integrity:</b> this page reports what the market actually did. It does not claim TRAP AI issued an intraday signal on 08 Oct because the historical 5M feed was not connected.</div></section>`;
}
function backtest(){
 const periods=["2007–2009","2016–2018","2020–2022","2024–2026"];
 return `<section class="market-head"><div><div class="label">BACKTEST</div><h1>Validation Status</h1></div><span class="live-badge">NO LOOK-AHEAD</span></section>
 <section class="card"><div class="grid">${periods.map(p=>`<div class="card metric"><span>${p}</span><strong>NOT RUN</strong><span>5M/OI/IV history not connected</span></div>`).join("")}</div>
 <div class="notice section"><b>This is intentional, not a fake result.</b> The app will not display invented win rates, Sharpe, drawdown or 3×/4× hit rates. Those metrics require timestamped historical price + option-chain data, spread/slippage and the exact production gate.</div>
 <div class="rows section"><div class="row"><b>Required validation</b><span>Walk-forward</span><span>Train → validation → unseen test</span><span class="right">Required</span></div><div class="row"><b>Metrics</b><span>Win rate</span><span>PF · expectancy · max DD · Sharpe · 3×/4× hit rate</span><span class="right">Pending</span></div><div class="row"><b>Leakage control</b><span>Strict</span><span>Only information available at signal timestamp</span><span class="right">Required</span></div></div></section>`;
}
function render(){document.getElementById("app").innerHTML=shell();document.getElementById("content").innerHTML=({market,scanner,options,traps,replay,backtest}[state.tab])();}
function go(t){state.tab=t;render()} render();