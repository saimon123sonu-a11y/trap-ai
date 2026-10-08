/* TRAP AI decision-first frontend.
   Live/public research is routed through the Vercel proxy. No seeded value is used
   for current-session decisions; unavailable data produces NO TRADE.
*/
window.TRAP_API_BASE="https://trap-ai-saimon123sonu-8796.vercel.app";

const state={
  tab:"market",query:"",researchSymbol:"",research:null,researchLoading:false,researchError:"",
  market:null,optionRows:[],stockRows:[],loading:{market:false,options:false,stocks:false},
  updated:null
};

const UNIVERSE=[
 "RELIANCE","HDFCBANK","ICICIBANK","SBIN","AXISBANK","KOTAKBANK","INFY","TCS","ITC","LT",
 "BHARTIARTL","ADANIENT","ADANIGREEN","TATAMOTORS","M&M","MARUTI","BAJAJ-AUTO","JSWSTEEL",
 "TATASTEEL","SUNPHARMA","HINDALCO","NTPC","POWERGRID","ONGC","COALINDIA","JUBLFOOD",
 "TIINDIA","INOXWIND","LICHSGFIN","ICICIGI","PNBHOUSING","MPHASIS","EICHERMOT","JSWENERGY",
 "BEL","TRENT","DLF","SBILIFE","HDFCLIFE","INDUSINDBK"
];

function clamp(v,a=-10,b=10){v=Number(v);return Number.isFinite(v)?Math.min(b,Math.max(a,v)):a}
function fmt(v){return v===null||v===undefined||v===""?"—":String(v)}
function scoreClass(v){return Number(v)>=0?"bull":"bear"}
function normalizeSymbol(s){
 const q=String(s||"").trim().toUpperCase().replace(/[^A-Z0-9&./-]/g,"");
 const a={"PAYTM":"ONE97","ONE97COMM":"ONE97","NIFTY50":"NIFTY","S&P500":"SPX","SP500":"SPX","NASDAQ":"NDX","DOWJONES":"DJI","BITCOIN":"BTC","ETHEREUM":"ETH","USD/INR":"USDINR","USD-INR":"USDINR","EUR/USD":"EURUSD","GBP/USD":"GBPUSD"};
 return a[q]||q;
}
function detectAssetClass(s){
 s=String(s||"").toUpperCase();
 if(["BTC","ETH","SOL","BNB","XRP","DOGE","ADA","AVAX"].includes(s))return"CRYPTO";
 if(/^(USDINR|EURUSD|GBPUSD|USDJPY|AUDUSD|USDCAD|USDCHF|NZDUSD)$/.test(s))return"FOREX";
 if(["NIFTY","BANKNIFTY","FINNIFTY","MIDCPNIFTY","SENSEX","SPX","NDX","DJI","DAX","FTSE","NIKKEI"].includes(s))return"INDEX";
 if(["AAPL","MSFT","NVDA","AMZN","META","GOOGL","GOOG","TSLA","AMD","NFLX","AVGO","AMAT","INTC"].includes(s))return"US EQUITY";
 return"INDIA F&O / EQUITY";
}
function yahooSymbol(s){
 s=String(s||"").toUpperCase();
 const m={NIFTY:"^NSEI",BANKNIFTY:"^NSEBANK",FINNIFTY:"NIFTY_FIN_SERVICE.NS",MIDCPNIFTY:"NIFTY_MID_SELECT.NS",SENSEX:"^BSESN",SPX:"^GSPC",NDX:"^NDX",DJI:"^DJI",DAX:"^GDAXI",FTSE:"^FTSE",NIKKEI:"^N225",BTC:"BTC-USD",ETH:"ETH-USD",SOL:"SOL-USD",BNB:"BNB-USD",XRP:"XRP-USD",USDINR:"INR=X",EURUSD:"EURUSD=X",GBPUSD:"GBPUSD=X",USDJPY:"JPY=X",AUDUSD:"AUDUSD=X",USDCAD:"CAD=X",USDCHF:"CHF=X",NZDUSD:"NZDUSD=X"};
 return m[s]||(s.match(/^[A-Z0-9&-]+$/)?s+".NS":s);
}
function yahooUrl(path){return window.TRAP_API_BASE+"/api/research?path="+encodeURIComponent(path)}
async function fetchJson(url,ms=10000){
 const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);
 try{const r=await fetch(url,{signal:c.signal,headers:{Accept:"application/json"}});if(!r.ok)throw new Error("HTTP "+r.status);return await r.json()}
 finally{clearTimeout(t)}
}
function rows(payload){
 const r=payload?.chart?.result?.[0];if(!r)return[];
 const q=r.indicators?.quote?.[0]||{},a=r.timestamp||[];
 return a.map((t,i)=>({t,o:Number(q.open?.[i]),h:Number(q.high?.[i]),l:Number(q.low?.[i]),c:Number(q.close?.[i]),v:Number(q.volume?.[i])})).filter(x=>Number.isFinite(x.c));
}
function sma(r,n){return r.length<n?null:r.slice(-n).reduce((a,x)=>a+x.c,0)/n}
function rsi14(r){
 if(r.length<15)return null;const d=r.slice(1).map((x,i)=>x.c-r[i].c);let g=0,l=0;
 for(let i=0;i<14;i++){g+=Math.max(0,d[i]);l+=Math.max(0,-d[i])}g/=14;l/=14;
 for(let i=14;i<d.length;i++){g=(g*13+Math.max(0,d[i]))/14;l=(l*13+Math.max(0,-d[i]))/14}
 return l===0?100:100-100/(1+g/l)
}
function pct(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&b?(a/b-1)*100:null}
function atr14(r){
 if(r.length<15)return null;const tr=[];
 for(let i=1;i<r.length;i++)tr.push(Math.max(r[i].h-r[i].l,Math.abs(r[i].h-r[i-1].c),Math.abs(r[i].l-r[i-1].c)));
 return tr.slice(-14).reduce((a,b)=>a+b,0)/14
}
function aggregate3h(r){
 const out=[];
 for(let i=0;i+2<r.length;i+=3){const z=r.slice(i,i+3);out.push({t:z[0].t,o:z[0].o,h:Math.max(...z.map(x=>x.h)),l:Math.min(...z.map(x=>x.l)),c:z[2].c,v:z.reduce((a,x)=>a+(x.v||0),0)})}
 return out;
}
function weekly(r){
 const out=[];for(let i=0;i<r.length;i+=5){const z=r.slice(i,i+5);if(z.length<5)continue;out.push({t:z[0].t,o:z[0].o,h:Math.max(...z.map(x=>x.h)),l:Math.min(...z.map(x=>x.l)),c:z[z.length-1].c,v:z.reduce((a,x)=>a+(x.v||0),0)})}return out
}
function divergence(r){
 if(r.length<30)return{bull:false,bear:false,score:null};
 const a=r.slice(-15),b=r.slice(-30,-15),ra=rsi14(a),rb=rsi14(b),la=Math.min(...a.map(x=>x.l)),lb=Math.min(...b.map(x=>x.l)),ha=Math.max(...a.map(x=>x.h)),hb=Math.max(...b.map(x=>x.h));
 const bull=la<lb&&ra>rb+3,bear=ha>hb&&ra<rb-3;return{bull,bear,score:bull||bear?78:45}
}
function optionSummary(chain,spot){
 const r=chain?.optionChain?.result?.[0];if(!r)return{available:false};
 const o=r.options?.[0]||{},calls=o.calls||[],puts=o.puts||[];
 const callOI=calls.reduce((a,x)=>a+Number(x.openInterest||0),0),putOI=puts.reduce((a,x)=>a+Number(x.openInterest||0),0);
 const byOI=a=>a.filter(x=>Number(x.openInterest)>0).sort((x,y)=>Number(y.openInterest)-Number(x.openInterest))[0];
 const ce=calls.filter(x=>Math.abs(Number(x.strike)-spot)<=Math.max(spot*.035,5)).sort((a,b)=>Math.abs(a.strike-spot)-Math.abs(b.strike-spot))[0];
 const pe=puts.filter(x=>Math.abs(Number(x.strike)-spot)<=Math.max(spot*.035,5)).sort((a,b)=>Math.abs(a.strike-spot)-Math.abs(b.strike-spot))[0];
 const cw=byOI(calls),pw=byOI(puts),pcr=callOI?putOI/callOI:null;
 return{available:true,pcr,expiry:r.expirationDates?.[0]?new Date(r.expirationDates[0]*1000).toISOString().slice(0,10):null,
  nearCall:ce?.strike??null,nearPut:pe?.strike??null,callWall:cw?.strike??null,putWall:pw?.strike??null,
  callWallOI:cw?.openInterest??null,putWallOI:pw?.openInterest??null,
  iv:pe?.impliedVolatility?Number(pe.impliedVolatility*100):ce?.impliedVolatility?Number(ce.impliedVolatility*100):null,
  callOI,putOI}
}
let staticSnapshotPromise=null;
let staticSnapshotAt=0;
async function loadStaticSnapshot(){
  // Re-read the snapshot every 30 seconds so a failed collector run is not pinned for the whole session.
  if(staticSnapshotPromise && Date.now()-staticSnapshotAt<30000) return staticSnapshotPromise;
  staticSnapshotAt=Date.now();
  staticSnapshotPromise=fetch("./data/latest.json?ts="+Date.now(),{cache:"no-store"})
    .then(function(r){if(!r.ok)throw new Error("static snapshot HTTP "+r.status);return r.json()})
    .catch(function(){return null});
  return staticSnapshotPromise;
}
function staticResearch(symbol,snap){
  const key=normalizeSymbol(symbol);
  const x=snap&&snap.symbols&&snap.symbols[key];
  if(!x) return null;
  // A scheduled snapshot record is usable only when it contains an actual price.
  // DATA_UNAVAILABLE must fall through to the live Vercel research proxy; otherwise
  // one bad collector run can blank the entire dashboard.
  const usable=Number.isFinite(Number(x.price)) && x.dataStatus!=="DATA_UNAVAILABLE";
  if(!usable) return null;
  return Object.assign({},x,{symbol:key,dataStatus:x.dataStatus||"SCHEDULED_PUBLIC_SNAPSHOT",sourceNote:(x.sourceNote||"Scheduled public market-data snapshot")+" · "+fmt(snap.generatedAt)});
}

async function publicResearch(symbol){
 const snap=await loadStaticSnapshot();
 const cached=staticResearch(symbol,snap);
 if(cached) return cached;
 const ys=yahooSymbol(symbol),asset=detectAssetClass(symbol);
 const q=await Promise.allSettled([
  fetchJson(yahooUrl("v8/finance/chart/"+encodeURIComponent(ys)+"?range=2y&interval=1d")),
  fetchJson(yahooUrl("v8/finance/chart/"+encodeURIComponent(ys)+"?range=90d&interval=1h")),
  fetchJson(yahooUrl("v8/finance/chart/"+encodeURIComponent(ys)+"?range=20d&interval=15m")),
  fetchJson(yahooUrl("v8/finance/chart/"+encodeURIComponent(ys)+"?range=7d&interval=5m"))
 ]);
 const d=q[0].status==="fulfilled"?rows(q[0].value):[],h=q[1].status==="fulfilled"?rows(q[1].value):[],m15=q[2].status==="fulfilled"?rows(q[2].value):[],m5=q[3].status==="fulfilled"?rows(q[3].value):[];
 if(d.length<30)throw new Error("No usable public price history");
 const last=d[d.length-1],prev=d[d.length-2],price=last.c,day=pct(price,prev.c),five=pct(price,d[Math.max(0,d.length-6)].c);
 const w=weekly(d),rsi=rsi14(d),rsi1h=rsi14(h),rsi15=rsi14(m15),rsi5=rsi14(m5),rsi3h=rsi14(aggregate3h(h)),rsiW=rsi14(w);
 const s20=sma(d,20),s50=sma(d,50),atr=atr14(d),div=divergence(d),v20=sma(d.map(x=>({...x,c:x.v})),20),vr=v20?last.v/v20:null;
 const trend=(price>s20?2:-2)+(price>s50?2:-2)+(five>0?1:-1)+(rsi1h>50?1:-1);
 const raw=clamp(trend*1.05+(rsi-50)/12+(day||0)*.55+(five||0)*.12+(div.bull?2:0)-(div.bear?2:0));
 const direction=raw>=3?"BULLISH":raw<=-3?"BEARISH":"NEUTRAL";
 let opt={available:false};
 if(["INDIA F&O / EQUITY","US EQUITY","INDEX"].includes(asset)){try{opt=optionSummary(await fetchJson(yahooUrl("v7/finance/options/"+encodeURIComponent(ys))),price)}catch{}}
 let news=[];try{const z=await fetchJson(yahooUrl("v1/finance/search?q="+encodeURIComponent(symbol)+"&newsCount=5&quotesCount=1"));news=(z.news||[]).slice(0,5).map(x=>x.title).filter(Boolean)}catch{}
 const support=Math.min(...(m5.length?m5.slice(-30):d.slice(-20)).map(x=>x.l)),resistance=Math.max(...(m5.length?m5.slice(-30):d.slice(-20)).map(x=>x.h));
 const breakdown=Number(support.toFixed(2)),breakout=Number(resistance.toFixed(2));
 const reversal=Math.round(clamp((rsi<30?35:0)+(div.bull||div.bear?30:0)+(day<-4?15:0)+(Math.abs(price-(s20||price))/(atr||1)>2?15:0),0,95));
 const quality=Math.round(([d.length>=30,h.length>=30,m15.length>=30,m5.length>=30].filter(Boolean).length/4)*100);
 const confidence=Math.round(Math.min(95,quality*.55+(opt.available?15:0)+(news.length?8:0)+(div.bull||div.bear?7:0)+(Math.abs(raw)>=5?7:0)));
 const side=direction==="BULLISH"?"CALL":direction==="BEARISH"?"PUT":"WAIT";
 const strike=side==="CALL"?opt.nearCall:side==="PUT"?opt.nearPut:null;
 const gate=direction==="BULLISH"?"WAIT → CALL IF 5M BREAKOUT ABOVE "+breakout:direction==="BEARISH"?"WAIT → PUT IF 5M BREAKDOWN BELOW "+breakdown:"WAIT — NO CLEAR DIRECTION";
 return{
  symbol,assetClass:asset,dataStatus:"PUBLIC_FEED",asOf:new Date(last.t*1000).toISOString(),price,
  dayChange:day,return5d:five,sentiment:raw,confidence,direction,
  rsi,rsiWeekly:rsiW,rsi3h,rsi1h,rsi15,rsi5,divergence:div.score,bullDivergence:div.bull,bearDivergence:div.bear,
  volume:last.v,volumeRatio:vr,priceVsSma20:pct(price,s20),priceVsSma50:pct(price,s50),
  trendStrength:Math.round(clamp(50+trend*8,0,100)),reversalRisk:reversal,
  crowdingLevel:opt.available?Math.round(clamp((opt.callOI+opt.putOI?Math.abs((opt.callOI-opt.putOI)/(opt.callOI+opt.putOI))*100:0),0,100)):null,
  crowdingSide:opt.available?"PCR "+(opt.pcr==null?"—":opt.pcr.toFixed(2))+" · Call wall "+fmt(opt.callWall)+" · Put wall "+fmt(opt.putWall):"OPTION CHAIN UNAVAILABLE",
  callWall:opt.callWall,putWall:opt.putWall,pcr:opt.pcr,
  falseContrarianRisk:reversal,optionSuitable:opt.available&&confidence>=65,tradeSide:side,
  bestStrike:strike?(strike+" "+(side==="CALL"?"CE":"PE")):"NEAR-ATM CONTRACT — LIVE CHAIN REQUIRED",
  iv:opt.iv,expiry:opt.expiry,optionsScore:opt.available?75:null,
  breakout,breakdown,invalidation:direction==="BEARISH"?breakout:direction==="BULLISH"?breakdown:null,
  target1:direction==="BEARISH"?Number((price-(atr||0)*1.5).toFixed(2)):direction==="BULLISH"?Number((price+(atr||0)*1.5).toFixed(2)):null,
  target2:direction==="BEARISH"?Number((price-(atr||0)*2.5).toFixed(2)):direction==="BULLISH"?Number((price+(atr||0)*2.5).toFixed(2)):null,
  expectedMove:atr?Number((atr*1.5).toFixed(2)):null,holding:"1–3 sessions",trigger5m:70,
  newsFactor:news.length?news.join(" · "):"Public news unavailable",
  catalyst:news.length?70:35,macro:null,correlation:null,liquidity:vr?Math.round(clamp(60+vr*10,0,100)):null,
  oi:null,oiVolume:vr?Math.round(clamp(50+(vr-1)*40,0,100)):null,
  gate,optionReason:opt.available?"Candidate is selected near ATM; exact spread, depth, Greeks and fresh OI must be revalidated at trigger time.":"No usable option-chain response — no contract is published as confirmed.",
  conclusion:direction==="NEUTRAL"?"NO TRADE — DIRECTION NOT CONFIRMED":(side+" ONLY AFTER 5M CONFIRMATION; "+(div.bull&&direction==="BEARISH"?"BULLISH RSI DIVERGENCE PRESENT — CANCEL BLIND PUT":"NO CONTRARY RSI GATE DETECTED")),
  backtestStatus:"NOT RUN: historical option-chain dataset is not connected",
  sourceNote:"Public market-data proxy; not a licensed real-time feed. Timestamp shown above."
 };
}
function unavailable(symbol,msg){
 return{symbol,dataStatus:"DATA_UNAVAILABLE",asOf:new Date().toISOString(),price:null,dayChange:null,sentiment:0,confidence:0,direction:"NO TRADE",rsi:null,tradeSide:"WAIT",bestStrike:"NOT CALCULATED",gate:"NO LIVE SIGNAL",conclusion:"NO LIVE SIGNAL — DATA SOURCE UNAVAILABLE",newsFactor:msg||"Public market feed unavailable",backtestStatus:"NOT RUN"};
}
function addModelPredictions(r){
 const noData=!r||r.price==null||r.dataStatus==="DATA_UNAVAILABLE";
 if(noData){r.models={trend:{name:"Trend / Structure",direction:"NO DATA",score:null,confidence:null,inputs:0},momentum:{name:"Momentum / RSI",direction:"NO DATA",score:null,confidence:null,inputs:0}};return r}
 const val=x=>Number.isFinite(Number(x))&&x!==null&&x!==undefined?Number(x):null;
 const a=[r.priceVsSma20,r.priceVsSma50,r.return5d,r.rsi1h,r.rsi].map(val);
 const trendScore=clamp((a[0]==null?0:(a[0]>=0?2:-2))+(a[1]==null?0:(a[1]>=0?2:-2))+(a[2]==null?0:clamp(a[2],-5,5)*.45)+(a[3]==null?0:(a[3]-50)/10)+(a[4]==null?0:(a[4]-50)/15));
 const b=[r.rsi5,r.rsi15,r.dayChange].map(val);
 const momentumScore=clamp((b[0]==null?0:(b[0]-50)/5)+(b[1]==null?0:(b[1]-50)/8)+(b[2]==null?0:clamp(b[2],-5,5)*.5)+(r.bullDivergence?2:0)-(r.bearDivergence?2:0));
 const direction=x=>x>=1.5?"BULLISH":x<=-1.5?"BEARISH":"NEUTRAL";
 const confidence=(score,count)=>count?Math.round(Math.min(85,35+count*8+Math.abs(score)*2)):null;
 const trendInputs=a.filter(x=>x!==null).length,momentumInputs=b.filter(x=>x!==null).length+(r.bullDivergence||r.bearDivergence?1:0);
 r.models={
  trend:{name:"Trend / Structure",direction:direction(trendScore),score:Number(trendScore.toFixed(2)),confidence:confidence(trendScore,trendInputs),inputs:trendInputs},
  momentum:{name:"Momentum / RSI",direction:direction(momentumScore),score:Number(momentumScore.toFixed(2)),confidence:confidence(momentumScore,momentumInputs),inputs:momentumInputs}
 };
 r.modelAgreement=r.models.trend.direction===r.models.momentum.direction;
 return r;
}
async function liveResearch(symbol){try{return addModelPredictions(await publicResearch(symbol))}catch(e){return addModelPredictions(unavailable(symbol,e?.message||"Public market feed unavailable"))}}
function marketSession(){const d=new Date(),day=d.getDay(),m=d.getHours()*60+d.getMinutes();return day>0&&day<6&&m>=555&&m<=930?"MARKET_OPEN":"AFTER_HOURS"}
function sentimentLabel(v){return v>=8?"EXTREME BULLISH":v>=5?"BULLISH":v>=2?"MILD BULLISH":v>-2?"NEUTRAL":v>-5?"MILD BEARISH":v>-8?"BEARISH":"EXTREME BEARISH"}
function cardMetric(label,value,cls=""){return'<div class="research-metric"><span>'+label+'</span><strong class="'+cls+'">'+fmt(value)+'</strong></div>'}
function decisionRow(r){
 const side=(r.optionSuitable===true&&r.tradeSide==="CALL")?"CALL":(r.optionSuitable===true&&r.tradeSide==="PUT")?"PUT":"WAIT";
 const reversalWarning=Number(r.reversalRisk)>=55;
 const trap=r.trapIntent?.type||"NO TRAP";
 const vol=r.volatility||{};
 const entry=(r.optionEntryLow!=null&&r.optionEntryHigh!=null)?fmt(r.optionEntryLow)+"–"+fmt(r.optionEntryHigh):"REPRICE AT TRIGGER";
 const risk=(r.optionStop!=null)?fmt(r.optionStop):"—";
 const targets=[r.optionTarget1,r.optionTarget2,r.optionTarget3].filter(x=>x!=null).map(fmt).join(" / ")||"—";
 return '<div class="decision-card"><div><b>'+r.symbol+'</b><span>'+r.direction+(r.price==null?' · DATA UNAVAILABLE':'')+(reversalWarning?' · REVERSAL RISK':'')+'</span></div><div><small>SENTIMENT</small><strong class="'+scoreClass(r.sentiment)+'">'+fmt(r.sentiment)+'</strong></div><div><small>AI CONF.</small><strong>'+fmt(r.confidence)+'%</strong></div><div><small>RSI</small><strong>'+fmt(r.rsi?.toFixed?.(1)||r.rsi)+'</strong></div><div><small>OPTION</small><strong class="'+(side==="CALL"?"bull":side==="PUT"?"bear":"neutral")+'">'+side+' · '+fmt(r.bestStrike)+'</strong><small>Entry '+entry+' · SL '+risk+' · T1/T2/T3 '+targets+'</small></div><div class="gate"><small>TRIGGER</small><strong>'+fmt(r.gate)+'</strong><small>Trap: '+fmt(trap)+' · Vol '+fmt(vol.regime)+' · VIX '+fmt(vol.vixLevel)+' · Corr(NIFTY/VIX) '+fmt(vol.corrNifty)+' / '+fmt(vol.corrVix)+'</small><small class="model-strip">MODEL 1 Trend: '+fmt(r.models?.trend?.direction)+' ('+fmt(r.models?.trend?.score)+') · MODEL 2 Momentum: '+fmt(r.models?.momentum?.direction)+' ('+fmt(r.models?.momentum?.score)+') · '+(r.modelAgreement===false?'DISAGREEMENT — WAIT':'Agreement: '+fmt(r.modelAgreement))+'</small></div></div>'
}
function shell(){
 return'<header class="top"><div class="brand"><div><b>TRAP AI</b><br><small>AI Market Intelligence · Decision System</small><div class="status">● PUBLIC MARKET RESEARCH · TIMESTAMPED WHEN AVAILABLE</div></div><div class="mode"><span>DECISION MODE</span><b>NO TRADE IS A VALID OUTPUT</b></div></div><nav class="nav">'+
 ['market','options','stocks','research'].map((t,i)=>'<button class="'+(state.tab===t?"active":"")+'" onclick="go(\''+t+'\')">'+(i+1)+' · '+({market:"MARKET WATCH",options:"STOCK OPTIONS",stocks:"STOCK INFORMATION",research:"RESEARCH"}[t])+'</button>').join("")+
 '</nav></header><main class="main"><div id="content"></div><div class="footer">TRAP AI publishes only data it can timestamp. Public-feed research is not a substitute for licensed exchange/participant feeds. No fabricated OI, FII/DII, Greeks, probabilities or 3×/4× outcomes.</div></main>'
}
async function loadMarket(){
 if(state.loading.market)return;state.loading.market=true;render();
 const names=["NIFTY","BANKNIFTY","SENSEX"];const out={};
 await Promise.all(names.map(async s=>out[s]=await liveResearch(s)));
 state.market=out;state.updated=new Date();state.loading.market=false;render()
}
async function scanSymbols(symbols,requireOptions=false){
 const out=[],batchSize=5;
 for(let i=0;i<symbols.length;i+=batchSize){
  const batch=symbols.slice(i,i+batchSize);
  const results=await Promise.allSettled(batch.map(s=>Promise.race([
   liveResearch(s),
   new Promise((_,reject)=>setTimeout(()=>reject(new Error("timeout")),25000))
  ])));
  results.forEach((x,j)=>{
   if(x.status==="fulfilled"){
    const r=x.value;
    if(r && r.dataStatus!=="DATA_UNAVAILABLE" && r.price!=null && (!requireOptions || r.optionSuitable || r.bestStrike!=="NEAR-ATM CONTRACT — LIVE CHAIN REQUIRED")) out.push(r);
   }
  });
  if(state.tab==="options"){state.optionRows=out.slice();render()}
  if(state.tab==="stocks"){state.stockRows=out.slice();render()}
 }
 return out;
}
async function loadOptions(){
 if(state.loading.options)return;state.loading.options=true;render();
 try{
  const rows=await scanSymbols(UNIVERSE.slice(0,50),false);
  rows.sort((a,b)=>(b.confidence-a.confidence)+(Math.abs(b.sentiment)-Math.abs(a.sentiment))*.25);
  state.optionRows=rows.slice(0,15);
 }finally{state.loading.options=false;state.updated=new Date();render()}
}
async function loadStocks(){
 if(state.loading.stocks)return;state.loading.stocks=true;render();
 try{
  const snap=await loadStaticSnapshot();
  const pool=Object.keys((snap&&snap.symbols)||{})
    .filter(s=>!["NIFTY","BANKNIFTY","SENSEX","BTC","USDINR","DXY","US10Y","BRENT","GOLD","SPX","NDX"].includes(s));
  let rows=pool.map(s=>staticResearch(s,snap)).filter(Boolean);
  // If the scheduled snapshot is empty/partial, never leave the tab blank:
  // fall back to the same live research path used by the Research page.
  if(rows.length<5) rows=await scanSymbols(UNIVERSE.slice(0,50),false);
  rows.sort((a,b)=>b.confidence-a.confidence);
  state.stockRows=rows;
 }finally{state.loading.stocks=false;state.updated=new Date();render()}
}
function market(){
 const m=state.market;if(!m)return '<section class="page-head"><div><div class="label">PAGE 1 · MARKET WATCH</div><h1>Market Watch</h1><p>NIFTY, BANK NIFTY and SENSEX. Direction is decided from multi-timeframe price, RSI/divergence, options/crowding and confirmation logic.</p></div><span class="live-badge">'+(state.loading.market?"● SCANNING":"READY")+'</span></section><section class="card section"><div class="notice">'+(state.loading.market?"Fetching live public market data…":"Press refresh by reopening this tab if you need a new scan.")+'</div></section>';
 const arr=["NIFTY","BANKNIFTY","SENSEX"].map(x=>m[x]);
 const valid=arr.filter(x=>x&&x.price!=null),avg=valid.length?valid.reduce((a,x)=>a+x.sentiment,0)/valid.length:0;
 const best=valid.filter(x=>x.optionSuitable&&x.direction!=="NEUTRAL").sort((a,b)=>b.confidence-a.confidence)[0];
 return'<section class="page-head"><div><div class="label">PAGE 1 · MARKET WATCH</div><h1>Market Watch</h1><p>One screen for the decision: index direction, RSI, sentiment, AI confidence, option side and exact trigger. Deep evidence stays in Research.</p></div><span class="live-badge '+(marketSession()==="MARKET_OPEN"?"session-on":"session-off")+'">● '+marketSession()+'</span></section>'+
 '<section class="card"><div class="table-title"><h2>Index decision board</h2><span class="pill">SENTIMENT + AI CONFIDENCE</span></div><div class="decision-card head"><b>INDEX</b><b>DIRECTION</b><b>SENTIMENT</b><b>AI CONF.</b><b>RSI</b><b>OPTION / TRIGGER</b></div>'+arr.map(r=>r?decisionRow(r):"").join("")+'</section>'+
 '<section class="card section"><div class="sentiment-hero"><div><span>INDIA SENTIMENT</span><strong class="'+scoreClass(avg)+'">'+avg.toFixed(1)+' / 10</strong></div><div><span>REGIME</span><strong>'+sentimentLabel(avg)+'</strong></div><div><span>BEST INDEX OPTION</span><strong>'+fmt(best?.symbol)+" · "+fmt(best?.bestStrike)+'</strong></div></div></section>'+
 '<section class="card section"><div class="table-title"><h2>Action</h2><span class="pill">CONDITIONAL ONLY</span></div><div class="final-signal"><span>DECISION</span><strong class="'+(best?.tradeSide==="CALL"?"bull":best?.tradeSide==="PUT"?"bear":"neutral")+'">'+(best?best.gate:"NO TRADE — NO VALIDATED INDEX OPTION")+'</strong></div><div class="notice section"><b>Rule:</b> low RSI is not a CALL signal; high crowding is not a PUT signal. Direction first, then RSI/divergence, OI/activity, liquidity and 5M trigger.</div></section>'
}
function options(){
 const rows=state.optionRows;
 return'<section class="page-head"><div><div class="label">PAGE 2 · STOCK OPTIONS</div><h1>Stock Options</h1><p>Underlying first. Then the best option side and near-ATM contract candidate. No maximum-OI-only selection.</p></div><span class="live-badge">'+(state.loading.options?"● SCANNING":"● DECISION BOARD")+'</span></section>'+
 '<section class="card"><div class="notice"><b>Contract selection:</b> direction → RSI/divergence → crowding/OI → volume → IV → liquidity → 5M trigger. If the chain or confirmation is missing, the answer is <b>NO TRADE</b>.</div></section>'+
 '<section class="card section"><div class="table-title"><h2>Top option candidates</h2><span class="pill">VALIDATED OPTION CANDIDATES</span></div>'+(!rows.length?'<div class="notice">'+(state.loading.options?"Scanning stock-option candidates in batches…":"No validated option candidate is available from the public feed right now — NO TRADE.")+'</div>':rows.map(decisionRow).join(""))+'</section>'
}
function stocks(){
 const rows=state.stockRows;
 const bear=rows.filter(x=>x.direction==="BEARISH" && Number(x.confidence)>=50).sort((a,b)=>b.confidence-a.confidence).slice(0,5);
 const bull=rows.filter(x=>x.direction==="BULLISH" && Number(x.confidence)>=50).sort((a,b)=>b.confidence-a.confidence).slice(0,5);
 const rev=rows.filter(x=>Number(x.reversalRisk)>=55 && Number(x.confidence)>=50).sort((a,b)=>b.reversalRisk-a.reversalRisk).slice(0,5);
 return'<section class="page-head"><div><div class="label">PAGE 3 · STOCK INFORMATION</div><h1>Next-Session Stock Plan</h1><p>Working public scan → 5 bearish + 5 bullish + 5 reversal-risk names. This is not a claim that the entire 150-name NSE F&O universe has been scanned until a proper licensed universe feed is connected.</p></div><span class="live-badge">'+(state.loading.stocks?"● SCANNING":"● SCANNED")+'</span></section>'+
 '<section class="card"><div class="summary-grid"><div><span>WORKING SCAN</span><strong>'+rows.length+'</strong><small>Public-feed names completed</small></div><div><span>BEARISH</span><strong>'+bear.length+'</strong><small>Continuation candidates</small></div><div><span>BULLISH</span><strong>'+bull.length+'</strong><small>Continuation candidates</small></div><div><span>REVERSAL RISK</span><strong>'+rev.length+'</strong><small>Requires reversal gate</small></div></div></section>'+
 '<section class="card section"><div class="table-title"><h2>Bearish continuation</h2><span class="pill">PUT ONLY AFTER TRIGGER</span></div>'+(bear.length?bear.map(decisionRow).join(""):'<div class="notice">'+(state.loading.stocks?"Scanning for bearish continuation candidates…":"No validated bearish candidate available.")+'</div>')+'</section>'+
 '<section class="card section"><div class="table-title"><h2>Bullish continuation</h2><span class="pill">CALL ONLY AFTER TRIGGER</span></div>'+(bull.length?bull.map(decisionRow).join(""):'<div class="notice">'+(state.loading.stocks?"Scanning for bullish continuation candidates…":"No validated bullish candidate available.")+'</div>')+'</section>'+
 '<section class="card section"><div class="table-title"><h2>Reversal watch</h2><span class="pill">NOT A CALL SIGNAL</span></div>'+(rev.length?rev.map(r=>decisionRow({...r,gate:r.bullDivergence?"WAIT → CALL ONLY AFTER RECLAIM + 5M CONFIRMATION":"WAIT — REVERSAL NOT CONFIRMED"})).join(""):'<div class="notice">'+(state.loading.stocks?"Scanning for reversal-risk candidates…":"No validated reversal candidate available.")+'</div>')+'</section>'
}
function researchLookup(){
 const s=normalizeSymbol(state.query);if(!s)return;
 state.researchSymbol=s;state.research=null;state.researchLoading=true;state.researchError="";state.tab="research";render();
 liveResearch(s).then(r=>{state.research=r}).catch(e=>{state.researchError=e.message}).finally(()=>{state.researchLoading=false;render()})
}
function researchMetric(label,value,cls=""){return cardMetric(label,value,cls)}
function research(){
 if(state.researchLoading)return'<section class="card research-empty"><div class="empty-icon">⚡</div><h2>Analysing '+fmt(state.researchSymbol)+'…</h2><p>Loading 1W, 1D, 3H, 1H, 15M and 5M evidence, options/crowding and public news where available.</p></section>';
 const r=state.research;if(!r)return'<section class="page-head"><div><div class="label">PAGE 4 · RESEARCH</div><h1>Research</h1><p>Search any asset for the full evidence stack.</p></div></section><section class="card research-search-card"><form onsubmit="event.preventDefault();researchLookup()"><input id="researchSearch" value="'+state.query+'" oninput="state.query=this.value" placeholder="ITC, RELIANCE, SBIN, NIFTY, AAPL, USDINR, BTC"><button>⚡ ANALYZE</button></form><div class="quick-search"><button onclick="state.query=\'RELIANCE\';researchLookup()">RELIANCE</button><button onclick="state.query=\'SBIN\';researchLookup()">SBIN</button><button onclick="state.query=\'NIFTY\';researchLookup()">NIFTY</button><button onclick="state.query=\'ITC\';researchLookup()">ITC</button><button onclick="state.query=\'BTC\';researchLookup()">BTC</button></div></section>';
 const side=r.tradeSide==="CALL"?"CALL":r.tradeSide==="PUT"?"PUT":"WAIT",dc=r.direction==="BULLISH"?"bull":r.direction==="BEARISH"?"bear":"neutral";
 const nextH=r.nextHourOutlook||"MIXED — WAIT FOR 5M CONFIRMATION";
 const nextS=r.nextSessionBias||r.direction||"NEUTRAL";
 const optionScenario=r.optionScenario||((side==="CALL"?"CALL":side==="PUT"?"PUT":"WAIT")+" · trigger required");
 return'<section class="page-head"><div><div class="label">PAGE 4 · RESEARCH · '+fmt(r.assetClass)+'</div><h1>'+r.symbol+'</h1><p>As of '+fmt(r.asOf)+' · '+fmt(r.dataStatus)+'</p></div><span class="research-direction '+dc+'">'+r.direction+'</span></section>'+
 '<section class="card"><div class="sentiment-hero"><div><span>SENTIMENT</span><strong class="'+dc+'">'+fmt(r.sentiment)+' / 10</strong></div><div><span>AI CONFIDENCE</span><strong>'+fmt(r.confidence)+'%</strong></div><div><span>OPTION SIDE</span><strong class="'+(side==="CALL"?"bull":side==="PUT"?"bear":"neutral")+'">'+side+'</strong></div></div></section>'+
 '<section class="card section"><div class="table-title"><h2>Actionable evidence</h2><span class="pill">DECISION CORE</span></div><div class="research-metrics">'+
 researchMetric("PRICE",r.price)+researchMetric("DAY CHANGE",r.dayChange!=null?r.dayChange.toFixed(2)+"%":null,dc)+researchMetric("RSI 1D",r.rsi?.toFixed?.(1)||r.rsi)+researchMetric("RSI 1H",r.rsi1h?.toFixed?.(1)||r.rsi1h)+researchMetric("RSI 15M",r.rsi15?.toFixed?.(1)||r.rsi15)+researchMetric("RSI 5M",r.rsi5?.toFixed?.(1)||r.rsi5)+researchMetric("RSI DIVERGENCE",r.bullDivergence?"BULLISH":r.bearDivergence?"BEARISH":"NONE")+researchMetric("CROWDING",r.crowdingSide)+researchMetric("PCR",r.pcr?.toFixed?.(2)||r.pcr)+researchMetric("VOLUME RATIO",r.volumeRatio?.toFixed?.(2)+"×")+researchMetric("MODEL 1 · TREND",r.models?.trend?.direction)+researchMetric("MODEL 1 SCORE",r.models?.trend?.score)+researchMetric("MODEL 2 · MOMENTUM",r.models?.momentum?.direction)+researchMetric("MODEL 2 SCORE",r.models?.momentum?.score)+
 '</div></section>'+
 '<section class="card section"><div class="table-title"><h2>Next-horizon plan</h2><span class="pill">DECISION OUTPUT</span></div><div class="plan-grid"><div><span>NEXT 1H OUTLOOK</span><strong>'+fmt(nextH)+'</strong></div><div><span>NEXT SESSION BIAS</span><strong>'+fmt(nextS)+'</strong></div><div><span>EST. UNDERLYING MOVE</span><strong>'+fmt(r.nextSessionMovePct!=null?r.nextSessionMovePct.toFixed(2)+"%":null)+'</strong></div><div><span>OPTION SCENARIO</span><strong>'+fmt(optionScenario)+'</strong></div><div><span>OPTION MOVE EST.</span><strong>'+fmt(r.optionMovePct!=null?r.optionMovePct.toFixed(0)+"%":null)+'</strong></div><div><span>AS-OF</span><strong>'+fmt(r.asOf)+'</strong></div></div><div class="notice section">'+fmt(r.planNote)+'</div></section>'+'<section class="card section"><div class="table-title"><h2>Option decision</h2><span class="pill">'+side+'</span></div><div class="plan-grid"><div><span>CONTRACT</span><strong>'+fmt(r.bestStrike)+'</strong></div><div><span>EXPIRY</span><strong>'+fmt(r.expiry)+'</strong></div><div><span>IV</span><strong>'+fmt(r.iv)+'</strong></div><div><span>CALL WALL</span><strong>'+fmt(r.callWall)+'</strong></div><div><span>PUT WALL</span><strong>'+fmt(r.putWall)+'</strong></div><div><span>REVERSAL RISK</span><strong>'+fmt(r.reversalRisk)+'</strong></div></div><div class="notice section">'+fmt(r.optionReason)+'</div></section>'+
 '<section class="card section"><div class="table-title"><h2>Trade gate</h2><span class="pill">'+fmt(r.gate)+'</span></div><div class="plan-grid"><div><span>TRIGGER</span><strong>'+fmt(r.tradeSide==="PUT"?r.breakdown:r.breakout)+'</strong></div><div><span>INVALIDATION</span><strong>'+fmt(r.invalidation)+'</strong></div><div><span>TARGET 1</span><strong>'+fmt(r.target1)+'</strong></div><div><span>TARGET 2</span><strong>'+fmt(r.target2)+'</strong></div><div><span>HOLDING</span><strong>1–3 SESSIONS</strong></div><div><span>FALSE-CONTRARIAN RISK</span><strong>'+fmt(r.falseContrarianRisk)+'</strong></div></div><div class="final-signal"><span>FINAL DECISION</span><strong class="'+(side==="CALL"?"bull":side==="PUT"?"bear":"neutral")+'">'+fmt(r.conclusion)+'</strong></div></section>'+
 '<section class="card section"><div class="table-title"><h2>Deep evidence</h2><span class="pill">RESEARCH ONLY</span></div><div class="research-grid"><div><b>MULTI-TIMEFRAME</b><span>1W RSI '+fmt(r.rsiWeekly)+' · 3H RSI '+fmt(r.rsi3h)+' · 1H RSI '+fmt(r.rsi1h)+' · 15M RSI '+fmt(r.rsi15)+' · 5M RSI '+fmt(r.rsi5)+'</span></div><div><b>STRUCTURE</b><span>Price/SMA20 '+fmt(r.priceVsSma20)+'% · Price/SMA50 '+fmt(r.priceVsSma50)+'% · Trend '+fmt(r.trendStrength)+'</span></div><div><b>NEWS / CATALYST</b><span>'+fmt(r.newsFactor)+'</span></div><div><b>DATA LIMIT</b><span>Public feed only. FII/DII, participant OI, licensed news, historical option-chain validation and 3×/4× backtest remain backend data requirements.</span></div></div></section>'
}
function render(){
 const root=document.getElementById("app");try{root.innerHTML=shell();document.getElementById("content").innerHTML=({market,options,stocks,research}[state.tab]||market)()}catch(e){console.error(e);root.innerHTML='<main class="main"><section class="card"><h2>TRAP AI rendering error</h2><p>'+fmt(e.message)+'</p></section></main>'}
}
function go(t){
 state.tab=t;render();
 if(t==="market"&&!state.market)loadMarket();
 if(t==="options"&&!state.optionRows.length)loadOptions();
 if(t==="stocks"&&!state.stockRows.length)loadStocks();
}
render();

/* TRAP AI cross-asset + 5M upgrade layer */
(function(){
  ["BAJFINANCE","BAJAJFINSV","SHRIRAMFIN","INDUSINDBK","BANDHANBNK","FEDERALBNK","CANBK","BANKBARODA","PNB","IDFCFIRSTB","M&M","EICHERMOT","HEROMOTOCO","TVSMOTOR","TATAPOWER","NHPC","SJVN","SAIL","VEDL","JINDALSTEL","NMDC","HAL","BHEL","LT","TRENT","TITAN","DLF","OBEROIRLTY","GODREJPROP","PHOENIXLTD","LODHA","POLYCAB","DIXON","VOLTAS","CUMMINSIND","SIEMENS","ABB","PIDILITIND","GRASIM","ULTRACEMCO","AMBUJACEM","ACC","IOC","BPCL","HINDPETRO","PETRONET","TATACONSUM","HINDUNILVR","NESTLEIND","BRITANNIA","MARICO","DABUR","COLPAL","PAGEIND","BSE","CDSL","MCX","IRCTC","RVNL","IRFC","RECLTD","PFC","HUDCO","NBCC","CONCOR","DELHIVERY","INDUSTOWER","MGL","IGL","GMRINFRA","SUZLON","INOXWIND","YESBANK","IDBI","EXIDEIND","ASHOKLEY","BOSCHLTD","ESCORTS","BIOCON","LUPIN","GLENMARK","ZYDUSLIFE","TORNTPHARM","AUROPHARMA","MAXHEALTH","APOLLOHOSP","MUTHOOTFIN","MANAPPURAM","CHOLAFIN","LICHSGFIN","IEX","NYKAA","PAYTM","ETERNAL","JUBLFOOD","ASTRAL","KEI","HFCL","KAYNES","IRB","NCC"].forEach(function(s){if(!UNIVERSE.includes(s))UNIVERSE.push(s)});
  yahooSymbol=function(s){s=String(s||"").toUpperCase();var m={NIFTY:"^NSEI",BANKNIFTY:"^NSEBANK",FINNIFTY:"NIFTY_FIN_SERVICE.NS",MIDCPNIFTY:"NIFTY_MID_SELECT.NS",SENSEX:"^BSESN",SPX:"^GSPC",NDX:"^NDX",DJI:"^DJI",DAX:"^GDAXI",FTSE:"^FTSE",NIKKEI:"^N225",BTC:"BTC-USD",ETH:"ETH-USD",SOL:"SOL-USD",BNB:"BNB-USD",XRP:"XRP-USD",USDINR:"INR=X",EURUSD:"EURUSD=X",GBPUSD:"GBPUSD=X",USDJPY:"JPY=X",AUDUSD:"AUDUSD=X",USDCAD:"CAD=X",USDCHF:"CHF=X",NZDUSD:"NZDUSD=X",DXY:"DX-Y.NYB",US10Y:"^TNX",BRENT:"BZ=F",GOLD:"GC=F"};return m[s]||(s.match(/^[A-Z0-9&-]+$/)?s+".NS":s)};
  detectAssetClass=function(s){s=String(s||"").toUpperCase();if(["BTC","ETH","SOL","BNB","XRP","DOGE","ADA","AVAX"].includes(s))return"CRYPTO";if(/^(USDINR|EURUSD|GBPUSD|USDJPY|AUDUSD|USDCAD|USDCHF|NZDUSD)$/.test(s))return"FOREX";if(["DXY","US10Y"].includes(s))return"MACRO";if(["BRENT","GOLD"].includes(s))return"COMMODITY";if(["NIFTY","BANKNIFTY","FINNIFTY","MIDCPNIFTY","SENSEX","SPX","NDX","DJI","DAX","FTSE","NIKKEI"].includes(s))return"INDEX";return"INDIA F&O / EQUITY"};
  async function worldNews(){var qs=["India stock market RBI oil FII","global markets US yields Fed","Brent crude Middle East shipping","Bitcoin crypto macro ETF","forex dollar rupee euro yen","geopolitics tariffs sanctions markets"],out=[];for(var i=0;i<qs.length;i++){try{var z=await fetchJson(yahooUrl("v1/finance/search?q="+encodeURIComponent(qs[i])+"&newsCount=5&quotesCount=0"));(z.news||[]).slice(0,5).forEach(function(n){out.push({title:n.title,publisher:n.publisher,time:n.providerPublishTime?new Date(n.providerPublishTime*1000).toISOString():null})})}catch(e){}}var seen={};return out.filter(function(n){if(!n.title||seen[n.title])return false;seen[n.title]=1;return true}).slice(0,18)}
  loadMarket=function(){if(state.loading.market)return;state.loading.market=true;render();var syms=["NIFTY","BANKNIFTY","SENSEX","BTC","USDINR","DXY","US10Y","BRENT","GOLD","SPX","NDX"];Promise.all(syms.map(function(s){return liveResearch(s)})).then(async function(a){state.market={};syms.forEach(function(s,i){state.market[s]=a[i]});var snap=await loadStaticSnapshot();state.globalNews=(snap&&snap.news&&snap.news.length)?snap.news:await worldNews();state.updated=new Date();state.nextRefresh=new Date(Date.now()+300000);state.loading.market=false;render()}).catch(function(){state.loading.market=false;render()})};
  loadStocks=function(){
    if(state.loading.stocks)return;
    state.loading.stocks=true;render();
    loadStaticSnapshot().then(async function(snap){
      var pool=Object.keys((snap&&snap.symbols)||{}).filter(function(s){return !["NIFTY","BANKNIFTY","SENSEX","BTC","USDINR","DXY","US10Y","BRENT","GOLD","SPX","NDX"].includes(s)});
      var all=pool.map(function(s){return staticResearch(s,snap)}).filter(function(x){return x&&x.price!=null});
      // The snapshot may be empty or stale. Fall back to live research instead of leaving this tab blank.
      if(all.length<15){
        var live=await scanSymbols(UNIVERSE.slice(0,40),false);
        var merged={};all.concat(live).forEach(function(x){if(x&&x.price!=null)merged[x.symbol]=addModelPredictions(x)});
        all=Object.keys(merged).map(function(k){return merged[k]});
      } else all=all.map(addModelPredictions);
      var bear=all.filter(function(x){return x.direction==="BEARISH"}).sort(function(a,b){return (b.confidence-a.confidence)||((a.sentiment||0)-(b.sentiment||0))}).slice(0,5);
      var bull=all.filter(function(x){return x.direction==="BULLISH"}).sort(function(a,b){return (b.confidence-a.confidence)||((b.sentiment||0)-(a.sentiment||0))}).slice(0,5);
      var rev=all.filter(function(x){return Number(x.reversalRisk)>=55}).sort(function(a,b){return b.reversalRisk-a.reversalRisk}).slice(0,5);
      var map=new Map();bear.concat(bull,rev).forEach(function(x){map.set(x.symbol,x)});
      state.stockRows=Array.from(map.values());state.updated=new Date();state.nextRefresh=new Date(Date.now()+300000);state.loading.stocks=false;render();
    }).catch(function(){state.stockRows=[];state.loading.stocks=false;render()});
  };
  var oldMarket=market;market=function(){var m=state.market||{},idx=[m.NIFTY,m.BANKNIFTY,m.SENSEX].filter(Boolean),cross=[m.BTC,m.USDINR,m.DXY,m.US10Y,m.BRENT,m.GOLD,m.SPX,m.NDX].filter(Boolean),news=(state.globalNews||[]).slice(0,10);var crossHtml='<div class="cross-grid">'+cross.map(function(r){return '<div class="cross-card"><b>'+r.symbol+'</b><span>'+fmt(r.price)+'</span><small>'+fmt(r.dayChange)+'% · RSI '+fmt(r.rsi&&r.rsi.toFixed?r.rsi.toFixed(1):r.rsi)+' · '+r.direction+'</small></div>'}).join('')+'</div>';return '<section class="page-head"><div><div class="label">PAGE 1 · MARKET WATCH</div><h1>Market Watch</h1><p>India is evaluated against BTC, FX, dollar, yields, oil, gold and US equity conditions before a trade is allowed.</p></div><span class="live-badge">● '+marketSession()+' · 5M CYCLE</span></section><section class="card"><div class="table-title"><h2>NIFTY · BANK NIFTY · SENSEX</h2><span class="pill">ACTION FIRST</span></div>'+idx.map(decisionRow).join('')+'</section><section class="card section"><div class="table-title"><h2>BTC / FOREX / GLOBAL INPUTS</h2><span class="pill">TRAP MACRO LAYER</span></div>'+crossHtml+'</section><section class="card section"><div class="table-title"><h2>WORLD NEWS INTELLIGENCE</h2><span class="pill">PUBLIC HEADLINES</span></div>'+news.map(function(n){return '<div class="news-item"><b>'+fmt(n.title)+'</b><small>'+fmt(n.publisher)+' · '+(n.time?new Date(n.time).toLocaleString():'—')+'</small></div>'}).join('')+'</section><section class="card section"><div class="notice"><b>Five-minute rule:</b> refreshes every five minutes while the page is open. Event risk can reduce confidence or force NO TRADE; it cannot force a signal.</div></section>'};
  var oldStocks=stocks;stocks=function(){var rows=state.stockRows||[],bear=rows.filter(function(x){return x.direction==="BEARISH"}).sort(function(a,b){return b.confidence-a.confidence}).slice(0,5),bull=rows.filter(function(x){return x.direction==="BULLISH"}).sort(function(a,b){return b.confidence-a.confidence}).slice(0,5),rev=rows.filter(function(x){return x.reversalRisk>=55}).sort(function(a,b){return b.reversalRisk-a.reversalRisk}).slice(0,5);return '<section class="page-head"><div><div class="label">PAGE 3 · STOCK INFORMATION</div><h1>Next Session · 5–5–5</h1><p>Broad working scan, then deep validation of the 15 carry-forward candidates.</p></div><span class="live-badge">● '+(state.loading.stocks?'SCANNING':((bear.length+bull.length+rev.length)>0?'DATA CHECKED · '+rows.length+' CANDIDATES':'DATA UNAVAILABLE'))+'</span></section><section class="card"><div class="summary-grid"><div><span>BEARISH</span><strong>'+bear.length+'</strong><small>Validated candidates</small></div><div><span>BULLISH</span><strong>'+bull.length+'</strong><small>Validated candidates</small></div><div><span>REVERSAL WATCH</span><strong>'+rev.length+'</strong><small>Separate reversal gate</small></div><div><span>NEXT REFRESH</span><strong>'+(state.nextRefresh?state.nextRefresh.toLocaleTimeString():'—')+'</strong><small>Automatic 5M cycle</small></div></div></section><section class="card section"><div class="table-title"><h2>🐻 Top 5 bearish</h2><span class="pill">PUT IF CONFIRMED</span></div>'+(bear.length?bear.map(decisionRow).join(''):'<div class="notice">No validated bearish candidates. Data is unavailable or evidence is insufficient.</div>')+'</section><section class="card section"><div class="table-title"><h2>🐂 Top 5 bullish</h2><span class="pill">CALL IF CONFIRMED</span></div>'+(bull.length?bull.map(decisionRow).join(''):'<div class="notice">No validated bullish candidates. Data is unavailable or evidence is insufficient.</div>')+'</section><section class="card section"><div class="table-title"><h2>🟡 Top 5 reversal watch</h2><span class="pill">NOT AUTOMATIC CALL</span></div>'+(rev.length?rev.map(decisionRow).join(''):'<div class="notice">No validated reversal candidates from available evidence.</div>')+'</section>'};
  state.globalNews=[];state.nextRefresh=new Date(Date.now()+300000);
  var oldRender=render;render=function(){oldRender();var f=document.querySelector('.footer');if(f)f.innerHTML='Last refresh: '+(state.updated?state.updated.toLocaleTimeString():'—')+' · Next refresh: '+(state.nextRefresh?state.nextRefresh.toLocaleTimeString():'—')+' · Automatic 5-minute cycle · Public feed / no fabricated values'};
  setInterval(function(){if(state.nextRefresh&&Date.now()>=state.nextRefresh.getTime()){if(state.tab==='market')loadMarket();else if(state.tab==='stocks')loadStocks();else if(state.tab==='research'&&state.researchSymbol){liveResearch(state.researchSymbol).then(function(r){state.research=r;state.updated=new Date();state.nextRefresh=new Date(Date.now()+300000);render()}).catch(function(){})}else{state.nextRefresh=new Date(Date.now()+300000);render()}}},1000);
  render();loadMarket();
})();
