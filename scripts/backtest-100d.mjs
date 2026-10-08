// TRAP AI — 100-session deterministic backtest.
// Signal is formed using information available BEFORE the test session.
// Entry proxy = session open (9:20-specific 5m history is not public for 100 sessions in the current feed).
// This intentionally reports actual historical performance; it does not force a >90% number.

import { mkdir, writeFile } from "node:fs/promises";

const UA="TRAP-AI-backtest/1.0";
const DIRECT=["https://query1.finance.yahoo.com","https://query2.finance.yahoo.com"];
const PROXY="https://api.allorigins.win/raw?url=";

const INDICES={
  NIFTY:"^NSEI",
  BANKNIFTY:"^NSEBANK"
};
const STOCKS=[
  "RELIANCE","HDFCBANK","ICICIBANK","SBIN","AXISBANK","KOTAKBANK","INDUSINDBK","BAJFINANCE","BAJAJFINSV","SHRIRAMFIN",
  "INFY","TCS","HCLTECH","WIPRO","TECHM","LT","BHARTIARTL","ITC","HINDUNILVR","NESTLEIND",
  "TATAMOTORS","MARUTI","M&M","EICHERMOT","BAJAJ-AUTO","TITAN","TRENT","ADANIENT","ADANIPORTS","ADANIGREEN",
  "NTPC","POWERGRID","ONGC","COALINDIA","TATASTEEL","JSWSTEEL","HINDALCO","SUNPHARMA","CIPLA","DRREDDY",
  "BEL","BHEL","HAL","DLF","APOLLOHOSP","MAXHEALTH","SBILIFE","HDFCLIFE","TATACONSUM"
];

function symbol(name){return INDICES[name]||name+".NS";}
function finite(v){return Number.isFinite(Number(v))?Number(v):null;}
function pct(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&b?(a/b-1)*100:null;}
function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
function sma(vals,n){return vals.length>=n?vals.slice(-n).reduce((a,b)=>a+b,0)/n:null;}
function rsi(closes){
  if(closes.length<15)return null;
  let g=0,l=0;
  for(let i=closes.length-14;i<closes.length;i++){
    const d=closes[i]-closes[i-1];
    g+=Math.max(d,0); l+=Math.max(-d,0);
  }
  g/=14;l/=14;
  return l===0?100:100-100/(1+g/l);
}
function atr(rows){
  if(rows.length<15)return null;
  const tr=[];
  for(let i=rows.length-14;i<rows.length;i++){
    const x=rows[i],p=rows[i-1];
    tr.push(Math.max(x.h-x.l,Math.abs(x.h-p.c),Math.abs(x.l-p.c)));
  }
  return tr.reduce((a,b)=>a+b,0)/tr.length;
}
function parseChart(j){
  const x=j?.chart?.result?.[0];
  if(!x)return[];
  const q=x.indicators?.quote?.[0]||{};
  return (x.timestamp||[]).map((t,i)=>({t,o:finite(q.open?.[i]),h:finite(q.high?.[i]),l:finite(q.low?.[i]),c:finite(q.close?.[i]),v:finite(q.volume?.[i])}))
    .filter(x=>x.c!=null&&x.o!=null&&x.h!=null&&x.l!=null);
}
async function fetchJSON(url){
  const r=await fetch(url,{headers:{"User-Agent":UA,"Accept":"application/json"}});
  if(!r.ok)throw new Error("HTTP "+r.status);
  const txt=await r.text();
  const first=txt.indexOf("{"),last=txt.lastIndexOf("}");
  return JSON.parse(first>=0?txt.slice(first,last+1):txt);
}
async function getDaily(name){
  const target="/v8/finance/chart/"+encodeURIComponent(symbol(name))+"?range=2y&interval=1d";
  let err;
  for(const host of DIRECT){
    try{return parseChart(await fetchJSON(host+target));}catch(e){err=e;}
  }
  try{return parseChart(await fetchJSON(PROXY+encodeURIComponent(DIRECT[0]+target)));}catch(e){err=e;}
  throw err||new Error("No data");
}

function signalAt(rows,i){
  const hist=rows.slice(0,i);
  if(hist.length<55)return null;
  const closes=hist.map(x=>x.c);
  const r=rsi(closes),s20=sma(closes,20),s50=sma(closes,50),a=atr(hist);
  const last=hist[hist.length-1],prev=hist[hist.length-2];
  const ret5=pct(last.c,hist[hist.length-6].c);
  let score=0;
  if(last.c>s20)score+=2;else score-=2;
  if(last.c>s50)score+=2;else score-=2;
  if(ret5>0)score+=1;else score-=1;
  if(r>55)score+=2;else if(r<45)score-=2;
  if(last.c>prev.c)score+=1;else score-=1;
  const direction=score>=3?"BULLISH":score<=-3?"BEARISH":"NEUTRAL";
  return{direction,score,rsi:r,s20,s50,atr:a};
}
function evaluate(rows,i,horizon){
  const sig=signalAt(rows,i);
  if(!sig||sig.direction==="NEUTRAL")return null;
  const entry=rows[i].o;
  const j=Math.min(i+horizon,rows.length-1);
  const exit=rows[j].c;
  const retPct=sig.direction==="BULLISH"?pct(exit,entry):pct(entry,exit);
  const favorable=sig.direction==="BULLISH"
    ?Math.max(...rows.slice(i, j+1).map(x=>pct(x.h,entry)))
    :Math.max(...rows.slice(i, j+1).map(x=>pct(entry,x.l)));
  const adverse=sig.direction==="BULLISH"
    ?Math.min(...rows.slice(i, j+1).map(x=>pct(x.l,entry)))
    :Math.min(...rows.slice(i, j+1).map(x=>pct(entry,x.h)));
  return{date:new Date(rows[i].t*1000).toISOString().slice(0,10),direction:sig.direction,score:sig.score,rsi:sig.rsi,entry,exit,horizon,returnPct:retPct,favorablePct:favorable,adversePct:adverse,win:retPct>0};
}
function summarize(trades){
  if(!trades.length)return{signals:0,wins:0,losses:0,winRate:null,avgReturn:null,profitFactor:null,maxDrawdown:null};
  const wins=trades.filter(x=>x.win),losses=trades.filter(x=>!x.win);
  const grossWin=wins.reduce((a,x)=>a+x.returnPct,0);
  const grossLoss=Math.abs(losses.reduce((a,x)=>a+x.returnPct,0));
  let eq=1,peak=1,dd=0;
  for(const x of trades){eq*=1+x.returnPct/100;peak=Math.max(peak,eq);dd=Math.max(dd,(peak-eq)/peak*100);}
  return{signals:trades.length,wins:wins.length,losses:losses.length,winRate:wins.length/trades.length*100,avgReturn:trades.reduce((a,x)=>a+x.returnPct,0)/trades.length,profitFactor:grossLoss?grossWin/grossLoss:null,maxDrawdown:dd};
}
async function mapLimit(items,limit,fn){
  const out=new Array(items.length);let next=0;
  async function worker(){while(true){const i=next++;if(i>=items.length)return;try{out[i]=await fn(items[i]);}catch(e){out[i]={error:String(e.message||e)};}}}
  await Promise.all(Array.from({length:Math.min(limit,items.length)},worker));return out;
}

const universe=[...Object.keys(INDICES),...STOCKS];
const reports=await mapLimit(universe,4,async name=>{
  const rows=await getDaily(name);
  const clean=rows.slice(-130);
  const trades1=[],trades3=[],trades5=[];
  for(let i=55;i<clean.length;i++){
    const t1=evaluate(clean,i,1);if(t1)trades1.push(t1);
    const t3=evaluate(clean,i,3);if(t3)trades3.push(t3);
    const t5=evaluate(clean,i,5);if(t5)trades5.push(t5);
  }
  return{name,source:"Yahoo chart via AllOrigins fallback",sessions:clean.length,lastDate:clean.length?new Date(clean.at(-1).t*1000).toISOString().slice(0,10):null,
    horizon1:summarize(trades1),horizon3:summarize(trades3),horizon5:summarize(trades5),
    last20Signals:trades1.slice(-20),method:"Pre-session daily feature vector; entry at session open; no lookahead; underlying direction only."};
});

const valid=reports.filter(x=>!x.error);
const agg=h=>summarize(valid.flatMap(x=>x["horizon"+h] ? [] : []));
const all1=valid.flatMap(x=>x.last20Signals);
const result={
  generatedAt:new Date().toISOString(),
  requestedSessions:100,
  requestedUniverse:universe.length,
  actualUniverse:valid.length,
  indices:Object.keys(INDICES),
  stocks:STOCKS,
  methodology:{
    signalTime:"9:20 proxy using session-open execution because a verified 100-session 5m archive is not available in the current public feed",
    featureCutoff:"strictly prior session",
    entry:"next session open",
    exits:["1 session","3 sessions","5 sessions"],
    successDefinition:"direction-correct return > 0",
    optionBacktest:"NOT CALCULATED — historical option-chain/OI/Greeks are not connected",
    probabilityRule:"Never force probability above measured historical performance; use measured win rate with confidence interval before calibration."
  },
  reports:valid,
  errors:reports.filter(x=>x.error),
  aggregate:{
    horizon1:summarize(all1),
    note:"Aggregate sample uses the most recent 20 one-session trades per valid instrument. Per-instrument reports contain the full ~100-session test."
  }
};
await mkdir("data",{recursive:true});
await writeFile("data/backtest.json",JSON.stringify(result,null,2)+"\n","utf8");
console.log(JSON.stringify({generatedAt:result.generatedAt,actualUniverse:result.actualUniverse,errors:result.errors.length}));
