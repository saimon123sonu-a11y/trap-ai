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
   <div><b>TRAP AI</b><br><small>AI Market Intelligence · Contrarian Engine</small><div class="status">● 5-MIN INTELLIGENCE ENGINE · MULTI-TIMEFRAME GATE</div></div>
   <div style="text-align:right"><div class="label">NEXT 5M CYCLE</div><b id="countdown">05:00</b></div>
  </div>
  <nav class="nav">${["market","scanner","options","traps","backtest"].map(x=>`<button class="${state.tab===x?"active":""}" onclick="go('${x}')">${x==="market"?"MARKET WATCH":x==="scanner"?"TOP 25 F&O":x==="options"?"OPTIONS":x==="traps"?"TOP 3 FADE":"BACKTEST"}</button>`).join("")}</nav>
 </header>
 <main class="main"><div id="content"></div><div class="footer">TRAP AI is an intelligence/research engine. Scores become live only after authenticated market/news data feeds are connected.</div></main>`;
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

function market(){
 return `<div class="hero">
  <section class="card"><div class="label">Market Watch</div><div class="score neutral">—</div>
   <div class="notice"><b>Signal colors</b><br><span class="bear">🔴 RED = immediate actionable candidate</span><br><span class="bull">🟢 GREEN = trend / continuation</span><br><span class="neutral">🟡 YELLOW = reversal watch</span><br><span>⚫ LIQUIDITY-RISK = thesis may be valid, execution unsafe</span></div>
   <p style="color:var(--muted);line-height:1.5">The AI will evaluate global markets, news, macro, FII/DII, participant positioning, futures/options, RSI divergence, technical structure, crowding and liquidity together.</p>
   <div class="notice"><b>FADE LOGIC</b><br>Extreme sentiment alone never triggers a trade. AI must detect crowding + divergence + confirmation and then pass the false-contrarian test.</div>
  </section>
  <section class="card"><div class="label">Decision pipeline</div><h2>Top 2–3 opposite trades</h2><p style="color:var(--muted)">Broad liquid F&O universe → crowding → divergence → multi-timeframe confirmation → liquidity → final AI judgment.</p><button class="action" onclick="go('traps')">Open Top 3</button></section>
 </div>
 ${indexCards()}${regime()}${timeframeGate()}${schedule()}
 <section class="section"><h2>Index Market Watch</h2><div class="rows">${indices.map(x=>`<div class="row"><b>${x[0]}</b><span>Sentiment —</span><span>Regime —</span><span class="right">5M feed pending</span></div>`).join("")}</div></section>`;
}

function scanner(){
 return `<section class="card"><div class="signal"><div><div class="label">Universe</div><h2>Top 25 F&O Market Watch</h2></div><span class="pill">25 STOCKS</span></div>
 <p class="notice">Current rows are UI test values only. Live TRAP AI will recalculate the universe every 5 minutes and apply the weekly → daily → 3H → 1H → 15M → 5M gate.</p>
 <div class="rows">${watch.map((s,i)=>`<div class="row"><b>${i+1}. ${s[0]}<br><small style="color:var(--muted)">${s[1]}</small></b><span class="${s[2]<0?"bear":"bull"}">${s[2]>0?"+":""}${s[2]}</span><span>CR ${s[3]}</span><span class="right">Trap ${s[5]}</span></div>`).join("")}</div></section>`;
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

function backtest(){
 return `<section class="card"><div class="label">Historical replay</div><h2>AI Contrarian Validation</h2><p style="color:var(--muted)">The exact production rule must be replayed using only information available at each historical timestamp. No look-ahead data.</p>
 <div class="grid">${["2007–2009","2016–2018","2020–2022","2024–2026"].map(x=>`<div class="card metric"><span>${x}</span><strong>—</strong><span>Awaiting historical feed</span></div>`).join("")}</div></section>`;
}

function render(){
 state.nextRefresh=Date.now()+300000;
 document.getElementById("app").innerHTML=shell();
 document.getElementById("content").innerHTML=({market,scanner,options,traps,backtest}[state.tab])();
}
function go(t){state.tab=t;render()}
render();