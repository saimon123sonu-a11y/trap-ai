// TRAP AI scheduled public-data collector.
// Writes a same-origin snapshot so the GitHub Pages app does not depend on protected
// Vercel deployment access from a browser. No credentials are stored or required.

import { mkdir, writeFile } from "node:fs/promises";

const UA = "TRAP-AI-public-research/1.0";
const HOSTS = ["https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com"];

const CORE = [
  "NIFTY","BANKNIFTY","SENSEX","INDIAVIX","BTC","USDINR","DXY","US10Y","BRENT","GOLD","SPX","NDX"
];

const STOCKS = [
  "RELIANCE","HDFCBANK","ICICIBANK","SBIN","AXISBANK","KOTAKBANK","INDUSINDBK","BAJFINANCE","BAJAJFINSV","SHRIRAMFIN",
  "INFY","TCS","HCLTECH","WIPRO","TECHM","LT","BHARTIARTL","ITC","HINDUNILVR","NESTLEIND",
  "TATAMOTORS","MARUTI","M&M","EICHERMOT","BAJAJ-AUTO","TITAN","TRENT","ADANIENT","ADANIPORTS","ADANIGREEN",
  "NTPC","POWERGRID","ONGC","COALINDIA","TATASTEEL","JSWSTEEL","HINDALCO","SUNPHARMA","CIPLA","DRREDDY",
  "BEL","BHEL","HAL","DLF","LTIM","APOLLOHOSP","MAXHEALTH","SBILIFE","HDFCLIFE","TATACONSUM"
];

const STOCK_OPTION_NAMES = STOCKS.slice(0, 20);

const MAP = {
  NIFTY:"^NSEI", BANKNIFTY:"^NSEBANK", SENSEX:"^BSESN", INDIAVIX:"^INDIAVIX",
  BTC:"BTC-USD", USDINR:"INR=X", DXY:"DX-Y.NYB", US10Y:"^TNX",
  BRENT:"BZ=F", GOLD:"GC=F", SPX:"^GSPC", NDX:"^NDX"
};

function symbolOf(name){
  return MAP[name] || name + ".NS";
}
function finite(v){ return Number.isFinite(Number(v)) ? Number(v) : null; }
function clamp(v,a,b){ v=Number(v); return Number.isFinite(v)?Math.min(b,Math.max(a,v)):a; }
function pct(a,b){ return Number.isFinite(a)&&Number.isFinite(b)&&b ? (a/b-1)*100 : null; }
function returnsOf(r,n=120){
  const z=r.filter(x=>Number.isFinite(x.c)).slice(-(n+1));
  const out=[]; for(let i=1;i<z.length;i++){const a=z[i-1].c,b=z[i].c;if(a)out.push((b/a)-1);}
  return out;
}
function correlation(a,b){
  const n=Math.min(a?.length||0,b?.length||0); if(n<20)return null;
  const x=a.slice(-n),y=b.slice(-n),mx=x.reduce((s,v)=>s+v,0)/n,my=y.reduce((s,v)=>s+v,0)/n;
  let num=0,dx=0,dy=0; for(let i=0;i<n;i++){const u=x[i]-mx,v=y[i]-my;num+=u*v;dx+=u*u;dy+=v*v;}
  return dx&&dy?num/Math.sqrt(dx*dy):null;
}
function volatilityRegime(stockAtrPct,vixPct){
  const v=Number(vixPct), a=Number(stockAtrPct);
  if((Number.isFinite(v)&&v>=2.5)||(Number.isFinite(a)&&a>=4))return "EXTREME";
  if((Number.isFinite(v)&&v>=1.8)||(Number.isFinite(a)&&a>=2.8))return "ELEVATED";
  if((Number.isFinite(v)&&v<=1.0)&&(Number.isFinite(a)&&a<=1.5))return "LOW";
  return "NORMAL";
}
function trapAgent(r){
  const bearish=r.direction==="BEARISH",bullish=r.direction==="BULLISH";
  const contr=(bearish&&r.bullDivergence)||(bullish&&r.bearDivergence);
  const crowd=Number(r.crowdingLevel)>=65;
  const flowOpp=(bearish&&Number(r.pcr)>1.15)||(bullish&&Number(r.pcr)<.85);
  const score=Math.round(clamp((contr?45:0)+(crowd?20:0)+(flowOpp?15:0)+(Number(r.volumeRatio)>=1.4?10:0)+(Number(r.reversalRisk)>=55?10:0),0,95));
  let type="NONE";
  if(score>=60) type=bearish?"POSSIBLE PUT TRAP":bullish?"POSSIBLE CALL TRAP":"CROWDING TRAP WATCH";
  return {type,score,reason:type==="NONE"?"No sufficient trap evidence.":(contr?"RSI divergence against the prevailing direction. ":"")+(crowd?"Crowding is elevated. ":"")+(flowOpp?"Option-flow imbalance is opposite the prevailing direction. ":"")+(Number(r.reversalRisk)>=55?"Reversal risk is elevated.":"")};
}

function sma(r,n){
  return r.length<n ? null : r.slice(-n).reduce((a,x)=>a+x.c,0)/n;
}
function rsi14(r){
  if(r.length<15) return null;
  const d=r.slice(1).map((x,i)=>x.c-r[i].c);
  let g=0,l=0;
  for(let i=0;i<14;i++){ g+=Math.max(0,d[i]); l+=Math.max(0,-d[i]); }
  g/=14; l/=14;
  for(let i=14;i<d.length;i++){ g=(g*13+Math.max(0,d[i]))/14; l=(l*13+Math.max(0,-d[i]))/14; }
  return l===0?100:100-100/(1+g/l);
}
function atr14(r){
  if(r.length<15) return null;
  const tr=[];
  for(let i=1;i<r.length;i++) tr.push(Math.max(r[i].h-r[i].l,Math.abs(r[i].h-r[i-1].c),Math.abs(r[i].l-r[i-1].c)));
  return tr.slice(-14).reduce((a,b)=>a+b,0)/14;
}
function aggregate3h(r){
  const out=[];
  for(let i=0;i+2<r.length;i+=3){
    const z=r.slice(i,i+3);
    out.push({t:z[0].t,o:z[0].o,h:Math.max(...z.map(x=>x.h)),l:Math.min(...z.map(x=>x.l)),c:z[2].c,v:z.reduce((a,x)=>a+(x.v||0),0)});
  }
  return out;
}
function weekly(r){
  const out=[];
  for(let i=0;i<r.length;i+=5){
    const z=r.slice(i,i+5);
    if(z.length<5) continue;
    out.push({t:z[0].t,o:z[0].o,h:Math.max(...z.map(x=>x.h)),l:Math.min(...z.map(x=>x.l)),c:z[z.length-1].c,v:z.reduce((a,x)=>a+(x.v||0),0)});
  }
  return out;
}
function rows(payload){
  const r=payload?.chart?.result?.[0];
  if(!r) return [];
  const q=r.indicators?.quote?.[0]||{}, a=r.timestamp||[];
  return a.map((t,i)=>({
    t,o:finite(q.open?.[i]),h:finite(q.high?.[i]),l:finite(q.low?.[i]),c:finite(q.close?.[i]),v:finite(q.volume?.[i])
  })).filter(x=>Number.isFinite(x.c)&&Number.isFinite(x.h)&&Number.isFinite(x.l));
}
function divergence(r){
  if(r.length<30) return {bull:false,bear:false,score:null};
  const a=r.slice(-15), b=r.slice(-30,-15), ra=rsi14(a), rb=rsi14(b);
  const la=Math.min(...a.map(x=>x.l)), lb=Math.min(...b.map(x=>x.l));
  const ha=Math.max(...a.map(x=>x.h)), hb=Math.max(...b.map(x=>x.h));
  const bull=la<lb && ra!=null && rb!=null && ra>rb+3;
  const bear=ha>hb && ra!=null && rb!=null && ra<rb-3;
  return {bull,bear,score:bull||bear?78:45};
}

async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function fetchJsonUrl(url,timeoutMs=6000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
    const r=await fetch(url,{signal:controller.signal,headers:{"Accept":"application/json","User-Agent":UA,"Cache-Control":"no-cache"}});
    if(!r.ok) throw new Error("HTTP "+r.status);
    return await r.json();
  }finally{
    clearTimeout(timer);
  }
}
function validateYahooPayload(path,payload){
  if(path.startsWith("v8/finance/chart/") && !payload?.chart?.result?.[0]){
    throw new Error("Upstream returned no chart result");
  }
  return payload;
}

async function yahoo(path){
  const target="https://query1.finance.yahoo.com/"+path;
  let lastErr;
  // Try the relay first: GitHub Actions observed HTTP 429 from Yahoo direct,
  // while AllOrigins returned a valid chart JSON response for the same request.
  try{
    return validateYahooPayload(path,await fetchJsonUrl("https://api.allorigins.win/raw?url="+encodeURIComponent(target),12000));
  }catch(e){lastErr=e;}
  // Jina is a second independent transport. Extract only the JSON object.
  try{
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),12000);
    try{
      const r=await fetch("https://r.jina.ai/"+target,{signal:controller.signal,headers:{"Accept":"text/plain","User-Agent":UA,"Cache-Control":"no-cache"}});
      if(!r.ok) throw new Error("JINA HTTP "+r.status);
      const text=await r.text();
      const first=text.indexOf("{"),last=text.lastIndexOf("}");
      if(first<0||last<=first) throw new Error("Jina returned non-JSON content");
      return validateYahooPayload(path,JSON.parse(text.slice(first,last+1)));
    }finally{clearTimeout(timer);}
  }catch(e){lastErr=e;}
  // Direct hosts are last because they are currently rate-limiting the runner.
  for(const url of ["https://query2.finance.yahoo.com/"+path,"https://query1.finance.yahoo.com/"+path]){
    try{return validateYahooPayload(path,await fetchJsonUrl(url,5000));}catch(e){lastErr=e;}
  }
  throw lastErr||new Error("Yahoo request failed");
}

function optionNear(chain,spot){
  const r=chain?.optionChain?.result?.[0];
  const opt=r?.options?.[0];
  if(!r||!opt) return {available:false};
  const calls=opt.calls||[], puts=opt.puts||[];
  const near=(arr)=>arr.filter(x=>Number.isFinite(Number(x.strike))).sort((a,b)=>Math.abs(Number(a.strike)-spot)-Math.abs(Number(b.strike)-spot))[0];
  const maxOI=(arr)=>arr.filter(x=>finite(x.openInterest)>0).sort((a,b)=>finite(b.openInterest)-finite(a.openInterest))[0];
  const ce=near(calls), pe=near(puts), cw=maxOI(calls), pw=maxOI(puts);
  const callOI=calls.reduce((a,x)=>a+(finite(x.openInterest)||0),0);
  const putOI=puts.reduce((a,x)=>a+(finite(x.openInterest)||0),0);
  const pcr=callOI?putOI/callOI:null;
  const iv=finite(pe?.impliedVolatility)!=null?finite(pe.impliedVolatility)*100:(finite(ce?.impliedVolatility)!=null?finite(ce.impliedVolatility)*100:null);
  return {
    available:true,
    pcr,
    callOI,putOI,
    callWall:finite(cw?.strike),putWall:finite(pw?.strike),
    callWallOI:finite(cw?.openInterest),putWallOI:finite(pw?.openInterest),
    nearCall:finite(ce?.strike),nearPut:finite(pe?.strike),
    callPremium:finite(ce?.lastPrice),putPremium:finite(pe?.lastPrice),callBid:finite(ce?.bid),callAsk:finite(ce?.ask),putBid:finite(pe?.bid),putAsk:finite(pe?.ask),
    expiry:r.expirationDates?.[0]?new Date(r.expirationDates[0]*1000).toISOString().slice(0,10):null,
    iv
  };
}

async function searchNews(q){
  try{
    const z=await yahoo("v1/finance/search?q="+encodeURIComponent(q)+"&newsCount=5&quotesCount=0");
    return (z.news||[]).slice(0,5).map(n=>({
      title:n.title||"",
      publisher:n.publisher||"",
      time:n.providerPublishTime?new Date(n.providerPublishTime*1000).toISOString():null
    })).filter(x=>x.title);
  }catch{return []}
}

const globalQueries=[
  "India stock market RBI oil FII",
  "global markets US yields Fed",
  "Brent crude Middle East shipping",
  "Bitcoin crypto macro ETF",
  "forex dollar rupee euro yen",
  "geopolitics tariffs sanctions markets"
];

async function globalNews(){
  const arr=[];
  for(const q of globalQueries){
    arr.push(...await searchNews(q));
  }
  const seen=new Set();
  return arr.filter(x=>x.title&&!seen.has(x.title)&&(seen.add(x.title)||true)).slice(0,18);
}

function technicalAgent(r){
  const vals=[];
  const add=v=>{if(Number.isFinite(v))vals.push(v);};
  if(Number.isFinite(r.rsiWeekly))add(r.rsiWeekly>=55?2:r.rsiWeekly<=45?-2:0);
  if(Number.isFinite(r.rsi))add(r.rsi>=55?2:r.rsi<=45?-2:0);
  if(Number.isFinite(r.rsi3h))add(r.rsi3h>=55?1.5:r.rsi3h<=45?-1.5:0);
  if(Number.isFinite(r.rsi1h))add(r.rsi1h>=55?2:r.rsi1h<=45?-2:0);
  if(Number.isFinite(r.rsi15))add(r.rsi15>=55?1:r.rsi15<=45?-1:0);
  if(Number.isFinite(r.rsi5))add(r.rsi5>=55?.8:r.rsi5<=45?-.8:0);
  if(Number.isFinite(r.priceVsSma20))add(clamp(r.priceVsSma20/2,-2,2));
  if(Number.isFinite(r.priceVsSma50))add(clamp(r.priceVsSma50/3,-2,2));
  if(r.bullDivergence)add(2.5);
  if(r.bearDivergence)add(-2.5);
  const score=vals.length?clamp(vals.reduce((a,b)=>a+b,0)/vals.length*2,-10,10):0;
  return{score:Number(score.toFixed(2)),label:score>=2?"BULLISH":score<=-2?"BEARISH":"MIXED",reason:(r.bullDivergence?"Bullish RSI divergence. ":r.bearDivergence?"Bearish RSI divergence. ":"")+"Multi-timeframe RSI + structure."};
}
function macroAgent(r,context){
  const m=context||{}, india=["INDIA F&O / EQUITY","INDEX"].includes(r.assetClass), crypto=r.assetClass==="CRYPTO";
  let score=0,reasons=[];
  const add=(v,label)=>{if(Number.isFinite(v)){score+=v;if(Math.abs(v)>=.5)reasons.push(label)}};
  const dxy=m.DXY,us10=m.US10Y,oil=m.BRENT,spx=m.SPX,ndx=m.NDX,usd=m.USDINR;
  if(india){
    add(Number.isFinite(dxy?.sentiment)?-dxy.sentiment*.35:0,"Dollar");
    add(Number.isFinite(us10?.sentiment)?-us10.sentiment*.25:0,"US yields");
    add(Number.isFinite(oil?.sentiment)?-oil.sentiment*.35:0,"Oil");
    add(Number.isFinite(spx?.sentiment)?spx.sentiment*.25:0,"S&P");
    add(Number.isFinite(ndx?.sentiment)?ndx.sentiment*.20:0,"Nasdaq");
    add(Number.isFinite(usd?.sentiment)?-usd.sentiment*.25:0,"USDINR");
  }else if(crypto){
    add(Number.isFinite(dxy?.sentiment)?-dxy.sentiment*.45:0,"Dollar");
    add(Number.isFinite(us10?.sentiment)?-us10.sentiment*.35:0,"US yields");
    add(Number.isFinite(ndx?.sentiment)?ndx.sentiment*.30:0,"Nasdaq");
  }else{
    add(Number.isFinite(spx?.sentiment)?spx.sentiment*.30:0,"Global equities");
    add(Number.isFinite(dxy?.sentiment)?-dxy.sentiment*.20:0,"Dollar");
    add(Number.isFinite(us10?.sentiment)?-us10.sentiment*.15:0,"US yields");
  }
  const recent=(m.news||[]).filter(n=>n.time&&Date.now()-new Date(n.time).getTime()<=6*60*60*1000);
  if(recent.length)reasons.push("Recent headline flow");
  return{score:Number(clamp(score,-10,10).toFixed(2)),label:score>=2?"SUPPORTIVE":score<=-2?"ADVERSE":"MIXED",reason:reasons.join(" · ")||"No strong cross-market shock detected."};
}
function flowAgent(r){
  if(!r.optionAvailable)return{score:0,label:"NO CHAIN",reason:"No public option chain in snapshot."};
  let score=0,reasons=[];
  if(Number.isFinite(r.pcr)){if(r.pcr>1.25){score+=1.5;reasons.push("High PCR")}else if(r.pcr<.75){score-=1.5;reasons.push("Low PCR")}}
  if(Number.isFinite(r.crowdingLevel)&&r.crowdingLevel>=75){score*=.65;reasons.push("High crowding: confidence haircut")}
  if(r.bullDivergence&&r.direction==="BEARISH"){score+=2;reasons.push("Bullish divergence vs bearish bias")}
  if(r.bearDivergence&&r.direction==="BULLISH"){score-=2;reasons.push("Bearish divergence vs bullish bias")}
  if(Number.isFinite(r.volumeRatio)){if(r.volumeRatio>=1.5)score+=.8;else if(r.volumeRatio<.7)score-=.5}
  return{score:Number(clamp(score,-10,10).toFixed(2)),label:score>=2?"CALL PRESSURE":score<=-2?"PUT PRESSURE":"MIXED",reason:reasons.join(" · ")||"No decisive option-flow imbalance."};
}
function fusionAgent(r,context){
  const t=technicalAgent(r),m=macroAgent(r,context),o=flowAgent(r);
  const total=t.score*.52+m.score*.28+o.score*.20;
  let contradiction=0;
  if(Math.sign(t.score)&&Math.sign(m.score)&&Math.sign(t.score)!==Math.sign(m.score))contradiction+=1.2;
  if(Math.sign(t.score)&&Math.sign(o.score)&&Math.sign(t.score)!==Math.sign(o.score))contradiction+=.8;
  const fused=clamp(total-Math.sign(total||1)*contradiction,-10,10);
  const direction=fused>=3?"BULLISH":fused<=-3?"BEARISH":"NEUTRAL";
  const confidence=Math.round(clamp(50+Math.abs(fused)*3.4+(Math.abs(t.score)>=3?9:0)+(Math.abs(m.score)>=2?6:0)+(o.label==="NO CHAIN"?-7:5)-contradiction*9,0,95));
  const reversal=Math.round(clamp((r.rsi!=null&&r.rsi<30?35:0)+(r.bullDivergence||r.bearDivergence?30:0)+(Math.abs(r.dayChange||0)>4?15:0)+(Number.isFinite(r.priceVsSma20)&&Math.abs(r.priceVsSma20)>5?15:0)+(contradiction>=1.5?10:0),0,95));
  const now=Date.now(),urgent=(context?.news||[]).some(n=>n.time&&now-new Date(n.time).getTime()<=15*60*1000);
  return{technical:t,macro:m,options:o,fused:Number(fused.toFixed(2)),direction,confidence,reversal,eventUrgency:urgent?Math.round(clamp(60+Math.abs(m.score)*5,0,95)):0,signalState:urgent?"EVENT_RECALC":contradiction>=1.5?"CONFLICT":"STABLE"};
}

async function researchSymbol(name, newsEnabled, optionEnabled, context={}, deep=true){
  const ys=symbolOf(name);
  const specs=deep
    ? [["d","2y","1d"],["h","90d","1h"],["m15","20d","15m"],["m5","7d","5m"]]
    : [["d","2y","1d"]];
  const got={};
  await Promise.all(specs.map(async ([k,range,interval])=>{
    try{ got[k]=rows(await yahoo("v8/finance/chart/"+encodeURIComponent(ys)+"?range="+range+"&interval="+interval)); }
    catch{ got[k]=[]; }
  }));
  const d=got.d||[];
  if(d.length<30) return {symbol:name,dataStatus:"DATA_UNAVAILABLE",asOf:null};
  const h=got.h||[], m15=got.m15||[], m5=got.m5||[];
  const last=d[d.length-1], prev=d[d.length-2];
  const price=last.c, dayChange=pct(price,prev.c), return5d=pct(price,d[Math.max(0,d.length-6)].c);
  const w=weekly(d);
  const r1d=rsi14(d),r1h=rsi14(h),r15=rsi14(m15),r5=rsi14(m5),r3h=rsi14(aggregate3h(h)),rW=rsi14(w);
  const s20=sma(d,20),s50=sma(d,50),atr=atr14(d),div=divergence(d);
  const volBase=sma(d.map(x=>({...x,c:x.v})),20);
  const volumeRatio=volBase?last.v/volBase:null;
  const trend=(price>s20?2:-2)+(price>s50?2:-2)+(return5d>0?1:-1)+(r1h>50?1:-1);
  const rawBase=clamp(trend*1.05+((r1d??50)-50)/12+(dayChange||0)*0.55+(return5d||0)*0.12+(div.bull?2:0)-(div.bear?2:0),-10,10);
  let opt={available:false};
  if(optionEnabled){
    try{ opt=optionNear(await yahoo("v7/finance/options/"+encodeURIComponent(ys)),price); }catch{}
  }

  let news=[];
  if(newsEnabled) news=await searchNews(name);

  const crowdingPre=opt.available?(opt.callOI+opt.putOI?Math.round(Math.abs(opt.callOI-opt.putOI)/(opt.callOI+opt.putOI)*100):0):null;
  const provisional={
    symbol:name,
    assetClass:["BTC","ETH"].includes(name)?"CRYPTO":["USDINR"].includes(name)?"FOREX":["DXY","US10Y"].includes(name)?"MACRO":["BRENT","GOLD"].includes(name)?"COMMODITY":["NIFTY","BANKNIFTY","SENSEX","SPX","NDX"].includes(name)?"INDEX":"INDIA F&O / EQUITY",
    rsi:r1d,rsiWeekly:rW,rsi3h,rsi1h:r1h,rsi15:r15,rsi5:r5,bullDivergence:div.bull,bearDivergence:div.bear,
    priceVsSma20:pct(price,s20),priceVsSma50:pct(price,s50),dayChange,volumeRatio,
    pcr:opt.pcr??null,crowdingLevel:crowdingPre,optionAvailable:opt.available,
    direction:rawBase>=3?"BULLISH":rawBase<=-3?"BEARISH":"NEUTRAL"
  };
  const ai=fusionAgent(provisional,{...context,news:[...(context.news||[]),...news]});
  const raw=ai.fused,direction=ai.direction,confidence=ai.confidence,reversal=ai.reversal;
  provisional.reversalRisk=reversal;
  const trap=trapAgent(provisional);
  const contraryDivergence=(direction==="BEARISH"&&div.bull)||(direction==="BULLISH"&&div.bear);
  const continuationBlocked=contraryDivergence||reversal>=55;
  const side=direction==="BULLISH"?"CALL":direction==="BEARISH"?"PUT":"WAIT";
  const recent5m=m5.length>=12?m5.slice(-12):m5;
  const oneHourMovePct=recent5m.length>=2?pct(recent5m[recent5m.length-1].c,recent5m[0].c):null;
  const nextHourOutlook=(r1h!=null&&r1h>=55&&r5!=null&&r5>=50&&oneHourMovePct!=null&&oneHourMovePct>=0)
    ?"BULLISH CONTINUATION / BUY ON 5M HOLD"
    :(r1h!=null&&r1h<=45&&r5!=null&&r5<=50&&oneHourMovePct!=null&&oneHourMovePct<=0)
      ?"BEARISH CONTINUATION / SELL ON 5M BREAK"
      :"MIXED — WAIT FOR 5M CONFIRMATION";
  const stockAtrPct=atr&&price?Math.abs(atr/price*100):null;
  const niftyRef=context?.NIFTY?.referenceReturns||[];
  const vixRef=context?.INDIAVIX?.referenceReturns||[];
  const stockReturns=returnsOf(d,120);
  const corrNifty=correlation(stockReturns,niftyRef);
  const corrVix=correlation(stockReturns,vixRef);
  const vixLevel=context?.INDIAVIX?.price??null;
  const vixPct=Number.isFinite(vixLevel)?vixLevel:null;
  const volRegime=volatilityRegime(stockAtrPct,vixPct?stockAtrPct*(vixPct/20):stockAtrPct);
  const volMultiplier=volRegime==="EXTREME"?1.9:volRegime==="ELEVATED"?1.55:volRegime==="LOW"?1.1:1.3;
  const expectedMove=atr?atr*volMultiplier:null;
  const nextSessionRangePct=expectedMove&&price?Math.abs(expectedMove/price*100):null;
  const nextSessionMovePct=direction==="BULLISH"?nextSessionRangePct:direction==="BEARISH"?-nextSessionRangePct:0;
  const chosenStrike=side==="CALL"?opt.nearCall:side==="PUT"?opt.nearPut:null;
  const chosenPremium=side==="CALL"?opt.callPremium:side==="PUT"?opt.putPremium:null;
  const bid=side==="CALL"?opt.callBid:side==="PUT"?opt.putBid:null, ask=side==="CALL"?opt.callAsk:side==="PUT"?opt.putAsk:null;
  const entryLow=Number.isFinite(bid)&&bid>0?bid:(Number.isFinite(chosenPremium)?chosenPremium*.97:null);
  const entryHigh=Number.isFinite(ask)&&ask>0?ask:(Number.isFinite(chosenPremium)?chosenPremium*1.03:null);
  const approxDelta=chosenStrike&&price&&side!=="WAIT"
    ?clamp(side==="CALL"?0.5-(chosenStrike-price)/(price*0.03):0.5+(chosenStrike-price)/(price*0.03),0.15,0.85)
    :null;
  const optionMovePct=chosenPremium&&nextSessionMovePct
    ?Math.abs((approxDelta*(price*Math.abs(nextSessionMovePct)/100))/chosenPremium*100)
    :null;
  const triggerWindow=m5.length?m5.slice(-30):d.slice(-20);
  const breakdown=Number(Math.min(...triggerWindow.map(x=>x.l)).toFixed(2));
  const breakout=Number(Math.max(...triggerWindow.map(x=>x.h)).toFixed(2));
  const gate=direction==="BULLISH"
    ?"WAIT → CALL IF 5M BREAKOUT ABOVE "+breakout
    :direction==="BEARISH"
      ?"WAIT → PUT IF 5M BREAKDOWN BELOW "+breakdown
      :"WAIT — NO CLEAR DIRECTION";
  const crowding=opt.available
    ? (opt.callOI+opt.putOI?Math.round(Math.abs(opt.callOI-opt.putOI)/(opt.callOI+opt.putOI)*100):0)
    : null;
  const bestStrike=opt.available
    ? ((side==="CALL"?opt.nearCall:side==="PUT"?opt.nearPut:null) ? ((side==="CALL"?opt.nearCall:opt.nearPut)+" "+(side==="CALL"?"CE":"PE")+" · indicative") : "ATM contract")
    : "ATM "+(side==="CALL"?"CALL":side==="PUT"?"PUT":"WAIT")+" · LIVE CHAIN REQUIRED";

  return {
    symbol:name,
    assetClass:["BTC","ETH"].includes(name)?"CRYPTO":["USDINR"].includes(name)?"FOREX":["DXY","US10Y"].includes(name)?"MACRO":["BRENT","GOLD"].includes(name)?"COMMODITY":["NIFTY","BANKNIFTY","SENSEX","SPX","NDX"].includes(name)?"INDEX":"INDIA F&O / EQUITY",
    dataStatus:"SCHEDULED_PUBLIC_SNAPSHOT",
    asOf:new Date(last.t*1000).toISOString(),
    price,dayChange,return5d,sentiment:raw,confidence,direction,
    aiAgents:{technical:ai.technical,macro:ai.macro,options:ai.options,trap,continuation:direction==="BULLISH"?confidence:direction==="BEARISH"?confidence:50,reversalRisk:reversal,fused:ai.fused,eventUrgency:ai.eventUrgency,signalState:ai.signalState},
    rsi:r1d,rsiWeekly:rW,rsi3h,rsi1h:r1h,rsi15:r15,rsi5:r5,
    divergence:div.score,bullDivergence:div.bull,bearDivergence:div.bear,
    volume:last.v,volumeRatio,
    priceVsSma20:pct(price,s20),priceVsSma50:pct(price,s50),
    trendStrength:Math.round(clamp(50+trend*8,0,100)),reversalRisk:reversal,
    crowdingLevel:crowding,
    crowdingSide:opt.available
      ?"PCR "+(opt.pcr==null?"—":opt.pcr.toFixed(2))+" · Call wall "+(opt.callWall??"—")+" · Put wall "+(opt.putWall??"—")
      :"OI / crowding unavailable in public snapshot",
    callWall:opt.callWall??null,putWall:opt.putWall??null,pcr:opt.pcr??null,
    optionPremium:chosenPremium??null,optionEntryLow:entryLow,optionEntryHigh:entryHigh,optionDelta:approxDelta,optionMovePct,volatility:{stockAtrPct,vixLevel,corrNifty,corrVix,regime:volRegime,multiplier:volMultiplier},trapIntent:trap,
    falseContrarianRisk:reversal,
    optionSuitable:opt.available&&confidence>=65&&direction!=="NEUTRAL"&&!continuationBlocked,
    tradeSide:side,
    bestStrike,
    iv:opt.iv??null,expiry:opt.expiry??null,
    optionsScore:opt.available?75:null,
    breakout,breakdown,
    invalidation:direction==="BEARISH"?breakout:direction==="BULLISH"?breakdown:null,
    target1:direction==="BEARISH"?Number((price-expectedMove*1.0).toFixed(2)):direction==="BULLISH"?Number((price+expectedMove*1.0).toFixed(2)):null,
    target2:direction==="BEARISH"?Number((price-expectedMove*1.6).toFixed(2)):direction==="BULLISH"?Number((price+expectedMove*1.6).toFixed(2)):null,
    expectedMove:expectedMove?Number(expectedMove.toFixed(2)):null,
    holding:"1–3 sessions",trigger5m:70,
    newsFactor:news.length?news.map(x=>x.title).join(" · "):"Public headline search unavailable / no recent result",
    catalyst:news.length?70:35,
    macro:null,correlation:{nifty:corrNifty,vix:corrVix},
    liquidity:volumeRatio?Math.round(clamp(60+volumeRatio*10,0,100)):null,
    oi:opt.available?Math.max(opt.callOI||0,opt.putOI||0):null,
    oiVolume:volumeRatio?Math.round(clamp(50+(volumeRatio-1)*40,0,100)):null,
    gate,
    optionReason:opt.available
      ?"Public option-chain response used for PCR/walls/indicative strike. Revalidate spread, depth, IV, Greeks and fresh OI at entry."
      :"No public option-chain snapshot was available; side is directional only and exact contract must not be treated as confirmed.",
    conclusion:direction==="NEUTRAL"
      ?"NO TRADE — DIRECTION NOT CONFIRMED"
      :(direction==="BEARISH"&&div.bull
        ?"BEARISH BIAS, BUT BULLISH RSI DIVERGENCE PRESENT — CANCEL BLIND PUT"
        :(direction==="BULLISH"&&div.bear
          ?"BULLISH BIAS, BUT BEARISH RSI DIVERGENCE PRESENT — CANCEL BLIND CALL"
          :(reversal>=55
            ?side+" BIAS, BUT REVERSAL RISK HIGH — WAIT FOR 5M CONFIRMATION"
            :(side+" ONLY AFTER 5M CONFIRMATION")))),
    nextHourOutlook,
    nextSessionBias:direction,
    nextSessionMovePct,
    eventFingerprint:JSON.stringify([name,dayChange,return5d,r1d,r1h,r15,r5,opt.pcr,opt.callWall,opt.putWall,...news.map(n=>n.title)]).slice(0,1200),
    optionScenario:side==="CALL"
      ?("CALL "+(opt.nearCall??"ATM")+" CE · indicative option move "+(optionMovePct!=null?Math.round(optionMovePct)+"%":"reprice at trigger"))
      :side==="PUT"
        ?("PUT "+(opt.nearPut??"ATM")+" PE · indicative option move "+(optionMovePct!=null?Math.round(optionMovePct)+"%":"reprice at trigger"))
        :"WAIT — no option side until direction confirms",
    planNote:"Direction, reversal and trap intent are separate. Entry activates only after the 5M gate. Stop/targets are volatility-adjusted using stock ATR, India VIX regime and rolling correlation with NIFTY/VIX; option premium is indicative and must be revalidated at execution.",
    stopLoss:direction==="BEARISH"?Number((price+expectedMove*0.85).toFixed(2)):direction==="BULLISH"?Number((price-expectedMove*0.85).toFixed(2)):null,
    target3:direction==="BEARISH"?Number((price-expectedMove*2.2).toFixed(2)):direction==="BULLISH"?Number((price+expectedMove*2.2).toFixed(2)):null,
    optionStop:chosenPremium&&optionMovePct!=null?Number((chosenPremium*(1-Math.min(.65,Math.max(.25,volMultiplier*.18)))).toFixed(2)):null,
    optionTarget1:chosenPremium&&optionMovePct!=null?Number((chosenPremium*(1+Math.max(.35,Math.min(1.25,optionMovePct/100*.55)))).toFixed(2)):null,
    optionTarget2:chosenPremium&&optionMovePct!=null?Number((chosenPremium*(1+Math.max(.75,Math.min(2.0,optionMovePct/100*1.0)))).toFixed(2)):null,
    optionTarget3:chosenPremium&&optionMovePct!=null?Number((chosenPremium*(1+Math.max(1.25,Math.min(3.0,optionMovePct/100*1.6)))).toFixed(2)):null,
    backtestStatus:"PHASE A BASELINE ONLY: exact 5M + historical option-chain replay not connected",
    sourceNote:"GitHub Actions scheduled public snapshot from Yahoo Finance chart/search endpoints; not licensed exchange/participant data.",
  };
}

async function mapLimit(items,limit,fn){
  const out=new Array(items.length);
  let cursor=0;
  async function worker(){
    while(true){
      const i=cursor++;
      if(i>=items.length) return;
      try{out[i]=await fn(items[i],i);}catch{out[i]=null;}
    }
  }
  await Promise.all(Array.from({length:Math.min(limit,items.length)},worker));
  return out;
}

const allSymbols=[...new Set([...CORE,...STOCKS])];
const data={generatedAt:new Date().toISOString(),symbols:{},news:[],previousGeneratedAt:null,previousEventFingerprint:null,eventChanged:false};
try{
  const fs=await import("node:fs/promises");
  const prev=JSON.parse(await fs.readFile("data/latest.json","utf8"));
  data.previousGeneratedAt=prev.generatedAt||null;
  data.previousEventFingerprint=prev.eventFingerprint||null;
}catch{}
data.news=await globalNews();
let context={news:data.news};
const coreResults=await mapLimit(CORE,2,(s)=>researchSymbol(s,true,STOCK_OPTION_NAMES.includes(s),context));
for(const r of coreResults)if(r?.symbol)data.symbols[r.symbol]=r;
for(const r of coreResults){ if(r?.symbol && ["NIFTY","BANKNIFTY","INDIAVIX"].includes(r.symbol)){ try{ const rr=await rows(await yahoo("v8/finance/chart/"+encodeURIComponent(symbolOf(r.symbol))+"?range=2y&interval=1d")); r.referenceReturns=returnsOf(rr,120); }catch{} } }
context={...context,...Object.fromEntries(Object.entries(data.symbols).map(([k,v])=>[k,v]))};
const stockResults=await mapLimit(STOCKS,2,(s)=>researchSymbol(s,false,STOCK_OPTION_NAMES.includes(s),context,false));
for(const r of stockResults)if(r?.symbol)data.symbols[r.symbol]=r;
data.eventFingerprint=Object.values(data.symbols).map(x=>x.eventFingerprint||"").sort().join("|").slice(0,5000);
data.eventChanged=!!data.previousEventFingerprint&&data.eventFingerprint!==data.previousEventFingerprint;
const valid=Object.values(data.symbols).filter(x=>x.dataStatus==="SCHEDULED_PUBLIC_SNAPSHOT" && Number.isFinite(Number(x.price))).length;
const minimumValid=20;
// Validate BEFORE writing. The old implementation wrote an empty snapshot and only
// then threw, contradicting its "previous snapshot preserved" promise.
if(valid<minimumValid){
  console.error(JSON.stringify({refreshStatus:"ABORTED",generatedAt:data.generatedAt,validSymbols:valid,minimumValid,totalRequested:allSymbols.length,news:data.news.length}));
  throw new Error("REFRESH_ABORTED: only "+valid+" valid symbols; minimum "+minimumValid+". Existing snapshot left untouched.");
}
await mkdir("data",{recursive:true});
await writeFile("data/latest.json",JSON.stringify(data,null,2)+"\n","utf8");
console.log(JSON.stringify({refreshStatus:"SUCCESS",generatedAt:data.generatedAt,validSymbols:valid,news:data.news.length,totalRequested:allSymbols.length,eventChanged:data.eventChanged}));