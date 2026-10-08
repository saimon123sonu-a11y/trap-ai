/* TRAP AI Decision Engine v4 — 150-stock selection + correlation + sentiment-first intelligence */
window.TRAP_CONFIG=Object.freeze({
  timeframes:["1W","1D","3H","1H","15M","5M"],
  weights:Object.freeze({
    regime:14,structure:15,rsi:12,divergence:12,oiVolume:9,
    options:8,sentiment:16,liquidity:5,catalyst:4,macro:5
  }),
  scanUniverseTarget:150,
  carryForwardTarget:{bearish:5,bullish:5,reversal:5},
  actionableConfidence:78,
  actionableScore:80,
  maxWatchlist:20
});
function clamp(x,a=0,b=100){return Math.max(a,Math.min(b,Number(x)||0));}
function signed10(x){return Math.max(-10,Math.min(10,Number(x)||0));}
function pct(x){return Number.isFinite(Number(x))?Number(x):null;}
function weightedEvidence(f){
  const w=TRAP_CONFIG.weights; let total=0,used=0;
  for(const k of Object.keys(w)){
    if(Number.isFinite(Number(f[k]))){ total+=clamp(f[k])*w[k]; used+=w[k]; }
  }
  return {score:used?total/used:0,coverage:used/100};
}
function modelScore(f){return Math.round(weightedEvidence(f).score*10)/10;}
function correlationPct(seriesA,seriesB){
  if(!Array.isArray(seriesA)||!Array.isArray(seriesB)) return null;
  const n=Math.min(seriesA.length,seriesB.length);
  if(n<10)return null;
  const a=seriesA.slice(-n).map(Number),b=seriesB.slice(-n).map(Number);
  const ma=a.reduce((x,y)=>x+y,0)/n, mb=b.reduce((x,y)=>x+y,0)/n;
  let num=0,da=0,db=0;
  for(let i=0;i<n;i++){const x=a[i]-ma,y=b[i]-mb;num+=x*y;da+=x*x;db+=y*y;}
  if(!da||!db)return null;
  return Math.round((num/Math.sqrt(da*db))*100);
}
function correlationScore(c){
  if(!Number.isFinite(Number(c)))return 50;
  const a=Math.abs(Number(c));
  return Math.round(100-(a*.25));
}
function sentimentScore(f){
  const parts=[];
  if(Number.isFinite(Number(f.return1d)))parts.push(Number(f.return1d)*1.7);
  if(Number.isFinite(Number(f.return5d)))parts.push(Number(f.return5d)*.7);
  if(Number.isFinite(Number(f.priceVsSma20)))parts.push(Number(f.priceVsSma20)*.8);
  if(Number.isFinite(Number(f.priceVsSma50)))parts.push(Number(f.priceVsSma50)*.5);
  if(Number.isFinite(Number(f.rsiBias)))parts.push(Number(f.rsiBias)*4.5);
  if(Number.isFinite(Number(f.oiBias)))parts.push(Number(f.oiBias)*4);
  if(Number.isFinite(Number(f.relativeStrength)))parts.push(Number(f.relativeStrength)*4);
  let s=parts.length?parts.reduce((a,b)=>a+b,0)/parts.length:0;
  if(f.bearishDivergence)s-=2;
  if(f.bullishDivergence)s+=2;
  if(Number(f.return1d)<=-2 && Number(f.priceVsSma20)<0 && Number(f.priceVsSma50)<0)s=Math.min(s,-0.5);
  if(Number(f.return1d)>=2 && Number(f.priceVsSma20)>0 && Number(f.priceVsSma50)>0)s=Math.max(s,0.5);
  return signed10(s);
}
function trapScore(f){
  let s=Number.isFinite(Number(f.crowding))?clamp(f.crowding):50;
  if(f.bearishDivergence||f.bullishDivergence)s+=12;
  if(Number(f.oiPriceDivergence)>0)s+=12;
  if(Number(f.exhaustion)>0)s+=15;
  if(Number(f.falseBreakRisk)>0)s+=15;
  return Math.round(clamp(s));
}
function evidenceQuality(f){
  const keys=Object.keys(TRAP_CONFIG.weights);
  return Math.round(keys.filter(k=>Number.isFinite(Number(f[k]))).length/keys.length*100);
}
function confidence(f){
  const e=weightedEvidence(f), coverage=Math.min(1,e.coverage);
  const agreement=Number.isFinite(Number(f.agreement))?clamp(f.agreement):60;
  const sentimentQuality=Number.isFinite(Number(f.sentimentQuality))?clamp(f.sentimentQuality):60;
  return Math.round(clamp(coverage*55+agreement*.2+sentimentQuality*.25));
}
function evaluate(f){
  const sentiment=Number.isFinite(Number(f.sentimentScore))?signed10(f.sentimentScore):sentimentScore(f);
  const corr=Number.isFinite(Number(f.correlation))?Number(f.correlation):null;
  const evidence=weightedEvidence({...f,sentiment:clamp((sentiment+10)*5)});
  const score=modelScore({...f,sentiment:clamp((sentiment+10)*5)});
  const conf=confidence({...f,sentimentQuality:f.sentimentQuality});
  const quality=evidenceQuality(f);
  const trap=Number.isFinite(Number(f.trap))?clamp(f.trap):trapScore(f);
  return Object.freeze({
    score,confidence:conf,dataQuality:quality,trap,
    sentimentScore:sentiment,correlation:corr,
    signal:f.signal||"WATCH",
    pass:conf>=TRAP_CONFIG.actionableConfidence && score>=TRAP_CONFIG.actionableScore && quality>=70
  });
}
function rankUniverse(rows){
  return [...rows].map(r=>({...r,_eval:evaluate(r)})).sort((a,b)=>b._eval.score-a._eval.score);
}
function selectCarryForward(rows){
  const all=rankUniverse(rows);
  const bearish=all.filter(x=>x.direction==="BEARISH").sort((a,b)=>b._eval.score-a._eval.score).slice(0,TRAP_CONFIG.carryForwardTarget.bearish);
  const bullish=all.filter(x=>x.direction==="BULLISH").sort((a,b)=>b._eval.score-a._eval.score).slice(0,TRAP_CONFIG.carryForwardTarget.bullish);
  const reversal=all.filter(x=>x.reversalCandidate).sort((a,b)=>b.reversalScore-a.reversalScore).slice(0,TRAP_CONFIG.carryForwardTarget.reversal);
  return [...bearish,...bullish,...reversal].slice(0,TRAP_CONFIG.maxWatchlist);
}
function actionableGate(f){
  const e=evaluate(f);
  const continuation=(f.direction==="BEARISH"||f.direction==="BULLISH") && Number(f.trigger5m)>=70 && Number(f.oiVolumeConfirm)>=70;
  const reversal=!!f.reversalCandidate && Number(f.divergenceConfirm)>=75 && Number(f.priceReclaim)>=70 && Number(f.oiVolumeConfirm)>=70;
  const liquidity=Number(f.liquidityRisk||0);
  return Object.freeze({
    ...e,
    actionable: e.confidence>=TRAP_CONFIG.actionableConfidence && e.score>=TRAP_CONFIG.actionableScore && liquidity<65 && (continuation||reversal),
    gate:reversal?"REVERSAL CONFIRMED":continuation?"CONTINUATION CONFIRMED":"WAIT"
  });
}
window.TRAP_ENGINE=Object.freeze({
  config:TRAP_CONFIG,weightedEvidence,modelScore,correlationPct,correlationScore,
  sentimentScore,trapScore,evidenceQuality,confidence,evaluate,rankUniverse,
  selectCarryForward,actionableGate
});