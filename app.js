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
    },NTPC:{
      symbol:"NTPC",dataStatus:"EOD_SNAPSHOT",asOf:"2026-10-09T00:00:00+05:30",
      price:309.70,return1d:-2.23,return5d:null,rsi:29.4,rsiBias:-3.8,volume:12262742,oi:null,oiBias:-2.0,optionChain:true,
      relativeStrength:0.36,priceVsSma20:-2.5,priceVsSma50:-3.0,structure:30,regime:24,divergence:38,oiVolume:42,options:62,
      sentimentQuality:86,agreement:84,liquidity:88,catalyst:58,macro:28,sentimentScore:-6.4,direction:"BEARISH",
      trendStrength:84,reversalProbability:63,
      crowdingSide:"Call-heavy; 325 immediate OI resistance in the 27 Oct chain; PCR ~0.48–0.56; max pain 325",
      crowdingDivergence:false,falseContrarianRisk:61,optionSuitable:true,tradeSide:"PUT",gate:"WAIT → PUT IF 5M BREAKDOWN BELOW SUPPORT",
      bestStrike:"Near-ATM PE zone — live strike selection pending",iv:null,expectedMove:"~₹305–₹323 (chain snapshot)",
      breakout:325,breakdown:308.45,invalidation:316.40,target1:305,target2:299.65,holding:"1–3 sessions",trigger5m:70,
      optionReason:"Verified snapshot: spot ₹309.70; 27 Oct chain shows PCR ~0.48–0.56 and heavier call OI around ₹325. Exact delta, IV, spread, depth and fresh OI must be rechecked from the live chain before choosing the contract.",
      newsFactor:"Bearish near-term context: NTPC is facing coal-supply constraints and plans additional private coal procurement, while broader Indian equities are under risk-off pressure from oil, yields and foreign outflows.",
      conclusion:"RESEARCH RESULT: BEARISH CONTINUATION BIAS + HIGH REVERSAL RISK. DO NOT BUY PUT BLINDLY. WAIT FOR 5M BREAKDOWN BELOW ₹308.45; BULLISH RSI DIVERGENCE + RECLAIM INVALIDATES THE PUT THESIS.",
      backtestStatus:"NOT RUN: historical option-chain dataset is not connected",
      sourceNote:"Price/volume: Upstox 09 Oct page snapshot; technical RSI: Investing/5paisa; options: INDmoney/NiftyTrader 08 Oct; news: Reuters 06–08 Oct."
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
function yahooSymbol(symbol){
  const s=String(symbol||"").toUpperCase();
  const map={NIFTY:"^NSEI",BANKNIFTY:"^NSEBANK",FINNIFTY:"NIFTY_FIN_SERVICE.NS",MIDCPNIFTY:"NIFTY_MID_SELECT.NS",SPX:"^GSPC",NDX:"^NDX",DJI:"^DJI",DAX:"^GDAXI",FTSE:"^FTSE",NIKKEI:"^N225",BTC:"BTC-USD",ETH:"ETH-USD",SOL:"SOL-USD",BNB:"BNB-USD",XRP:"XRP-USD",USDINR:"INR=X",EURUSD:"EURUSD=X",GBPUSD:"GBPUSD=X",USDJPY:"JPY=X",AUDUSD:"AUDUSD=X",USDCAD:"CAD=X",USDCHF:"CHF=X",NZDUSD:"NZDUSD=X"};
  if(map[s])return map[s];
  if(/^[A-Z0-9&-]+$/.test(s))return s+".NS";
  return s;
}
function yahooUrl(path){return "https://query1.finance.yahoo.com/"+path;}
async function fetchJson(url,ms=9000){
  const ctl=new AbortController(); const t=setTimeout(()=>ctl.abort(),ms);
  try{const r=await fetch(url,{signal:ctl.signal,headers:{"Accept":"application/json"}});if(!r.ok)throw new Error("HTTP "+r.status);return await r.json();}
  finally{clearTimeout(t);}
}
function chartRows(payload){
  const r=payload?.chart?.result?.[0]; if(!r)return [];
  const q=r.indicators?.quote?.[0]||{}, a=r.timestamp||[];
  return a.map((t,i)=>({t,o:Number(q.open?.[i]),h:Number(q.high?.[i]),l:Number(q.low?.[i]),c:Number(q.close?.[i]),v:Number(q.volume?.[i])})).filter(x=>Number.isFinite(x.c));
}
function sma(rows,n){if(rows.length<n)return null;return rows.slice(-n).map(x=>x.c).reduce((a,b)=>a+b,0)/n;}
function rsi14(rows){
  if(rows.length<15)return null;const a=rows.map(x=>x.c),d=[];for(let i=1;i<a.length;i++)d.push(a[i]-a[i-1]);
  let gain=0,loss=0;for(let i=0;i<14;i++){gain+=Math.max(0,d[i]);loss+=Math.max(0,-d[i]);}gain/=14;loss/=14;
  for(let i=14;i<d.length;i++){gain=(gain*13+Math.max(0,d[i]))/14;loss=(loss*13+Math.max(0,-d[i]))/14;}
  if(loss===0)return 100;return 100-(100/(1+gain/loss));
}
function atr14(rows){
  if(rows.length<15)return null;const tr=[];for(let i=1;i<rows.length;i++)tr.push(Math.max(rows[i].h-rows[i].l,Math.abs(rows[i].h-rows[i-1].c),Math.abs(rows[i].l-rows[i-1].c)));
  return tr.slice(-14).reduce((a,b)=>a+b,0)/Math.min(14,tr.length);
}
function pct(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&b!==0?(a/b-1)*100:null;}
function divergenceState(rows){
  if(rows.length<30)return {bull:false,bear:false,score:45};
  const p=rows.slice(-15),q=rows.slice(-30,-15),r1=rsi14(p),r0=rsi14(q),low1=Math.min(...p.map(x=>x.l)),low0=Math.min(...q.map(x=>x.l)),high1=Math.max(...p.map(x=>x.h)),high0=Math.max(...q.map(x=>x.h));
  const bull=low1<low0&&r1>r0+3,bear=high1>high0&&r1<r0-3;return {bull,bear,score:bull||bear?78:45};
}
function optionSummary(chain,spot){
  const r=chain?.optionChain?.result?.[0];if(!r)return {available:false};const calls=r.options?.[0]?.calls||[],puts=r.options?.[0]?.puts||[];
  const callOI=calls.reduce((a,x)=>a+Number(x.openInterest||0),0),putOI=puts.reduce((a,x)=>a+Number(x.openInterest||0),0),pcr=callOI?putOI/callOI:null;
  const ce= calls.filter(x=>Math.abs(Number(x.strike)-spot)<=Math.max(spot*.03,5)).sort((a,b)=>Math.abs(a.strike-spot)-Math.abs(b.strike-spot))[0];
  const pe= puts.filter(x=>Math.abs(Number(x.strike)-spot)<=Math.max(spot*.03,5)).sort((a,b)=>Math.abs(a.strike-spot)-Math.abs(b.strike-spot))[0];
  return {available:true,pcr,expiry:r.expirationDates?.[0]?new Date(r.expirationDates[0]*1000).toISOString().slice(0,10):null,nearCall:ce?.strike??null,nearPut:pe?.strike??null,iv:pe?.impliedVolatility?Number(pe.impliedVolatility*100):ce?.impliedVolatility?Number(ce.impliedVolatility*100):null,callOI,putOI};
}
async function publicResearch(symbol){
  const ys=yahooSymbol(symbol),asset=detectAssetClass(symbol);
  const intervals=await Promise.allSettled([
    fetchJson(yahooUrl("v8/finance/chart/"+encodeURIComponent(ys)+"?range=1y&interval=1d")),
    fetchJson(yahooUrl("v8/finance/chart/"+encodeURIComponent(ys)+"?range=60d&interval=1h")),
    fetchJson(yahooUrl("v8/finance/chart/"+encodeURIComponent(ys)+"?range=10d&interval=15m")),
    fetchJson(yahooUrl("v8/finance/chart/"+encodeURIComponent(ys)+"?range=5d&interval=5m"))
  ]);
  const daily=intervals[0].status==="fulfilled"?chartRows(intervals[0].value):[],hourly=intervals[1].status==="fulfilled"?chartRows(intervals[1].value):[],m15=intervals[2].status==="fulfilled"?chartRows(intervals[2].value):[],m5=intervals[3].status==="fulfilled"?chartRows(intervals[3].value):[];
  if(daily.length<20)throw new Error("No usable public price history for "+symbol);
  const last=daily[daily.length-1],prev=daily[daily.length-2],price=last.c,dayChange=pct(price,prev.c),fiveChange=pct(price,daily[Math.max(0,daily.length-6)]?.c);
  const sma20=sma(daily,20),sma50=sma(daily,50),rsi=rsi14(daily),atr=atr14(daily),rs=pct(price,sma50),div=divergenceState(daily),vol20=sma(daily.map(x=>({...x,c:x.v})),20),volRatio=vol20?last.v/vol20:null;
  const h1=rsi14(hourly),m15r=rsi14(m15),m5r=rsi14(m5),trend=(price>sma20?2:-2)+(price>sma50?2:-2)+(fiveChange>0?1:-1),rsiBias=(rsi-50)/12;
  const rawSent=clamp(trend*1.15+rsiBias+(dayChange||0)*.55+(fiveChange||0)*.15+(div.bull?2:0)-(div.bear?2:0),-10,10),direction=rawSent>=3?"BULLISH":rawSent<=-3?"BEARISH":"NEUTRAL";
  let opt={available:false};if(asset==="INDIA F&O / EQUITY"||asset==="US EQUITY"||asset==="INDEX"){try{opt=optionSummary(await fetchJson(yahooUrl("v7/finance/options/"+encodeURIComponent(ys))),price);}catch(_){}}
  let news=[];try{const q=await fetchJson(yahooUrl("v1/finance/search?q="+encodeURIComponent(symbol)+"&newsCount=6&quotesCount=1"));news=(q.news||[]).slice(0,5).map(n=>n.title).filter(Boolean);}catch(_){}
  const dataQuality=Math.round(Math.min(100,([daily.length>=20,hourly.length>=30,m15.length>=30,m5.length>=30].filter(Boolean).length/4)*100));
  const confidence=Math.round(clamp(dataQuality*.55+(div.bull||div.bear?8:0)+(opt.available?12:0)+(news.length?8:0)+(Math.abs(rawSent)>=5?8:0),0,95));
  const support=Math.min(...daily.slice(-20).map(x=>x.l)),resistance=Math.max(...daily.slice(-20).map(x=>x.h)),breakdown=Number((m5.length?Math.min(...m5.slice(-30).map(x=>x.l)):support).toFixed(2)),breakout=Number((m5.length?Math.max(...m5.slice(-30).map(x=>x.h)):resistance).toFixed(2));
  const reversalRisk=Math.round(clamp((rsi<30?35:0)+(div.bull||div.bear?30:0)+(Math.abs(price-(sma20||price))/(atr||1)>2?15:0)+(dayChange<-4?15:0),0,95)),tradeSide=direction==="BEARISH"?"PUT":direction==="BULLISH"?"CALL":"WAIT",optionSuitable=opt.available&&confidence>=65;
  const gate=direction==="BEARISH"?"WAIT → PUT IF 5M BREAKDOWN BELOW "+breakdown:direction==="BULLISH"?"WAIT → CALL IF 5M BREAKOUT ABOVE "+breakout:"WAIT — NO CLEAR DIRECTION";
  return {symbol,assetClass:asset,dataStatus:"PUBLIC_FEED",asOf:new Date(last.t*1000).toISOString(),price,return1d:dayChange,return5d:fiveChange,rsi,rsiBias,volume:last.v,oi:null,oiBias:null,relativeStrength:rs,priceVsSma20:pct(price,sma20),priceVsSma50:pct(price,sma50),structure:clamp(50+trend*10),regime:clamp(50+(price>sma50?20:-20)),divergence:div.score,oiVolume:volRatio?clamp(50+(volRatio-1)*40):null,options:opt.available?75:null,sentimentQuality:dataQuality,agreement:confidence,liquidity:volRatio?clamp(60+volRatio*10):null,catalyst:news.length?70:35,macro:null,sentimentScore:rawSent,direction,trendStrength:clamp(50+trend*10),reversalProbability:reversalRisk,crowdingSide:opt.available?"Public option chain PCR "+(opt.pcr==null?"—":opt.pcr.toFixed(2))+"; near-ATM call "+(opt.nearCall??"—")+", put "+(opt.nearPut??"—"):"PUBLIC OPTION CHAIN NOT AVAILABLE",crowdingDivergence:false,falseContrarianRisk:reversalRisk,optionSuitable,tradeSide,gate,bestStrike:tradeSide==="PUT"?(opt.nearPut?opt.nearPut+" PE candidate":"Near-ATM PE — live contract validation required"):tradeSide==="CALL"?(opt.nearCall?opt.nearCall+" CE candidate":"Near-ATM CE — live contract validation required"):"WAIT",iv:opt.iv??null,expectedMove:atr?Number((atr*1.5).toFixed(2)):null,breakout,invalidation:direction==="BEARISH"?resistance:direction==="BULLISH"?support:null,breakdown,target1:direction==="BEARISH"?Number((price-atr*1.5).toFixed(2)):direction==="BULLISH"?Number((price+atr*1.5).toFixed(2)):null,target2:direction==="BEARISH"?Number((price-atr*2.5).toFixed(2)):direction==="BULLISH"?Number((price+atr*2.5).toFixed(2)):null,holding:"1–3 sessions",trigger5m:70,optionReason:opt.available?"Public option-chain candidate found. Exact live spread, depth, Greeks and fresh OI must be rechecked before execution.":"No usable public option-chain response; do not publish a contract as confirmed.",newsFactor:news.length?news.join(" · "):"Public news feed unavailable; price/technical evidence used without inventing headlines.",conclusion:direction+" BIAS. "+gate+". RSI "+(rsi?.toFixed(1)??"—")+"; 1H RSI "+(h1?.toFixed(1)??"—")+"; 15M RSI "+(m15r?.toFixed(1)??"—")+"; 5M RSI "+(m5r?.toFixed(1)??"—")+".",backtestStatus:"NOT RUN: historical option-chain dataset is not connected",sourceNote:"Public Yahoo Finance chart/search endpoints; calculations are generated in-browser. This is not a licensed real-time feed."};
}
function pendingResearch(symbol,message){return window.TRAP_ENGINE.researchAnalyze({symbol,dataStatus:"DATA_UNAVAILABLE",asOf:new Date().toISOString(),price:null,return1d:null,rsi:null,volume:null,oi:null,optionChain:null,sentimentScore:0,direction:"NEUTRAL",tradeSide:"WAIT",gate:"NO LIVE SIGNAL",bestStrike:"NOT CALCULATED",optionSuitable:false,holding:"NOT CALCULATED",optionReason:"The public market feed could not be reached from the browser. No price, RSI, OI, option or strike value is invented.",newsFactor:message||"Public market feed unavailable.",conclusion:"NO LIVE SIGNAL — DATA SOURCE UNAVAILABLE",backtestStatus:"NOT RUN"});}
async function liveResearch(symbol){
  const data=(window.TRAP_DATA&&window.TRAP_DATA.research)||{};
  try{return window.TRAP_ENGINE.researchAnalyze(await publicResearch(symbol));}
  catch(err){const fallback=data[symbol]||data[String(symbol).toUpperCase()];if(fallback)return window.TRAP_ENGINE.researchAnalyze({...fallback,symbol});return pendingResearch(symbol,err?.message||"Public market feed unavailable.");}
}
function marketSession(){const d=new Date(),day=d.getDay(),mins=d.getHours()*60+d.getMinutes();return day>=1&&day<=5&&mins>=555&&mins<=930?"MARKET_OPEN":"AFTER_HOURS";}
async function researchLookup(){
  const symbol=normalizeSymbol(state.query);if(!symbol)return;
  state.researchSymbol=symbol;state.research=null;state.researchLoading=true;state.researchError="";state.tab="research";render();
  try{state.research=await liveResearch(symbol);state.research.assetClass=detectAssetClass(symbol);state.research.scopeLabel=researchScopeLabel(state.research.assetClass);}
  catch(err){state.researchError=err?.message||"Research failed";}
  finally{state.researchLoading=false;render();setTimeout(()=>document.getElementById("researchSearch")?.focus(),0);}
}
function shell(){
 return `<header class="top">
  <div class="brand"><div><b>TRAP AI</b><br><small>AI Market Intelligence · Decision System</small><div class="status">● PUBLIC MARKET RESEARCH · LIVE FEED ATTEMPTED</div></div><div class="mode"><span>NEXT-DAY ENGINE</span><b>SCAN → PRACTICE → POST</b></div></div>
  <nav class="nav">
   <button class="${state.tab==="market"?"active":""}" onclick="go('market')">1 · MARKET WATCH</button>
   <button class="${state.tab==="options"?"active":""}" onclick="go('options')">2 · STOCK OPTIONS</button>
   <button class="${state.tab==="stocks"?"active":""}" onclick="go('stocks')">3 · STOCK INFORMATION</button>
   <button class="${state.tab==="research"?"active":""}" onclick="go('research')">4 · RESEARCH</button>
  </nav>
 </header>
 <main class="main"><div id="content"></div><div class="footer">Verified research snapshots: 08–09 Oct 2026. Research attempts public market/technical/option/news retrieval in-browser. Licensed real-time feeds, participant/FII-DII feeds, WhatsApp and cloud collectors still require a secure backend. No fabricated current-session value is displayed.</div></main>`;
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
 </section>
 <section class="card section"><div class="table-title"><h2>TRAP Data Intelligence Grid</h2><span class="pill">ARCHITECTURE READY · LIVE CONNECTORS PENDING</span></div>
  <div class="global-grid"><div><b>🇮🇳 INDIA NODE</b><span>NSE/BSE · F&O · OI · FII/DII</span></div><div><b>🇸🇬 ASIA NODE</b><span>Global/Asian market context</span></div><div><b>🇺🇸 US NODE</b><span>US equities · macro · news</span></div><div><b>🇪🇺 EUROPE NODE</b><span>Europe/global macro context</span></div><div><b>AI VALIDATION</b><span>Multi-model disagreement lowers confidence</span></div><div><b>DATA QUALITY</b><span>Timestamp · stale-data · source discrepancy checks</span></div></div>
  <div class="notice section"><b>Important:</b> regional routing is for resilience/source access, not for obtaining insider information or bypassing data licensing. TRAP AI uses public/licensed data and cross-source validation. Free VPNs/AI websites are not treated as authoritative market-data sources.</div>
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
 if(state.researchLoading){
  return '<section class="page-head"><div><div class="label">PAGE 4 · RESEARCH</div><h1>Universal Asset Research & Action Engine</h1><p>Fetching timestamped public market data and calculating the TRAP evidence stack.</p></div><span class="live-badge session-off">● ANALYSING</span></section><section class="card section research-empty"><div class="empty-icon">⚡</div><h2>Analysing '+(state.researchSymbol||"asset")+'…</h2><p>Loading daily, 1H, 15M and 5M price history, option-chain data where available, and public news context. No fabricated values are shown.</p><div class="research-pipeline"><span>PRICE</span><span>VOLUME</span><span>1W→5M</span><span>RSI</span><span>DIVERGENCE</span><span>OPTIONS</span><span>NEWS</span><span>TRAP GATE</span></div></section>';
 }
 const r=state.research;
 const symbol=state.researchSymbol||"";
 const session=marketSession();
 const directionClass=r?.direction==="BULLISH"?"bull":r?.direction==="BEARISH"?"bear":"neutral";
 return `<section class="page-head"><div><div class="label">PAGE 4 · RESEARCH</div><h1>Universal Asset Research & Action Engine</h1><p>Search any F&O stock, US stock, index, forex pair or crypto asset. TRAP AI applies the same global, multi-timeframe, RSI/divergence, OI, crowding, options, volatility, correlation, liquidity and historical-validation logic.</p></div><span class="live-badge ${session==="MARKET_OPEN"?"session-on":"session-off"}">● ${session==="MARKET_OPEN"?"BULB ON · MARKET ACTION MODE":"○ BULB OFF · EOD RESEARCH MODE"}</span></section>
 <section class="card research-search-card">
  <form onsubmit="event.preventDefault();researchLookup()"><input id="researchSearch" value="${state.query}" oninput="state.query=this.value" placeholder="Search any asset — ITC, NTPC, AAPL, NIFTY, USDINR, BTC, ETH..." autocomplete="off"><button type="submit" aria-label="Analyze searched asset">⚡ ANALYZE ASSET</button></form>
  <div class="search-help">Search across <b>India F&O</b> · <b>US stocks</b> · <b>Indices</b> · <b>Forex</b> · <b>Crypto</b>. Press <b>⚡ ANALYZE ASSET</b> or Enter.</div><div class="asset-scope"><span>🇮🇳 INDIA F&O</span><span>🇺🇸 US STOCKS</span><span>📊 INDICES</span><span>💱 FOREX</span><span>₿ CRYPTO</span></div><div class="quick-search"><button type="button" onclick="state.query='ITC';researchLookup()">ITC</button><button type="button" onclick="state.query='NTPC';researchLookup()">NTPC</button><button type="button" onclick="state.query='AAPL';researchLookup()">AAPL</button><button type="button" onclick="state.query='NIFTY';researchLookup()">NIFTY</button><button type="button" onclick="state.query='USDINR';researchLookup()">USDINR</button><button type="button" onclick="state.query='BTC';researchLookup()">BTC</button><button type="button" onclick="state.query='ETH';researchLookup()">ETH</button></div><div class="quick-search"><button type="button" onclick="state.query='ITC';researchLookup()">ITC</button><button type="button" onclick="state.query='HDFCBANK';researchLookup()">HDFC BANK</button><button type="button" onclick="state.query='SBIN';researchLookup()">SBIN</button><button type="button" onclick="state.query='RELIANCE';researchLookup()">RELIANCE</button></div>
 </section>
 ${researchResult(r)}`;
}
function researchEmpty(symbol){
 return `<section class="card section research-empty"><div class="empty-icon">⌕</div><h2>${symbol?symbol+" — LIVE RESEARCH DATA REQUIRED":"Search a stock to begin"}</h2><p>${symbol?"The symbol was accepted, but this Pages build has no timestamp-safe live market/option feed for the searched stock. TRAP AI will not invent today's price, RSI, OI, crowding, strike, IV or entry level.":"Enter any NSE stock symbol such as PAYTM / ONE97. The backend research contract is ready to populate the full analysis."}</p><div class="research-pipeline"><span>GLOBAL REGIME</span><span>PRICE + VOLUME</span><span>1W→5M</span><span>RSI + DIVERGENCE</span><span>OI + CROWDING</span><span>OPTIONS + GREEKS</span><span>IV + EXPECTED MOVE</span><span>CORRELATION</span><span>LIQUIDITY</span><span>HISTORICAL PRACTICE</span><span>FINAL GATE</span></div></section>`;
}
function researchResult(r){
 if(!r)return researchEmpty("");
 const dirClass=r.direction==="BULLISH"?"bull":r.direction==="BEARISH"?"bear":"neutral";
 const status=r.dataStatus==="LIVE"?"LIVE TIMESTAMPED RESEARCH":r.dataStatus==="PUBLIC_FEED"?"PUBLIC MARKET RESEARCH":r.dataStatus==="EOD_SNAPSHOT"?"LATEST COMPLETED SESSION SNAPSHOT":"DATA REQUIRED";
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
 <section class="card section"><div class="table-title"><h2>Technical & market evidence</h2><span class="pill">ACTUAL INPUTS</span></div>
  <div class="research-metrics">
   ${researchMetric("RSI (14)",r.rsi)}${researchMetric("VOLUME",r.volume)}${researchMetric("5D CHANGE",r.return5d!==null?r.return5d+"%":"—")}${researchMetric("RELATIVE STRENGTH",r.relativeStrength)}
   ${researchMetric("PRICE vs SMA20",r.priceVsSma20)}${researchMetric("PRICE vs SMA50",r.priceVsSma50)}${researchMetric("STRUCTURE",r.structure)}${researchMetric("REGIME",r.regime)}
   ${researchMetric("RSI / DIVERGENCE",r.divergence)}${researchMetric("OI / VOLUME",r.oiVolume)}${researchMetric("OI",r.oi)}${researchMetric("LIQUIDITY",r.liquidity)}
  </div>
  <div class="notice section"><b>Multi-timeframe:</b> 1W → 1D → 3H → 1H → 15M → 5M. The current snapshot publishes only timeframes actually available; missing intraday timeframes are explicitly marked rather than invented.</div>
 </section>
 <section class="card section"><div class="table-title"><h2>Derivatives, options & positioning</h2><span class="pill">F&O WHEN APPLICABLE</span></div>
  <div class="research-grid">
   <div><b>OPTION INTELLIGENCE</b><span>${r.optionSuitable?"Available / suitable for evaluation":"Not confirmed"} · Options score: ${fmt(r.optionsScore)} · IV: ${r.iv!==null?r.iv+"%":"NOT CALCULATED"} · Expected move: ${fmt(r.expectedMove)}</span></div>
   <div><b>OI / CROWDING</b><span>${crowdText} · OI/volume evidence: ${fmt(r.oiVolume)}</span></div>
   <div><b>FII / DII / PARTICIPANT DATA</b><span>Displayed when timestamp-safe participant data is connected. No participant positioning is invented.</span></div>
   <div><b>GREEKS / DEPTH / SPREAD</b><span>Required for final option selection; live chain is required before publishing a contract entry.</span></div>
  </div>
 </section>
 <section class="card section"><div class="table-title"><h2>News, macro & catalyst intelligence</h2><span class="pill">CONTEXT LAYER</span></div>
  <div class="research-grid">
   <div><b>NEWS / CATALYST</b><span>${fmt(r.newsFactor)} · catalyst input: ${fmt(r.catalyst)}</span></div>
   <div><b>MACRO</b><span>Macro input score: ${fmt(r.macro)} · global/sector context is part of the final reasoning.</span></div>
   <div><b>CORRELATION</b><span>${fmt(r.correlation)} · index/sector/market relationships are checked before the final gate.</span></div>
   <div><b>FALSE-CONTRARIAN FILTER</b><span>${r.falseContrarianRisk===null?"NOT CALCULATED":r.falseContrarianRisk}</span></div>
  </div>
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
 const root=document.getElementById("app");
 try{
  root.innerHTML=shell();
  const view=({market,options,stocks,research}[state.tab])||market;
  document.getElementById("content").innerHTML=view();
 }catch(err){
  console.error("TRAP AI render error",err);
  root.innerHTML=shell();
  document.getElementById("content").innerHTML=researchEmpty(state.researchSymbol||"");
 }
}
function go(t){state.tab=t;render();}
render();
