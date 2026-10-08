const state={tab:"market",updated:new Date(),nextRefresh:Date.now()+300000};

setInterval(()=>{
  const el=document.getElementById("countdown");
  if(el) el.textContent=fmt();
},1000);

function fmt(){
  const s=Math.max(0,Math.ceil((state.nextRefresh-Date.now())/1000));
  return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
}

const indices=[
 ["NIFTY 50","NIFTY"],["BANK NIFTY","BANKNIFTY"],["SENSEX","SENSEX"],["MIDCAP NIFTY","MIDCPNIFTY"]
];

const cycles=[
 ["WEEKLY","Major bull/bear regime","20%"],
 ["DAILY","Primary trend & sentiment","20%"],
 ["3-HOUR","Intermediate structure","15%"],
 ["1-HOUR","Current directional bias","15%"],
 ["15-MIN","Setup formation","10%"],
 ["5-MIN","Activation / trigger","20%"]
];

const watch=[
["RELIANCE","Energy",8.4,91,82,88],["HDFCBANK","Banking",7.8,89,79,84],["ICICIBANK","Banking",7.5,87,81,82],
["SBIN","Banking",7.2,86,77,80],["AXISBANK","Banking",6.9,84,76,78],["BHARTIARTL","Telecom",6.7,83,80,77],
["INFY","IT",6.4,81,74,74],["TCS","IT",6.1,79,72,71],["LT","Capital Goods",5.8,78,76,70],
["ITC","FMCG",5.4,77,73,69],["TATAMOTORS","Auto",-6.8,88,67,83],["ADANIENT","Diversified",-6.4,86,71,81],
["JSWENERGY","Power",-6.0,84,69,79],["MARUTI","Auto",-5.6,82,72,76],["BAJFINANCE","Finance",-5.2,80,70,74],
["SUNPHARMA","Pharma",4.9,76,78,68],["HINDALCO","Metals",-4.7,75,68,71],["COALINDIA","Mining",-4.4,73,71,67],
["ONGC","Oil & Gas",-4.1,72,69,65],["TATASTEEL","Metals",-3.8,70,66,63],["M&M","Auto",3.7,69,77,61],
["WIPRO","IT",3.4,68,70,59],["NTPC","Power",3.1,67,73,57],["POWERGRID","Power",2.8,65,75,55],
["HDFCLIFE","Insurance",-2.6,64,62,53]
];

function shell(){
 return `<header class="top">
  <div class="brand">
   <div><b>TRAP AI</b><br><small>AI Market Intelligence · Contrarian Engine</small><div class="status">● 5-MIN INTELLIGENCE ENGINE · MULTI-TIMEFRAME GATE · DECISION CORE LOADED</div></div>
   <div style="text-align:right"><div class="label">NEXT 5M CYCLE</div><b id="countdown">05:00</b></div>
  </div>
  <nav class="nav">${["market","scanner","options","traps","replay","backtest"].map(x=>`<button class="${state.tab===x?"active":""}" onclick="go('${x}')">${x==="market"?"MARKET WATCH":x==="scanner"?"TOP 25 F&O":x==="options"?"OPTIONS":x==="traps"?"TOP 3 FADE":x==="replay"?"TODAY REPLAY":"BACKTEST"}</button>`).join("")}</nav>
 </header>
 <main class="main"><div id="content"></div><div class="footer">TRAP AI decision core is active: reversal + trend + multi-timeframe + RSI/divergence + OI/volume + option-quality + timing overlays. Scores become live only after authenticated market/news data feeds are connected.</div></main>`;
}

function indexCards(){
 return `<div class="grid">${indices.map(x=>`<div class="card metric"><span>${x[0]}</span><strong>—</strong><span>${x[1]} · live feed pending</span></div>`).join("")}</div>`;
}

function timeframeGate(){
 return `<section class="card section"><div class="signal"><div><div class="label">AI time-cycle gate</div><h2>Higher timeframe decides context · 5M decides activation</h2></div><span class="pill">NO ISOLATED 5M SIGNAL</span></div>
 <div class="cycle-grid">${cycles.map((c,i)=>`<div class="cycle ${i===5?"activation":""}"><b>${c[0]}</b><span>${c[1]}</span><em>${c[2]}</em></div>`).join("")}</div>
 <div class="notice"><b>Core rule:</b> Weekly → Daily → 3H → 1H → 15M establish regime, trend, structure and setup. The 5M engine can activate a trade only when the higher-timeframe evidence and the false-contrarian filter agree.</div>
 </section>`;
}

function regime(){
 return `<section class="card section"><div class="label">Bull / Bear intelligence</div><div class="regime-grid">
  <div><span class="label">MARKET REGIME</span><strong class="regime-value">—</strong><small>Awaiting live multi-timeframe data</small></div>
  <div><span class="label">SENTIMENT</span><strong>— / +10</strong><small>AI-derived, not indicator-only</small></div>
  <div><span class="label">TRAP SCORE</span><strong>— / 100</strong><small>Probability of crowding + reversal conditions</small></div>
  <div><span class="label">AI CONFIDENCE</span><strong>—%</strong><small>Evidence agreement + data quality</small></div>
 </div>
 <div class="legend"><span>🐂 BULL +6 to +10</span><span>🟢 BULLISH +3 to +5.9</span><span>⚪ NEUTRAL −2.9 to +2.9</span><span>🔴 BEARISH −3 to −5.9</span><span>🐻 BEAR −6 to −10</span></div>
 </section>`;
}

function schedule(){
 return `<section class="card section"><div class="label">Signal schedule</div><div class="schedule-grid">
  <div><b>09:20</b><span>Opening regime + immediate candidates</span></div>
  <div><b>11:00</b><span>Confirmation / reversal scan</span></div>
  <div><b>12:30</b><span>Midday crowding + trap scan</span></div>
  <div class="priority"><b>15:00</b><span><strong>Next-session: 2–3 best stocks + options</strong></span></div>
 </div><div class="notice">The engine continues 5-minute intelligence between scheduled reports. WhatsApp is the alert channel; this dashboard always shows the latest engine state.</div></section>`;
}

function signalRule(){
 return `<section class="card section"><div class="signal"><div><div class="label">TRAP AI · DECISION ENGINE</div><h2>Trend continuation + contrarian reversal</h2></div><span class="pill">STRICT MULTI-GATE</span></div>
 <div class="grid">
  <div class="card metric"><span>REVERSAL A</span><strong>PUT</strong><span>Crowd &gt;90 · Trap &gt;90 · Extreme Bull + bearish RSI divergence</span></div>
  <div class="card metric"><span>REVERSAL B</span><strong>CALL</strong><span>Crowd &lt;20 · Trap &gt;90 · Extreme Bear + bullish RSI divergence</span></div>
  <div class="card metric"><span>TREND LONG</span><strong>CALL</strong><span>Aligned bullish regime + strong trend + low reversal risk</span></div>
  <div class="card metric"><span>TREND SHORT</span><strong>PUT</strong><span>Aligned bearish regime + strong trend + low reversal risk</span></div>
 </div>
 <div class="notice"><b>TREND-FOLLOWING GATE — CALL:</b> Weekly/Daily bullish regime; 3H and 1H higher-high/higher-low structure; 15M pullback or clean breakout; 5M trigger; RSI generally above 50 and rising; no material bearish RSI divergence; ADX/trend-strength confirmation; volume/OI confirmation; sentiment preferably bullish; crowding not at an extreme reversal zone; Trap Score below the reversal threshold; good liquidity. The engine should prefer continuation after a pullback rather than chase an already-extended candle.</div>
 <div class="notice"><b>TREND-FOLLOWING GATE — PUT:</b> Weekly/Daily bearish regime; 3H and 1H lower-low/lower-high structure; 15M pullback or clean breakdown; 5M trigger; RSI generally below 50 and falling; no material bullish RSI divergence; ADX/trend-strength confirmation; volume/OI confirmation; sentiment bearish; crowding not at an extreme reversal zone; Trap Score below the reversal threshold; good liquidity.</div>
 <div class="notice"><b>REGIME FILTER:</b> ADX is used for trend strength while RSI is used for momentum/exhaustion; neither is sufficient alone. Divergence remains a reversal warning, especially when price makes a new extreme without confirming RSI momentum. This follows established technical-analysis practice.</div>
 <div class="notice"><b>OPTION FILTER:</b> After the underlying direction passes, rank contracts by delta, gamma, theta, vega, IV, spread, depth and expected move. Avoid far-OTM lottery contracts. For the user's 1–3 session horizon, the engine can initially target roughly 0.35–0.50 absolute delta, then optimize this range in backtesting rather than treating it as a fixed rule. Greeks interact, and theta accelerates toward expiry.</div>
 <div class="notice"><b>FINAL CLASSIFIER:</b> REVERSAL → TREND → NO TRADE. A trade is emitted only when the required gate passes and confidence/data quality are sufficient. Otherwise the engine stays silent.</div>
 </section>`;
}

function timingOverlay(){
 return `<section class="card section"><div class="signal"><div><div class="label">TIME-CYCLE & EXPERIMENTAL OVERLAY</div><h2>Time is a filter — never the trigger</h2></div><span class="pill">LOW-WEIGHT RESEARCH LAYER</span></div>
 <div class="grid">
  <div class="card metric"><span>LUNAR PHASE</span><strong>TRACK</strong><span>New / full moon + ±3 trading-day window</span></div>
  <div class="card metric"><span>GANN TIME</span><strong>TRACK</strong><span>Time-cycle / angle confluence with price structure</span></div>
  <div class="card metric"><span>ASTRO OVERLAY</span><strong>TRACK</strong><span>Planetary/calendar timing only</span></div>
  <div class="card metric"><span>WEIGHT</span><strong>LOW</strong><span>Cannot override market evidence</span></div>
 </div>
 <div class="notice"><b>Rule:</b> Lunar, Gann and astrological factors can raise or lower a setup's timing score, but they can never create a trade by themselves. If market structure, RSI/divergence, OI/volume or the multi-timeframe gate disagrees, the result remains <b>NO TRADE</b>.</div>
 <div class="notice"><b>Gann module:</b> test price/time relationships, important anniversaries, swing intervals, 1×1/2×1/1×2 angle relationships and time-cycle clusters. Only retain features that survive out-of-sample testing after transaction costs.</div>
 <div class="notice"><b>Lunar module:</b> record new moon/full moon dates and windows around them, then test NIFTY, BANKNIFTY and F&O stocks separately. The engine will learn whether the effect is actually useful for the Indian market rather than assuming a moon phase is bullish or bearish.</div>
 <div class="notice"><b>Astrological market module:</b> calendar/planetary configurations may be recorded as experimental features, but they receive no directional authority unless repeated walk-forward testing demonstrates statistically significant incremental predictive value.</div>
 </section>`;
}

function sessionReplayHome(){
 return "<section class=\"card section\"><div class=\"signal\"><div><div class=\"label\">LATEST COMPLETED SESSION · 08 OCT 2026</div><h2>Verified market-state snapshot</h2></div><span class=\"pill\">EOD DATA · STRICT GATE</span></div>" +
  "<div class=\"grid\">" +
   "<div class=\"card metric\"><span>NIFTY 50</span><strong class=\"bear\">−1.64%</strong><span>22,231.80 close</span></div>" +
   "<div class=\"card metric\"><span>BANK NIFTY</span><strong class=\"bear\">−0.98%</strong><span>54,515.05 close</span></div>" +
   "<div class=\"card metric\"><span>INDIA VIX</span><strong class=\"bear\">15.31</strong><span>+10.26% · volatility rising</span></div>" +
   "<div class=\"card metric\"><span>FII / DII</span><strong>−12,944 / +10,703 Cr</strong><span>Cash-market net flows</span></div></div>" +
  "<div class=\"notice\"><b>TRAP AI shadow verdict:</b> <span class=\"bear\">BEARISH REGIME / PUT BIAS</span>. The strict production gate does <b>not</b> emit a trade from EOD data alone because timestamp-level 5M trigger, RSI divergence/reversal, live OI/volume and option-quality inputs are unavailable. <b>STRICT RESULT: NO TRADE — INSUFFICIENT TIMESTAMP-LEVEL EVIDENCE.</b></div></section>" +
  "<section class=\"card section\"><div class=\"label\">What the completed session tells us</div><div class=\"rows\">" +
   "<div class=\"row\"><b>Broad trend</b><span class=\"bear\">BEARISH</span><span>Nifty −1.64%; Bank Nifty −0.98%</span><span class=\"right\">Confirmed</span></div>" +
   "<div class=\"row\"><b>Market breadth</b><span class=\"bear\">VERY WEAK</span><span>47/50 Nifty constituents declined</span><span class=\"right\">Confirmed</span></div>" +
   "<div class=\"row\"><b>Institutional flow</b><span class=\"bear\">FII RISK</span><span>FII −₹12,943.58 Cr; DII +₹10,703.11 Cr</span><span class=\"right\">Confirmed</span></div>" +
   "<div class=\"row\"><b>Volatility</b><span class=\"bear\">EXPANDING</span><span>India VIX +10.26% to about 15.31</span><span class=\"right\">Confirmed</span></div>" +
   "<div class=\"row\"><b>Options</b><span class=\"bear\">PUT MOMENTUM</span><span>13-Oct Nifty puts rose sharply into the close</span><span class=\"right\">EOD confirmed</span></div>" +
   "<div class=\"row\"><b>Contrarian test</b><span class=\"neutral\">NOT PASSED</span><span>No verified bearish RSI divergence + price reversal</span><span class=\"right\">No trade</span></div>" +
  "</div></section>";
}
function nextTwoDayWatchlist(){
 return `<section class="card section">
  <div class="signal"><div><div class="label">NEXT 2 TRADING SESSIONS · 09 & 12 OCT 2026</div><h2>TRAP AI Top 10 Review Queue</h2></div><span class="pill">RE-SCORE FIRST 5–10 MIN</span></div>
  <div class="notice"><b>Purpose:</b> these 10 names are the post-close review queue, not pre-authorized trades. At the next session the engine must re-check 1W/1D/3H/1H/15M/5M structure, RSI and divergence, OI/volume, sentiment, crowding, trap, liquidity, catalyst and option quality. If the gate fails, the result is <b>NO TRADE</b>.</div>
  <div class="grid">
   <div class="card metric"><span>REVERSAL #1</span><strong>ADANIENT</strong><span>−5.36%; RSI ~21.7; very weak but deeply oversold</span></div>
   <div class="card metric"><span>REVERSAL #2</span><strong>JSWSTEEL</strong><span>~−4%; RSI ~26; oversold + strong downtrend</span></div>
   <div class="card metric"><span>REVERSAL #3</span><strong>JUBLFOOD</strong><span>−7.16%; extreme one-day weakness</span></div>
   <div class="card metric"><span>REVERSAL #4</span><strong>INOXWIND</strong><span>−6.96%; extreme one-day weakness</span></div>
   <div class="card metric"><span>REVERSAL #5</span><strong>M&amp;M</strong><span>RSI ~8.9; deeply oversold large-cap F&amp;O name</span></div>
   <div class="card metric"><span>TREND #1</span><strong>LICHSGFIN</strong><span>+4.19%; RSI ~65; ADX ~40; strong technical momentum</span></div>
   <div class="card metric"><span>TREND #2</span><strong>ICICIGI</strong><span>+2.14%; positive moving-average/RSI structure</span></div>
   <div class="card metric"><span>TREND #3</span><strong>AXISBANK</strong><span>+2.50%; held up while Nifty fell 1.64%</span></div>
   <div class="card metric"><span>TREND #4</span><strong>TECHM</strong><span>+0.44%; relative strength on a broad risk-off day</span></div>
   <div class="card metric"><span>TREND #5</span><strong>INFY</strong><span>+0.21%; relative strength, but trend confirmation still required</span></div>
  </div>
  <div class="notice"><b>REVERSAL gate:</b> no CALL is allowed merely because RSI is oversold. It must additionally show bearish regime/crowding conditions, <b>Trap &gt;90</b>, the appropriate extreme sentiment, <b>bullish RSI divergence</b>, price reversal, multi-timeframe confirmation and acceptable liquidity. The same principle applies symmetrically to PUT reversals.</div>
  <div class="notice"><b>TREND gate:</b> for the five relative-strength names, the engine should prefer CALL continuation only if Weekly/Daily regime, 3H/1H structure, 15M setup and 5M trigger align, RSI is supportive, OI/volume confirms and reversal risk remains below threshold. Do not chase a gap/extended candle.</div>
  <div class="notice"><b>Ranking rule:</b> these are ranked by current evidence quality, not promised return. A 3×–4× option move remains an opportunity target, never a guaranteed outcome. Option selection comes only after the underlying passes.</div>
 </section>`;
}


function volatilityRegime(){
 return `<section class="card section">
  <div class="signal"><div><div class="label">VIX + VOLATILITY REGIME ENGINE</div><h2>Next 3–4 hour market-behaviour forecast</h2></div><span class="pill">5-MIN ENGINE · HIGH PRIORITY</span></div>
  <div class="grid">
   <div class="card metric"><span>INDIA VIX</span><strong>—</strong><span>Live feed pending</span></div>
   <div class="card metric"><span>VIX MOMENTUM</span><strong>—</strong><span>5M / 15M / 1H acceleration</span></div>
   <div class="card metric"><span>MARKET MODE</span><strong>—</strong><span>Trend / range / volatility expansion</span></div>
   <div class="card metric"><span>3–4H CONFIDENCE</span><strong>—%</strong><span>Regime confidence, not price certainty</span></div>
  </div>
  <div class="rows">
   <div class="row"><b>VIX → NIFTY relationship</b><span>—</span><span>Price/VIX divergence, acceleration and volatility expansion</span><span class="right">Pending</span></div>
   <div class="row"><b>Options volatility</b><span>—</span><span>ATM IV, skew, PCR, OI concentration and expected move</span><span class="right">Pending</span></div>
   <div class="row"><b>Risk inputs</b><span>—</span><span>Global indices, USDINR, crude, yields, VIX and major news</span><span class="right">Pending</span></div>
   <div class="row"><b>Structure</b><span>—</span><span>Weekly → Daily → 3H → 1H → 15M → 5M confirmation</span><span class="right">Pending</span></div>
  </div>
  <div class="notice"><b>Regime classifier:</b> STAGNANT / RANGE · TRENDING UP · TRENDING DOWN · VOLATILE / WHIPSAW · VOLATILITY EXPANSION · UNSTABLE / NO-TRADE. India VIX receives a high weight, but it cannot determine direction by itself.</div>
  <div class="notice"><b>Important distinction:</b> TRAP AI separately estimates <b>direction</b> and <b>movement intensity</b>. A neutral direction with extreme volatility is not the same as a stagnant neutral market. This is especially important for option theta and IV expansion.</div>
 </section>`;
}

function liveNewsPanel(){
 return `<section class="card section">
  <div class="signal"><div><div class="label">NEWS + MACRO INTELLIGENCE</div><h2>Normal web-news layer</h2></div><span class="pill">5-MIN REFRESH TARGET</span></div>
  <div class="notice"><b>Feed status:</b> browser page currently runs as a static GitHub Pages app. It can display authenticated backend data later, but it cannot securely hold broker/API secrets. Once a backend feed is attached, TRAP AI will normalize news, remove duplicates, score relevance/sentiment and feed only material information into the decision engine.</div>
  <div class="rows">
   <div class="row"><b>Indian market news</b><span>—</span><span>NSE/BSE/company/regulatory and major financial-news events</span><span class="right">Feed pending</span></div>
   <div class="row"><b>Global macro</b><span>—</span><span>US/global indices, yields, crude, FX, volatility and central-bank events</span><span class="right">Feed pending</span></div>
   <div class="row"><b>Event impact</b><span>—</span><span>AI classifies bullish / bearish / neutral / shock and estimates market relevance</span><span class="right">Feed pending</span></div>
   <div class="row"><b>News freshness</b><span>—</span><span>New material events force an immediate intelligence refresh</span><span class="right">Event-driven</span></div>
  </div>
 </section>`;
}

function market(){
 const indicesNow=[
  ["NIFTY 50","22,231.80","−1.64%","BEARISH"],
  ["BANK NIFTY","54,515.05","−0.98%","BEARISH"],
  ["MIDCAP NIFTY","57,882.50","−2.53%","BEARISH"],
  ["FIN NIFTY","24,640.45","−1.11%","BEARISH"]
 ];
 const bearish=[
  ["ADANIENT","−6.4","86","71","81"],
  ["JSWSTEEL","−6.0","84","69","79"],
  ["M&M","−5.2","69","77","61"],
  ["JUBLFOOD","−4.8","82","74","76"]
 ];
 const bullish=[
  ["LICHSGFIN","+6.1","64","78","82"],
  ["ICICIGI","+5.4","58","76","79"],
  ["AXISBANK","+4.8","54","73","77"],
  ["TECHM","+3.7","49","70","72"]
 ];
 const table=(rows,side)=>`<div class="signal-table">
  <div class="tr head"><b>STOCK</b><b>SENTIMENT</b><b>TRAP</b><b>TECH</b><b>AI</b></div>
  ${rows.map((x,i)=>`<div class="tr"><b>${i+1}. ${x[0]}</b><strong class="${side==="bear"?"bear":"bull"}">${x[1]}</strong><span>${x[2]}</span><span>${x[3]}</span><span class="score-mini ${side==="bear"?"bear":"bull"}">${x[4]}</span></div>`).join("")}
 </div>`;
 return `<section class="card market-head">
   <div><div class="label">TRAP AI · MARKET COMMAND</div><h1>Market Now</h1></div>
   <div class="live-badge">● 5M ENGINE</div>
 </section>
 <section class="index-strip">${indicesNow.map(x=>`<div class="index-card"><span>${x[0]}</span><strong>${x[1]}</strong><em class="bear">${x[2]}</em><small>${x[3]}</small></div>`).join("")}</section>
 <section class="card signal-section">
   <div class="signal"><h2>🔴 Bearish AI Signals</h2><span class="pill">TOP 4</span></div>
   ${table(bearish,"bear")}
 </section>
 <section class="card signal-section">
   <div class="signal"><h2>🟢 Bullish AI Signals</h2><span class="pill">TOP 4</span></div>
   ${table(bullish,"bull")}
 </section>
 <section class="card compact-status">
   <div><b>AI REGIME</b><span class="bear">BEARISH / HIGH RISK</span></div>
   <div><b>INDIA VIX</b><span>15.31 · rising</span></div>
   <div><b>3–4H OUTLOOK</b><span>Trend / volatility watch</span></div>
   <div><b>NEXT SCAN</b><span id="countdown">05:00</span></div>
 </section>
 <div class="tiny-note">Scores shown are current shadow/test values until authenticated live market + news feeds are connected. No signal is a guaranteed trade.</div>`;
}
function scanner(){
 return `<section class="card"><div class="signal"><div><div class="label">Universe</div><h2>Top 25 F&O Market Watch</h2></div><span class="pill">25 STOCKS · SHADOW DATA</span></div>
 <p class="notice">Current rows are UI test values only. Live TRAP AI will recalculate the universe every 5 minutes and apply the weekly → daily → 3H → 1H → 15M → 5M gate.</p>
 <div class="rows">${watch.map((s,i)=>`<div class="row"><b>${i+1}. ${s[0]}<br><small style="color:var(--muted)">${s[1]}</small></b><span class="${s[2]<0?"bear":"bull"}">Sentiment ${s[2]>0?"+":""}${s[2]}</span><span>Crowding ${s[3]}/100</span><span class="right">Trap ${s[5]}/100</span></div>`).join("")}</div></section>`;
}

function options(){
 return `<section class="card"><div class="label">Option intelligence</div><h2>Best asymmetric opportunities</h2>
 <div class="notice">Underlying direction is evaluated first. Only then does the AI select an option using delta, IV, gamma, theta, vega, expiry, spread, depth, OI and expected move.</div>
 <div class="rows">${[["NIFTY","Direction pending","OOS —"],["BANKNIFTY","Direction pending","OOS —"],["Top F&O stock","Direction pending","OOS —"]].map(x=>`<div class="row"><b>${x[0]}</b><span>${x[1]}</span><span>${x[2]}</span><span class="right">No live trade</span></div>`).join("")}</div></section>`;
}

function traps(){
 const top=[...watch].sort((a,b)=>b[3]+b[5]-a[3]-a[5]).slice(0,3);
 return `<section class="card"><div class="label">AI contrarian radar</div><h2>Top 3 crowding + trap candidates</h2>
 <p class="notice">Illustrative UI values only. A candidate becomes 🔴 only after multi-timeframe confirmation, RSI divergence/technical evidence, positioning evidence, liquidity checks and the false-contrarian filter.</p>
 <div class="rows">${top.map((s,i)=>`<div class="card"><div class="signal"><b>#${i+1} ${s[0]}</b><span class="pill">Crowding ${s[3]}</span></div><p style="color:var(--muted)">Sentiment ${s[2]>0?"+":""}${s[2]} · Technical ${s[4]} · Trap ${s[5]}</p><div class="bar"><i style="width:${s[3]}%"></i></div><p style="font-size:12px;color:var(--muted)">AI checks: RSI divergence → OI/FII divergence → structure → catalyst → liquidity → false-contrarian test.</p></div>`).join("")}</div></section>`;
}

function replay(){
 return `<section class="card"><div class="signal"><div><div class="label">LATEST COMPLETED SESSION · 08 OCT 2026</div><h2>TRAP AI Shadow Replay</h2></div><span class="pill">RETROSPECTIVE · NOT A LIVE SIGNAL</span></div>
 <div class="notice"><b>Important:</b> this is a verified market-outcome replay, not a claim that TRAP AI actually issued these intraday signals. The current app did not have a connected historical 5-minute feed on 08-Oct. Exact 09:20 / 11:00 / 12:30 / 15:00 entries and option P&L therefore remain <b>unverified</b>.</div>
 <div class="grid">
  <div class="card metric"><span>NIFTY 50</span><strong>−1.64%</strong><span>22,599.05 open → 22,231.80 close</span></div>
  <div class="card metric"><span>BANK NIFTY</span><strong>−0.98%</strong><span>55,042.90 open → 54,515.05 close</span></div>
  <div class="card metric"><span>INDIA VIX</span><strong>+10.0%</strong><span>≈15.28 close · volatility expanded</span></div>
  <div class="card metric"><span>FII / DII</span><strong>−12,944 / +10,703 Cr</strong><span>Combined market data</span></div>
 </div></section>
 <section class="card section"><div class="label">What the engine would have seen</div><div class="rows">
  <div class="row"><b>Macro / regime</b><span class="bear">BEARISH</span><span>Oil + yields + rupee + hawkish RBI pressure</span><span class="right">Confirmed</span></div>
  <div class="row"><b>Market breadth</b><span class="bear">BEARISH</span><span>47/50 Nifty stocks declined</span><span class="right">Confirmed</span></div>
  <div class="row"><b>Positioning</b><span class="bear">FII RISK</span><span>Heavy FII selling; DII buying partly cushioned</span><span class="right">Confirmed</span></div>
  <div class="row"><b>Options</b><span class="bear">PUT MOMENTUM</span><span>13-Oct Nifty puts showed very large gains</span><span class="right">Confirmed EOD</span></div>
  <div class="row"><b>Contrarian filter</b><span class="neutral">CAUTION</span><span>Oversold conditions mean shorting blindly is unsafe</span><span class="right">AI gate required</span></div>
 </div></section>
 <section class="card section"><div class="label">Scheduled signal reconstruction</div><div class="rows">
  <div class="row"><b>09:20</b><span class="pill">UNVERIFIED</span><span>Opening scan requires 5M candles + live OI/IV</span><span class="right">No invented signal</span></div>
  <div class="row"><b>11:00</b><span class="pill">UNVERIFIED</span><span>Confirmation/reversal scan requires intraday state</span><span class="right">No invented signal</span></div>
  <div class="row"><b>12:30</b><span class="pill">UNVERIFIED</span><span>Crowding/trap scan requires intraday OI + divergence</span><span class="right">No invented signal</span></div>
  <div class="row"><b>15:00</b><span class="pill">DIRECTIONAL BEARISH</span><span>Next-session risk remained bearish, but stock-level top-3 requires full feed</span><span class="right">Shadow verdict</span></div>
 </div></section>
 <section class="card section"><div class="label">If a bearish NIFTY option signal had been activated</div><h2>Outcome: potentially profitable, exact return not yet provable</h2>
  <p style="color:var(--muted);line-height:1.6">NSE's closing option snapshot shows 13-Oct-2026 NIFTY puts had very large gains: 22,200 PE +335.36%, 22,300 PE +296.98%, 22,500 PE +215.87%, and 22,000 PE +364.39%. These are <b>full-session close-to-close changes</b>, not the return from a TRAP AI entry. A real backtest must use the option price at the exact signal timestamp, spread, slippage and exit rule.</p>
 </section>`;
}

function backtest(){
 return `<section class="card"><div class="label">Historical replay</div><h2>AI Contrarian Validation</h2><p style="color:var(--muted)">The exact production rule must be replayed using only information available at each historical timestamp. No look-ahead data.</p>
 <div class="grid">${["2007–2009","2016–2018","2020–2022","2024–2026"].map(x=>`<div class="card metric"><span>${x}</span><strong>—</strong><span>Awaiting historical feed</span></div>`).join("")}</div></section>`;
}

function render(){
 state.nextRefresh=Date.now()+300000;

 document.getElementById("app").innerHTML=shell();
 document.getElementById("content").innerHTML=({market,scanner,options,traps,replay,backtest}[state.tab])();
}
function go(t){state.tab=t;render()}
render();