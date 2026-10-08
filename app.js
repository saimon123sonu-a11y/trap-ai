const state={
  tab:"market",
  query:"",
  researchSymbol:"",
  research:null,
  updated:new Date("2026-10-08T15:30:00+05:30")
};

const marketData={
  nifty:{value:"22,231.80",move:"−1.64%",direction:"BEARISH",sentiment:"−7.2",confidence:"86%"},
  sensex:{value:"72,404.17",move:"−1.55%",direction:"BEARISH",sentiment:"−6.4",confidence:"81%"},
  bank:{value:"54,515.05",move:"−0.98%",direction:"BEARISH",sentiment:"−7.6",confidence:"88%"},
  vix:{value:"15.25",move:"+1.35%",direction:"VOLATILITY UP",sentiment:"—",confidence:"91%"}
};

const TRAP_DATA={
  research:{
    HDFCBANK:{
      symbol:"HDFCBANK",dataStatus:"EOD_SNAPSHOT",asOf:"2026-10-08T15:15:00+05:30",
      price:692.25,return1d:-1.49,return5d:-4.11,rsi:34.2,rsiBias:-3.2,volume:26808765,oi:0,oiBias:-2.5,
      relativeStrength:-2.8,priceVsSma20:-3.4,priceVsSma50:-5.8,structure:28,regime:25,divergence:58,oiVolume:32,options:72,
      sentimentQuality:88,agreement:82,liquidity:92,catalyst:55,macro:38,sentimentScore:-5.9,direction:"BEARISH",
      trendStrength:81,reversalProbability:57,crowdingSide:"CALL-heavy; 720 immediate OI resistance, 700 put wall/support; PCR ~0.49",
      crowdingDivergence:false,falseContrarianRisk:63,optionSuitable:true,tradeSide:"PUT",gate:"WAIT → PUT IF BREAKDOWN",
      bestStrike:"₹700 PE candidate",iv:30.1,expectedMove:24.16,breakout:705.8,breakdown:690.5,invalidation:705.8,
      target1:681.9,target2:668.1,holding:"1–3 sessions",trigger5m:70,
      optionReason:"08 Oct EOD chain: spot ₹692.25, PCR ~0.49, max pain ₹720, call wall ₹750 and put wall ₹700. ₹700 PE is the near-ATM faster-response candidate, but live spread, delta, depth and 5M confirmation must be checked before entry.",
      newsFactor:"Mixed-to-negative: CEO transition created short-term uncertainty, while Q2 loan/deposit growth and broker long-term views are supportive.",
      conclusion:"NEXT-DAY PLAN: WATCH ₹690.50 BREAKDOWN → PUT ONLY WITH 5M CONFIRMATION; ABOVE ₹705.80 INVALIDATES",
      backtestStatus:"NOT RUN: historical option-chain dataset is not connected"
    },ADANIENT:{
      symbol:"ADANIENT",dataStatus:"EOD_SNAPSHOT",asOf:"2026-10-08T15:59:00+05:30",
      price:2596,return1d:-5.36,return5d:-10.59,rsi:31.12,rsiBias:-4.0,volume:4400475,oi:0,oiBias:-3.0,optionChain:true,
      relativeStrength:-8.6,priceVsSma20:-11.6,priceVsSma50:-12.8,structure:18,regime:30,divergence:45,oiVolume:25,options:78,
      sentimentQuality:88,agreement:91,liquidity:90,catalyst:35,macro:32,sentimentScore:-7.7,direction:"BEARISH",
      trendStrength:88,reversalProbability:61,
      crowdingSide:"CALL-heavy; immediate OI resistance ₹2,800; put support ₹2,700; PCR ~0.53; max pain ₹2,750",
      crowdingDivergence:false,falseContrarianRisk:68,optionSuitable:true,tradeSide:"PUT",gate:"WAIT → PUT IF ₹2,541.50 BREAKS",
      bestStrike:"₹2,600 PE candidate",iv:48.5,expectedMove:"₹2,450–₹2,741.91",breakout:2617.3,breakdown:2541.5,invalidation:2700,
      target1:2482.1,target2:2450,holding:"1–3 sessions",trigger5m:70,
      optionReason:"08 Oct EOD chain: spot ₹2,596, PCR ~0.53, max pain ₹2,750, call wall ₹2,800–₹2,900 and put support around ₹2,700/₹2,600. ₹2,600 PE is the near-ATM candidate; live delta, spread, depth and 5M confirmation must still be checked before entry.",
      newsFactor:"Company fundamentals remain mixed-positive: FY26 revenue was ₹1,02,943 crore and 80% of EBITDA came from core infrastructure/utility businesses, while the immediate market session was sharply risk-off. Recent company disclosures include investor/analyst interactions on 7 Oct 2026.",
      conclusion:"NEXT-DAY PLAN: BEARISH CONTINUATION BIAS — WAIT FOR 5M BREAKDOWN BELOW ₹2,541.50; IF SUPPORT HOLDS WITH BULLISH RSI DIVERGENCE, CANCEL PUT AND REASSESS FOR REVERSAL",
      backtestStatus:"NOT RUN: historical option-chain dataset is not connected"
    },ONE97:{
      symbol:"ONE97",dataStatus:"EOD_SNAPSHOT",asOf:"2026-10-08T15:59:00+05:30",
      price:1641.5,return1d:-5.23,return5d:2.91,
      rsi:54.85,rsiBias:-0.5,return1dBias:-5.23,
      volume:17399709,oi:17561675,oiBias:-0.4,
      relativeStrength:-3.6,priceVsSma20:-5.2,priceVsSma50:0.4,
      structure:25,regime:25,divergence:50,oiVolume:35,options:68,
      sentimentQuality:82,agreement:78,liquidity:78,catalyst:20,macro:30,
      direction:"BEARISH",trendStrength:82,reversalProbability:48,
      crowdingSide:"CALL-OI resistance at ₹1,700–₹1,800; put support near ₹1,600–₹1,660",
      crowdingDivergence:false,
      optionSuitable:true,tradeSide:"PUT",gate:"WAIT → PUT IF BREAKDOWN",
      bestStrike:"₹1,650 PE candidate",iv:49.8,expectedMove:94.72,
      breakout:1671.4,breakdown:1558.8,invalidation:1671.4,target1:1512.7,target2:1466.7,
      holding:"1–3 sessions",trigger5m:70,
      optionReason:"EOD chain shows PCR ~0.81, max pain ₹1,660, call wall ₹1,700/₹1,800 and put wall ₹1,600. For a bearish continuation, ₹1,650 PE is a faster candidate than a deep OTM put, but live delta, spread, depth and 5M timing must be rechecked before entry.",
      conclusion:"WAIT — PUT ONLY AFTER 5M BREAKDOWN + FRESH OI/VOLUME CONFIRMATION",
      backtestStatus:"NOT RUN: historical option-chain dataset is not connected"
    }
  }
};
window.TRAP_DATA=TRAP_DATA;
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

function scoreClass(v){return String(v).startsWith("+")?"bull":String(v).startsWith("−")?"bear":"neutral";}
function fmt(v){return v===null||v===undefined||v===""?"—":String(v);}
function normalizeSymbol(s){
  const q=String(s||"").trim().toUpperCase().replace(/[^A-Z0-9&./-]/g,"");
  const aliases={"PAYTM":"ONE97","ONE97COMM":"ONE97","ONE97":"ONE97","M&M":"M&M","NIFTY50":"NIFTY","BANKNIFTY":"BANKNIFTY","S&P500":"SPX","SP500":"SPX","NASDAQ":"NDX","DOWJONES":"DJI","BITCOIN":"BTC","ETHEREUM":"ETH","USD/INR":"USDINR","USD-INR":"USDINR","EUR/USD":"EURUSD","GBP/USD":"GBPUSD"};
  return aliases[q]||q;
}
function detectAssetClass(symbol){
  const s=String(symbol||"").toUpperCase();
  if(["BTC","ETH","SOL","BNB","XRP","DOGE","ADA","AVAX"].includes(s)) return "CRYPTO";
  if(/^(USDINR|EURUSD|GBPUSD|USDJPY|AUDUSD|USDCAD|USDCHF|NZDUSD)$/.test(s)) return "FOREX";
  if(["NIFTY","BANKNIFTY","FINNIFTY","MIDCPNIFTY","SPX","NDX","DJI","DAX","FTSE","NIKKEI"].includes(s)) return "INDEX";
  if(["AAPL","MSFT","NVDA","AMZN","META","GOOGL","GOOG","TSLA","AMD","NFLX","AVGO","AMAT","INTC"].includes(s)) return "US EQUITY";
  return "INDIA F&O / EQUITY";
}
function researchScopeLabel(asset){
  return asset==="INDIA F&O / EQUITY"?"🇮🇳 INDIA F&O / EQUITY":asset==="US EQUITY"?"🇺🇸 US EQUITY":asset==="FOREX"?"💱 FOREX":asset==="CRYPTO"?"₿ CRYPTO":asset==="INDEX"?"📊 INDEX":"MARKET";
}
function liveResearch(symbol){
  const data=(window.TRAP_DATA&&window.TRAP_DATA.research)||{};
  const raw=data[symbol]||data[symbol.toUpperCase()];
  if(raw)return window.TRAP_ENGINE.researchAnalyze({...raw,symbol});
  return window.TRAP_ENGINE.researchAnalyze({
    symbol,
    dataStatus:"RESEARCH_PENDING",
    asOf:new Date().toISOString(),
    price:null,return1d:null,return5d:null,rsi:null,volume:null,oi:null,
    relativeStrength:null,priceVsSma20:null,priceVsSma50:null,
    structure:null,regime:null,divergence:null,oiVolume:null,options:null,
    sentimentQuality:null,agreement:null,liquidity:null,catalyst:null,macro:null,
    sentimentScore:0,direction:"NEUTRAL",trendStrength:null,reversalProbability:null,
    crowdingSide:"PENDING LIVE DATA",crowdingDivergence:false,falseContrarianRisk:null,
    optionSuitable:false,tradeSide:"WAIT",gate:"WAIT FOR LIVE DATA",
    bestStrike:"NOT CALCULATED",iv:null,expectedMove:null,breakout:null,breakdown:null,
    invalidation:null,target1:null,target2:null,holding:"NOT CALCULATED",trigger5m:null,
    optionReason:"Live market, options and intraday feeds are required for contract selection.",
    newsFactor:"AI research request accepted; live news feed pending.",
    conclusion:"RESEARCH REQUEST ACCEPTED — LIVE DATA REQUIRED FOR FINAL TRADE GATE",
    backtestStatus:"NOT RUN: historical option-chain dataset is not connected"
  });
}
function marketSession(){ const d=new Date(); const day=d.getDay(); const mins=d.getHours()*60+d.getMinutes(); return day>=1&&day<=5&&mins>=555&&mins<=930?"MARKET_OPEN":"AFTER_HOURS"; }
function researchLookup(){
  const symbol=normalizeSymbol(state.query);
  if(!symbol)return;
  state.researchSymbol=symbol;
  state.research=liveResearch(symbol);
  state.research.assetClass=detectAssetClass(symbol);
  state.research.scopeLabel=researchScopeLabel(state.research.assetClass);
  state.tab="research";
  render();
  setTimeout(()=>document.getElementById("researchSearch")?.focus(),0);
}

function shell(){
 return `<header class="top">
  <div class="brand"><div><b>TRAP AI</b><br><small>AI Market Intelligence · Decision System</small><div class="status">● RESEARCH BUILD · LIVE BACKEND NOT CONNECTED</div></div><div class="mode"><span>NEXT-DAY ENGINE</span><b>SCAN → PRACTICE → POST</b></div></div>
  <nav class="nav">
   <button class="${state.tab==="market"?"active":""}" onclick="go('market')">1 · MARKET WATCH</button>
   <button class="${state.tab==="options"?"active":""}" onclick="go('options')">2 · STOCK OPTIONS</button>
   <button class="${state.tab==="stocks"?"active":""}" onclick="go('stocks')">3 · STOCK INFORMATION</button>
   <button class="${state.tab==="research"?"active":""}" onclick="go('research')">4 · RESEARCH</button>
  </nav>
 </header>
 <main class="main"><div id="content"></div><div class="footer">EOD research snapshot: 08 Oct 2026. Research search is wired to the TRAP AI backend contract but live market/option feeds are not connected in this GitHub Pages build. No fabricated current-session value is displayed.</div></main>`;
}

function sentimentLabel(v){const n=Number(v);return n>=8?"EXTREME BULLISH":n>=5?"BULLISH":n>=2?"MILD BULLISH":n>-2?"NEUTRAL":n>-5?"MILD BEARISH":n>-8?"BEARISH":"EXTREME BEARISH";}
function sentimentPanel(){const vals=[Number(marketData.nifty.sentiment),Number(marketData.sensex.sentiment),Number(marketData.bank.sentiment)].filter(Number.isFinite);const composite=vals.reduce((x,y)=>x+y,0)/vals.length;return '<section class="card section"><div class="table-title"><h2>Market sentiment synthesis</h2><span class="pill">'+sentimentLabel(composite)+'</span></div><div class="sentiment-hero"><div><span>COMPOSITE INDIA SENTIMENT</span><strong class="'+(composite>=0?"bull":"bear")+'">'+composite.toFixed(1)+' / 10</strong></div><div><span>REGIME</span><strong>'+(composite<=-5?"RISK-OFF / BEARISH":composite>=5?"RISK-ON / BULLISH":"MIXED / NEUTRAL")+'</strong></div><div><span>VOLATILITY</span><strong>'+(marketData.vix.move.startsWith("+")?"RISING":"STABLE")+'</strong></div></div><div class="notice section"><b>Sentiment rule:</b> low RSI is not automatically bullish and high crowding is not automatically bearish. Direction must agree across regime, price structure, RSI/divergence, OI/volume, options, liquidity, catalyst and macro. Conflicting evidence produces WAIT/NO TRADE.</div></section>';}
function indexRow(label,d){
 return `<div class="market-row"><b>${label}</b><span>${d.value}</span><span class="${d.move.startsWith("+")?"bull":"bear"}">${d.move}</span><span>${d.direction}</span><span class="${scoreClass(d.sentiment)}">${d.sentiment}</span><span>${d.confidence}</span></div>`;
}

function market(){
 return `<section class="page-head"><div><div class="label">PAGE 1 · MARKET WATCH</div><h1>Market Watch</h1><p>Global context is analysed first; only the final India/index decision is shown here.</p></div><span class="live-badge">INDEX + BEST INDEX OPTION</span></section>
 <section class="card"><div class="table-title"><h2>Index decision table</h2><span class="pill">NIFTY · SENSEX · BANK NIFTY · VIX</span></div>
  <div class="market-table"><div class="market-row head"><b>INSTRUMENT</b><b>LEVEL</b><b>CHANGE</b><b>DIRECTION</b><b>SENTIMENT</b><b>AI CONF.</b></div>
   ${indexRow("NIFTY 50",marketData.nifty)}${indexRow("SENSEX",marketData.sensex)}${indexRow("BANK NIFTY",marketData.bank)}${indexRow("INDIA VIX",marketData.vix)}
  </div></section>
 ${sentimentPanel()}
 <section class="card section"><div class="table-title"><h2>Best index option — engine output</h2><span class="pill">UNDERLYING → CONTRACT → TIMING</span></div>
  <div class="option-decision"><div><span>INDEX</span><strong>NIFTY</strong></div><div><span>BEST OPTION</span><strong class="pending">PENDING LIVE CHAIN</strong></div><div><span>EXPECTED ENTRY</span><strong class="pending">NOT CALCULATED</strong></div><div><span>EXPECTED EXIT</span><strong class="pending">NOT CALCULATED</strong></div><div><span>HOLDING</span><strong class="pending">NOT CALCULATED</strong></div></div>
  <div class="notice section"><b>Selection sequence:</b> global risk regime → USD/INR → crude → BTC/ETH → world indices → yields/DXY → India VIX → NIFTY structure → RSI/divergence → OI/volume → option IV/Greeks → OI concentration + fresh activity → spread/depth → 5M trigger → historical validation. Highest OI alone never selects the contract.</div>
  <div class="decision-gate section"><b>Current display:</b> NO TRADE / NO CONTRACT POSTED because live option-chain and timestamp-safe timing data are not connected.</div>
 </section>
 <section class="card section"><div class="table-title"><h2>Global intelligence layer</h2><span class="pill">BACKEND INPUTS</span></div>
  <div class="global-grid"><div><b>WORLD MARKETS</b><span>US · Europe · Asia</span></div><div><b>COMMODITIES</b><span>Crude · Gold</span></div><div><b>CRYPTO</b><span>BTC · ETH</span></div><div><b>FX / RATES</b><span>USD · DXY · USD/INR · yields</span></div><div><b>VOLATILITY</b><span>India VIX + expected move</span></div><div><b>OUTPUT</b><span>30m · 3h · next-session regime</span></div></div>
 </section>`;
}

function optionResearchRow(x){
 return `<div class="stock-option-row"><b>${x.symbol}</b><span class="${x.direction==="BULLISH"?"bull":"bear"}">${x.direction}</span><span class="${scoreClass(x.sentiment)}">${x.sentiment}</span><span>${x.confidence}</span><span class="pending">LIVE CHAIN</span><span class="pending">OI + ACTIVITY PENDING</span><span class="pending">TIMING PENDING</span></div>`;
}
function options(){
 return `<section class="page-head"><div><div class="label">PAGE 2 · STOCK OPTIONS</div><h1>Stock Options</h1><p>Research board: the engine finds the strongest underlying first, then selects the most active/liquid option contract.</p></div><span class="live-badge">RESEARCH ONLY</span></section>
 <section class="card"><div class="option-rules"><div><b>1</b><span>Underlying direction first</span></div><div><b>2</b><span>Highest-quality active option zone</span></div><div><b>3</b><span>OI + fresh activity + liquidity</span></div><div><b>4</b><span>IV + Greeks + expected move</span></div><div><b>5</b><span>Timing window calculated</span></div></div>
  <div class="notice section"><b>Contract rule:</b> maximum OI alone is never enough. The engine combines OI, change in OI, volume, turnover, spread, depth, delta, gamma, theta, vega, IV, expiry, expected move and agreement with the underlying thesis.</div>
  <div class="signal-section"><div class="table-title"><h2>15-stock option research pool</h2><span class="pill">NO ORDERS</span></div>
   <div class="stock-option-table"><div class="stock-option-row head"><b>STOCK</b><b>BIAS</b><b>SENTIMENT</b><b>AI CONF.</b><b>BEST OPTION</b><b>OI / ACTIVITY</b><b>ENTRY / EXIT</b></div>${stockPool.map(optionResearchRow).join("")}</div>
  </div></section>`;
}

function stockRow(x){
 return `<div class="stock-info-row"><b>${x.symbol}</b><span>${x.direction}</span><span>${x.move}</span><span class="${scoreClass(x.sentiment)}">${x.sentiment}</span><span>${x.confidence}</span><span class="pending">${x.status}</span></div>`;
}
function stocks(){
 return `<section class="page-head"><div><div class="label">PAGE 3 · STOCK INFORMATION</div><h1>Stock Information · Next-Day Plan</h1><p>150-stock scan → 15 candidates → practice/validation → only then publish the next-day plan.</p></div><span class="live-badge">VALIDATION GATE</span></section>
 <section class="card"><div class="summary-grid"><div><span>UNIVERSE</span><strong>150</strong><small>Liquid F&O working universe</small></div><div><span>SHORTLIST</span><strong>15</strong><small>5 bearish + 5 bullish + 5 reversal</small></div><div><span>VISIBLE OUTPUT</span><strong>SENTIMENT</strong><small>+ AI Confidence only</small></div><div><span>POSTING RULE</span><strong>PRACTICE FIRST</strong><small>Never fabricate a next-day plan</small></div></div></section>
 <section class="card section"><div class="table-title"><h2>15-stock research pool</h2><span class="pill">NOT A BUY LIST</span></div><div class="stock-info-table"><div class="stock-info-row head"><b>STOCK</b><b>BIAS</b><b>MOVE</b><b>SENTIMENT</b><b>AI CONF.</b><b>PLAN STATUS</b></div>${stockPool.map(stockRow).join("")}</div></section>
 <section class="card section"><div class="table-title"><h2>Validated next-day plan</h2><span class="pill">POST ONLY AFTER PRACTICE</span></div><div class="plan-grid"><div><span>BEST STOCK</span><strong class="pending">NOT POSTED</strong></div><div><span>BEST OPTION</span><strong class="pending">NOT POSTED</strong></div><div><span>ENTRY WINDOW</span><strong class="pending">NOT POSTED</strong></div><div><span>EXPECTED EXIT</span><strong class="pending">NOT POSTED</strong></div><div><span>HOLDING</span><strong class="pending">NOT POSTED</strong></div><div><span>AI CONFIDENCE</span><strong class="pending">NOT POSTED</strong></div></div><div class="notice section"><b>NO VALIDATED BUY PLAN POSTED.</b> Historical option/OI/intraday backend is not connected, so no honest contract, entry time, exit time or next-day BUY/PUT/CALL can be published.</div></section>
 <section class="card section"><div class="table-title"><h2>Validation sequence</h2><span class="pill">ALL MUST PASS</span></div><div class="validation-grid"><div><b>01 · GLOBAL REGIME</b><span>World indices, crude, BTC/ETH, USD/INR, DXY, yields and event risk.</span></div><div><b>02 · MULTI-TIMEFRAME</b><span>1W → 1D → 3H → 1H → 15M → 5M.</span></div><div><b>03 · RSI / DIVERGENCE</b><span>Continuation and reversal are kept separate.</span></div><div><b>04 · OI / VOLUME</b><span>Fresh positioning must confirm the thesis.</span></div><div><b>05 · OPTION ACTIVITY</b><span>Best active/liquid contract, not simply maximum OI.</span></div><div><b>06 · TIMING MODEL</b><span>Forecast activation and expected exit windows.</span></div><div><b>07 · HISTORICAL PRACTICE</b><span>Walk-forward, timestamp-safe, no look-ahead.</span></div><div><b>08 · FINAL GATE</b><span>Trigger + liquidity + invalidation + acceptable risk.</span></div></div></section>`;
}

function researchMetric(label,value,cls=""){
 return `<div class="research-metric"><span>${label}</span><strong class="${cls}">${fmt(value)}</strong></div>`;
}
function research(){
 const r=state.research;
 const symbol=state.researchSymbol||"";
 const session=marketSession();
 const directionClass=r?.direction==="BULLISH"?"bull":r?.direction==="BEARISH"?"bear":"neutral";
 return `<section class="page-head"><div><div class="label">PAGE 4 · RESEARCH</div><h1>Universal Asset Research & Action Engine</h1><p>Search any F&O stock, US stock, index, forex pair or crypto asset. TRAP AI applies the same global, multi-timeframe, RSI/divergence, OI, crowding, options, volatility, correlation, liquidity and historical-validation logic.</p></div><span class="live-badge ${session==="MARKET_OPEN"?"session-on":"session-off"}">● ${session==="MARKET_OPEN"?"BULB ON · MARKET ACTION MODE":"○ BULB OFF · EOD RESEARCH MODE"}</span></section>
 <section class="card research-search-card">
  <form onsubmit="event.preventDefault();researchLookup()"><input id="researchSearch" value="${state.query}" oninput="state.query=this.value" placeholder="Search any asset — ITC, AAPL, NIFTY, USDINR, BTC, ETH..." autocomplete="off"><button type="submit" aria-label="Analyze searched asset">⚡ ANALYZE ASSET</button></form>
  <div class="search-help">Search across <b>India F&O</b> · <b>US stocks</b> · <b>Indices</b> · <b>Forex</b> · <b>Crypto</b>. Press <b>⚡ ANALYZE ASSET</b> or Enter.</div><div class="asset-scope"><span>🇮🇳 INDIA F&O</span><span>🇺🇸 US STOCKS</span><span>📊 INDICES</span><span>💱 FOREX</span><span>₿ CRYPTO</span></div><div class="quick-search"><button type="button" onclick="state.query='ITC';researchLookup()">ITC</button><button type="button" onclick="state.query='AAPL';researchLookup()">AAPL</button><button type="button" onclick="state.query='NIFTY';researchLookup()">NIFTY</button><button type="button" onclick="state.query='USDINR';researchLookup()">USDINR</button><button type="button" onclick="state.query='BTC';researchLookup()">BTC</button><button type="button" onclick="state.query='ETH';researchLookup()">ETH</button></div><div class="quick-search"><button type="button" onclick="state.query='ITC';researchLookup()">ITC</button><button type="button" onclick="state.query='HDFCBANK';researchLookup()">HDFC BANK</button><button type="button" onclick="state.query='SBIN';researchLookup()">SBIN</button><button type="button" onclick="state.query='RELIANCE';researchLookup()">RELIANCE</button></div>
 </section>
 ${researchResult(r)}`;
}
function researchEmpty(symbol){
 return `<section class="card section research-empty"><div class="empty-icon">⌕</div><h2>${symbol?symbol+" — LIVE RESEARCH DATA REQUIRED":"Search a stock to begin"}</h2><p>${symbol?"The symbol was accepted, but this Pages build has no timestamp-safe live market/option feed for the searched stock. TRAP AI will not invent today's price, RSI, OI, crowding, strike, IV or entry level.":"Enter any NSE stock symbol such as PAYTM / ONE97. The backend research contract is ready to populate the full analysis."}</p><div class="research-pipeline"><span>GLOBAL REGIME</span><span>PRICE + VOLUME</span><span>1W→5M</span><span>RSI + DIVERGENCE</span><span>OI + CROWDING</span><span>OPTIONS + GREEKS</span><span>IV + EXPECTED MOVE</span><span>CORRELATION</span><span>LIQUIDITY</span><span>HISTORICAL PRACTICE</span><span>FINAL GATE</span></div></section>`;
}
function researchResult(r){
 const dirClass=r.direction==="BULLISH"?"bull":r.direction==="BEARISH"?"bear":"neutral";
 const status=r.dataStatus==="LIVE"?"LIVE TIMESTAMPED RESEARCH":r.dataStatus==="EOD_SNAPSHOT"?"LATEST COMPLETED SESSION SNAPSHOT":"DATA REQUIRED";
 const crowdText=r.crowdingSide==="NOT CALCULATED"?"NOT CALCULATED":r.crowdingSide+(r.crowdingDivergence?" · DIVERGENCE DETECTED":"");
 const optionText=r.optionSuitable?"OPTION SUITABLE":"OPTION SUITABILITY NOT CONFIRMED";
 return `<section class="card section"><div class="research-title"><div><span class="label">CURRENT SESSION · ${r.scopeLabel||researchScopeLabel(detectAssetClass(r.symbol))}</span><h2>${r.symbol}</h2><p>As of: ${fmt(r.asOf)} · Status: <b>${status}</b></p></div><span class="research-direction ${dirClass}">${r.direction}</span></div>
  <div class="research-metrics">
   ${researchMetric("PRICE",r.price)}${researchMetric("DAY CHANGE",r.dayChange!==null?r.dayChange+"%":"—",dirClass)}${researchMetric("SENTIMENT",r.sentiment,r.sentiment>=0?"bull":"bear")}${researchMetric("AI CONFIDENCE",r.confidence+"%")}
   ${researchMetric("TREND / CONTINUATION",r.trendStrength)}${researchMetric("REVERSAL RISK",r.reversalRisk)}${researchMetric("CROWDING",crowdText)}${researchMetric("CORRELATION",r.correlation)}${researchMetric("NEWS / CATALYST",r.newsFactor||"NOT CALCULATED")}
  </div>
 </section>
 <section class="card section"><div class="table-title"><h2>AI interpretation</h2><span class="pill">${r.gate}</span></div>
  <div class="research-grid">
   <div><b>MAJOR SENTIMENT</b><span>${r.sentiment>5?"Strong bullish":r.sentiment>2?"Bullish":r.sentiment<-5?"Strong bearish":r.sentiment<-2?"Bearish":"Neutral"} · ${r.direction}</span></div>
   <div><b>CROWDING / RETAIL</b><span>${crowdText}. Crowding is treated as context, never as a standalone opposite-side signal.</span></div>
   <div><b>CONTRARIAN FILTER</b><span>${r.falseContrarianRisk===null?"Not calculated":r.falseContrarianRisk<35?"Contrarian risk controlled":"High false-contrarian risk — do not fade blindly"}</span></div>
   <div><b>OPTION DECISION</b><span>${optionText}. The engine requires direction + fresh OI/activity + liquidity + IV/Greeks + timing.</span></div>
  </div>
  <div class="decision-gate section"><b>TRAP RULE:</b> High retail/call/put crowding does not mean “take the opposite side”. The engine first checks whether price, RSI divergence, fresh OI, volume, catalyst, volatility and market regime confirm a true trap. If the evidence conflicts, the result is NO TRADE.</div>
 </section>
 <section class="card section"><div class="table-title"><h2>Option intelligence</h2><span class="pill">CONTRACT SELECTION</span></div>
  <div class="option-research-grid">
   ${researchMetric("BEST STRIKE ZONE",r.bestStrike?fmt(r.bestStrike):"NOT CALCULATED")}${researchMetric("IV",r.iv!==null?r.iv+"%":"NOT CALCULATED")}${researchMetric("EXPECTED MOVE",r.expectedMove!==null?String(r.expectedMove):"NOT CALCULATED")}${researchMetric("OPTION SIDE",r.tradeSide==="CALL"?"CALL":r.tradeSide==="PUT"?"PUT":"WAIT")}${researchMetric("HOLDING",r.holding||"NOT CALCULATED")}${researchMetric("OPTION STATUS",optionText)}
  </div>
  <div class="notice section">${r.optionReason}</div>
 </section>
 <section class="card section"><div class="table-title"><h2>Action gate</h2><span class="pill">${r.gate}</span></div>
  <div class="action-grid">
   ${researchMetric("BREAKOUT",r.breakout!==null?r.breakout:"NOT CALCULATED")}${researchMetric("BREAKDOWN",r.breakdown!==null?r.breakdown:"NOT CALCULATED")}${researchMetric("INVALIDATION",r.invalidation!==null?r.invalidation:"NOT CALCULATED")}${researchMetric("TARGET 1",r.target1!==null?String(r.target1):"NOT CALCULATED")}${researchMetric("TARGET 2",r.target2!==null?String(r.target2):"NOT CALCULATED")}${researchMetric("5M TRIGGER",r.trigger5m!==null?String(r.trigger5m):"NOT CALCULATED")}
  </div>
  <div class="final-signal"><span>FINAL SIGNAL</span><strong class="${r.tradeSide==="CALL"?"bull":r.tradeSide==="PUT"?"bear":"neutral"}">${r.conclusion}</strong></div>
 </section>
 <section class="card section"><div class="table-title"><h2>Evidence stack</h2><span class="pill">FULL AI INPUT</span></div>
  <div class="validation-grid"><div><b>GLOBAL REGIME</b><span>World markets · crude · BTC/ETH · USD/INR · DXY · yields · event risk</span></div><div><b>MULTI-TIMEFRAME</b><span>1W · 1D · 3H · 1H · 15M · 5M, with 5M never acting alone</span></div><div><b>RSI / DIVERGENCE</b><span>Continuation vs reversal separated; oversold alone is not bullish</span></div><div><b>OI / CROWDING</b><span>Retail/participant positioning, fresh OI, volume and price/OI divergence</span></div><div><b>OPTIONS</b><span>OI, change OI, volume, turnover, IV, delta, gamma, theta, vega, spread/depth</span></div><div><b>CORRELATION</b><span>Index/sector/market relationships and whether the stock is moving independently</span></div><div><b>LIQUIDITY</b><span>Spread, depth, turnover and execution risk</span></div><div><b>VALIDATION</b><span>Historical practice + timestamp-safe trigger + final no-trade gate</span></div></div>
 </section><section class="card section"><div class="table-title"><h2>Next-day / current-session plan</h2><span class="pill">${session==="MARKET_OPEN"?"ACTIONABLE GATE":"PLAN FOR NEXT SESSION"}</span></div><div class="decision-gate"><b>${session==="MARKET_OPEN"?"BULB ON — ACTIONABLE MODE":"BULB OFF — RESEARCH MODE"}</b> ${session==="MARKET_OPEN"?"Live trigger must be confirmed before an order.":"After market hours, this is the prepared next-session plan; no entry is implied until the market opens and the live 5M gate confirms."}</div><div class="plan-grid"><div><span>DIRECTION</span><strong>${r.direction}</strong></div><div><span>OPTION SIDE</span><strong>${r.tradeSide==="PUT"?"PUT":r.tradeSide==="CALL"?"CALL":"WAIT"}</strong></div><div><span>TRIGGER</span><strong>${r.tradeSide==="PUT"?fmt(r.breakdown):fmt(r.breakout)}</strong></div><div><span>INVALIDATION</span><strong>${fmt(r.invalidation)}</strong></div><div><span>TARGET 1</span><strong>${fmt(r.target1)}</strong></div><div><span>TARGET 2</span><strong>${fmt(r.target2)}</strong></div></div></section><div class="card section"><div class="table-title"><h2>Historical analog test</h2><span class="pill">SCORE → NEXT 1–3 SESSIONS</span></div><div class="backtest-box"><b>STATUS: ${r.backtestStatus||"NOT RUN"}</b><span>TRAP AI must compare this exact timestamp-safe feature state against historical states with the same direction and similar score/RSI/OI/regime conditions. It then measures what happened over the next 1, 2, 3, 5 and 10 sessions.</span></div><div class="backtest-grid"><div><span>HISTORICAL SAMPLE</span><strong>NOT CONNECTED</strong></div><div><span>POSITIVE NEXT 3D PROBABILITY</span><strong>NOT CALCULATED</strong></div><div><span>AVG / MEDIAN NEXT 3D</span><strong>NOT CALCULATED</strong></div><div><span>PROFIT FACTOR</span><strong>NOT CALCULATED</strong></div><div><span>MAX DRAWDOWN</span><strong>NOT CALCULATED</strong></div><div><span>3× / 4× OPTION HIT RATE</span><strong>NOT CALCULATED</strong></div></div><div class="notice section"><b>NO INVENTED PROBABILITY.</b> The website will publish a probability only after at least 30 valid historical matches and timestamp-safe walk-forward testing. For options, the test additionally needs historical option-chain/IV/Greeks data for the relevant period; underlying-price history alone cannot prove a 3× option outcome.</div></div>`;
}

function render(){
 document.getElementById("app").innerHTML=shell();
 document.getElementById("content").innerHTML=({market,options,stocks,research}[state.tab])();
}
function go(t){state.tab=t;render();}
render();
