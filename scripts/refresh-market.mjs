// TRAP AI scheduled public-data collector.
// Writes a same-origin snapshot so the GitHub Pages app does not depend on protected
// Vercel deployment access from a browser. No credentials are stored or required.

import { mkdir, writeFile } from "node:fs/promises";

const UA = "TRAP-AI-public-research/1.0";
const HOSTS = ["https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com"];

const CORE = [
  "NIFTY","BANKNIFTY","SENSEX","BTC","USDINR","DXY","US10Y","BRENT","GOLD","SPX","NDX"
];

const STOCKS = [
  "RELIANCE","HDFCBANK","ICICIBANK","SBIN","AXISBANK","KOTAKBANK","INFY","TCS","ITC","LT",
  "BHARTIARTL","ADANIENT","ADANIGREEN","TATAMOTORS","M&M","MARUTI","BAJAJ-AUTO","JSWSTEEL",
  "TATASTEEL","SUNPHARMA","HINDALCO","NTPC","POWERGRID","ONGC","COALINDIA","JUBLFOOD",
  "TIINDIA","INOXWIND","LICHSGFIN","ICICIGI","PNBHOUSING","MPHASIS","EICHERMOT","JSWENERGY",
  "BEL","TRENT","DLF","SBILIFE","HDFCLIFE","INDUSINDBK"
];

const STOCK_OPTION_NAMES = STOCKS.slice(0, 20);

const MAP = {
  NIFTY:"^NSEI", BANKNIFTY:"^NSEBANK", SENSEX:"^BSESN",
  BTC:"BTC-USD", USDINR:"INR=X", DXY:"DX-Y.NYB", US10Y:"^TNX",
  BRENT:"BZ=F", GOLD:"GC=F", SPX:"^GSPC", NDX:"^NDX"
};

function symbolOf(name){
  return MAP[name] || name + ".NS";
}
function finite(v){ return Number.isFinite(Number(v)) ? Number(v) : null; }
function clamp(v,a,b){ v=Number(v); return Number.isFinite(v)?Math.min(b,Math.max(a,v)):a; }
function pct(a,b){ return Number.isFinite(a)&&Number.isFinite(b)&&b ? (a/b-1)*100 : null; }
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

let sessionPromise;
async function yahooSession(){
  if(sessionPromise) return sessionPromise;
  sessionPromise=(async()=>{
    let cookie="";
    try{
      const r=await fetch("https://fc.yahoo.com",{headers:{"User-Agent":UA}});
      cookie=r.headers.get("set-cookie")||"";
      cookie=cookie.split(";")[0];
    }catch{}
    let crumb="";
    try{
      const r=await fetch(HOSTS[0]+"/v1/test/getcrumb",{headers:{"User-Agent":UA,...(cookie?{Cookie:cookie}:{})}});
      if(r.ok) crumb=(await r.text()).trim();
    }catch{}
    return {cookie,crumb};
  })();
  return sessionPromise;
}

async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function yahoo(path){
  const s=await yahooSession();
  const qs = s.crumb && (path.startsWith("v7/") ? (path.includes("?")?"&":"?")+"crumb="+encodeURIComponent(s.crumb) : "");
  const fullPath=path+qs;
  let lastErr;
  for(const host of HOSTS){
    for(let attempt=0;attempt<2;attempt++){
      try{
        const r=await fetch(host+"/"+fullPath,{
          headers:{
            "Accept":"application/json",
            "User-Agent":UA,
            ...(s.cookie?{Cookie:s.cookie}:{}),
            "Cache-Control":"no-cache"
          }
        });
        if(r.ok) return await r.json();
        lastErr=new Error("HTTP "+r.status);
      }catch(e){ lastErr=e; }
      await sleep(250*(attempt+1));
    }
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

async function researchSymbol(name, newsEnabled, optionEnabled){
  const ys=symbolOf(name);
  const specs=[
    ["d","2y","1d"],
    ["h","90d","1h"],
    ["m15","20d","15m"],
    ["m5","7d","5m"]
  ];
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
  const trend=(price>s20?2:-2)+(price>s50?2:-2)+(return5>0?1:-1)+(r1h>50?1:-1);
  const raw=clamp(trend*1.05+((r1d??50)-50)/12+(dayChange||0)*0.55+(return5||0)*0.12+(div.bull?2:0)-(div.bear?2:0),-10,10);
  const direction=raw>=3?"BULLISH":raw<=-3?"BEARISH":"NEUTRAL";
  const lookback=m5.length?m5.slice(-30):d.slice(-20);
  const breakdown=Number(Math.min(...lookback.map(x=>x.l)).toFixed(2));
  const breakout=Number(Math.max(...lookback.map(x=>x.h)).toFixed(2));
  const reversal=Math.round(clamp(
    (r1d!=null&&r1d<30?35:0)+(div.bull||div.bear?30:0)+(dayChange<-4?15:0)+
    (Math.abs(price-(s20||price))/(atr||1)>2?15:0),0,95
  ));

  let opt={available:false};
  if(optionEnabled){
    try{ opt=optionNear(await yahoo("v7/finance/options/"+encodeURIComponent(ys)),price); }catch{}
  }

  let news=[];
  if(newsEnabled) news=await searchNews(name);

  const quality=(d.length>=30?25:0)+(h.length>=30?20:0)+(m15.length>=30?15:0)+(m5.length>=30?15:0);
  const confidence=Math.round(clamp(45+quality*.45+(opt.available?8:0)+(news.length?5:0)+(div.bull||div.bear?7:0)+(Math.abs(raw)>=5?5:0),0,95));
  const side=direction==="BULLISH"?"CALL":direction==="BEARISH"?"PUT":"WAIT";
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
    falseContrarianRisk:reversal,
    optionSuitable:opt.available&&confidence>=65&&direction!=="NEUTRAL",
    tradeSide:side,
    bestStrike,
    iv:opt.iv??null,expiry:opt.expiry??null,
    optionsScore:opt.available?75:null,
    breakout,breakdown,
    invalidation:direction==="BEARISH"?breakout:direction==="BULLISH"?breakdown:null,
    target1:direction==="BEARISH"?Number((price-(atr||0)*1.5).toFixed(2)):direction==="BULLISH"?Number((price+(atr||0)*1.5).toFixed(2)):null,
    target2:direction==="BEARISH"?Number((price-(atr||0)*2.5).toFixed(2)):direction==="BULLISH"?Number((price+(atr||0)*2.5).toFixed(2)):null,
    expectedMove:atr?Number((atr*1.5).toFixed(2)):null,
    holding:"1–3 sessions",trigger5m:70,
    newsFactor:news.length?news.map(x=>x.title).join(" · "):"Public headline search unavailable / no recent result",
    catalyst:news.length?70:35,
    macro:null,correlation:null,
    liquidity:volumeRatio?Math.round(clamp(60+volumeRatio*10,0,100)):null,
    oi:opt.available?Math.max(opt.callOI||0,opt.putOI||0):null,
    oiVolume:volumeRatio?Math.round(clamp(50+(volumeRatio-1)*40,0,100)):null,
    gate,
    optionReason:opt.available
      ?"Public option-chain response used for PCR/walls/indicative strike. Revalidate spread, depth, IV, Greeks and fresh OI at entry."
      :"No public option-chain snapshot was available; side is directional only and exact contract must not be treated as confirmed.",
    conclusion:direction==="NEUTRAL"
      ?"NO TRADE — DIRECTION NOT CONFIRMED"
      :(div.bull&&direction==="BEARISH"
        ?"BEARISH BIAS, BUT BULLISH RSI DIVERGENCE PRESENT — CANCEL BLIND PUT"
        :(side+" ONLY AFTER 5M CONFIRMATION")),
    backtestStatus:"NOT RUN: historical option-chain dataset is not connected",
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
const data={generatedAt:new Date().toISOString(),symbols:{},news:[]};

const results=await mapLimit(allSymbols,8,(s)=>researchSymbol(s,STOCK_OPTION_NAMES.includes(s)||CORE.includes(s),STOCK_OPTION_NAMES.includes(s)));
for(const r of results){
  if(r&&r.symbol) data.symbols[r.symbol]=r;
}
data.news=await globalNews();

await mkdir("data",{recursive:true});
await writeFile("data/latest.json",JSON.stringify(data,null,2)+"\n","utf8");

const valid=Object.values(data.symbols).filter(x=>x.dataStatus==="SCHEDULED_PUBLIC_SNAPSHOT").length;
console.log(JSON.stringify({generatedAt:data.generatedAt,validSymbols:valid,news:data.news.length,totalRequested:allSymbols.length}));
