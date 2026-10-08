/* TRAP AI Decision Engine v3 — canonical weighted evidence model */
window.TRAP_CONFIG=Object.freeze({
  timeframes:["1W","1D","3H","1H","15M","5M"],
  weights:Object.freeze({
    regime:18,structure:18,rsi:15,divergence:14,oiVolume:10,
    options:8,sentiment:7,liquidity:5,catalyst:3,macro:2
  }),
  reversalTrap:90,reversalCrowdHigh:90,reversalCrowdLow:20
});
function clamp(x,a=0,b=100){return Math.max(a,Math.min(b,Number(x)||0));}
function signed10(x){return clamp(x,-10,10);}
function weightedEvidence(f){
  const w=TRAP_CONFIG.weights;
  let total=0,used=0;
  for(const k of Object.keys(w)){
    if(Number.isFinite(Number(f[k]))){ total+=clamp(f[k])*w[k]; used+=w[k]; }
  }
  return {score:used?total/used:0,coverage:used/100};
}
function modelScore(f){
  const r=weightedEvidence(f);
  return Math.round(r.score*10)/10;
}
function confidence(f){
  const e=weightedEvidence(f);
  const coverage=Math.min(1,e.coverage);
  const agreement=Number.isFinite(Number(f.agreement))?clamp(f.agreement):70;
  return Math.round(clamp(coverage*75+agreement*.25));
}
function sentimentScore(f){
  const parts=[];
  if(Number.isFinite(Number(f.return1d)))parts.push(Number(f.return1d)*1.8);
  if(Number.isFinite(Number(f.return5d)))parts.push(Number(f.return5d)*.7);
  if(Number.isFinite(Number(f.priceVsSma20)))parts.push(Number(f.priceVsSma20)*.8);
  if(Number.isFinite(Number(f.priceVsSma50)))parts.push(Number(f.priceVsSma50)*.5);
  if(Number.isFinite(Number(f.rsiBias)))parts.push(Number(f.rsiBias)*5);
  if(Number.isFinite(Number(f.oiBias)))parts.push(Number(f.oiBias)*5);
  if(Number.isFinite(Number(f.relativeStrength)))parts.push(Number(f.relativeStrength)*4);
  let s=parts.length?parts.reduce((a,b)=>a+b,0)/parts.length:0;
  if(f.bearishDivergence)s-=2;
  if(f.bullishDivergence)s+=2;
  if(Number(f.return1d)<=-2 && Number(f.priceVsSma20)<0 && Number(f.priceVsSma50)<0)s=Math.min(s,1.5);
  if(Number(f.return1d)>=2 && Number(f.priceVsSma20)>0 && Number(f.priceVsSma50)>0)s=Math.max(s,-1.5);
  return signed10(s);
}
function evidenceQuality(f){
  const keys=["regime","structure","rsi","divergence","oiVolume","options","sentiment","liquidity","catalyst","macro"];
  return Math.round(keys.filter(k=>Number.isFinite(Number(f[k]))).length/keys.length*100);
}
function trapScore(f){
  let s=Number.isFinite(Number(f.crowding))?clamp(f.crowding):50;
  if(f.bearishDivergence||f.bullishDivergence)s+=12;
  if(Number(f.oiPriceDivergence)>0)s+=12;
  if(Number(f.exhaustion)>0)s+=15;
  if(Number(f.falseBreakRisk)>0)s+=15;
  return Math.round(clamp(s));
}
function evaluate(f){
  const evidence=weightedEvidence(f);
  const score=modelScore(f);
  const conf=confidence(f);
  const quality=evidenceQuality(f);
  const trap=Number.isFinite(Number(f.trap))?clamp(f.trap):trapScore(f);
  return Object.freeze({
    score,confidence:conf,dataQuality:quality,trap,
    signal:f.signal||"WATCH",
    reason:f.reason||"Evidence score only; intraday trigger still required.",
    pass:conf>=70 && quality>=70
  });
}
window.TRAP_ENGINE=Object.freeze({
  config:TRAP_CONFIG,weightedEvidence,modelScore,confidence,
  sentimentScore,evidenceQuality,trapScore,evaluate
});