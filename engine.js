/* TRAP AI Decision Engine v6
   Research layer: one stock -> full evidence stack -> direction -> option suitability -> timing gate.
   No crowding-only trade. No fabricated live data. Continuation and reversal are separate.
*/
window.TRAP_CONFIG=Object.freeze({
  timeframes:["1W","1D","3H","1H","15M","5M"],
  weights:Object.freeze({
    regime:14,structure:15,rsi:12,divergence:12,oiVolume:9,
    options:8,sentiment:16,liquidity:5,catalyst:4,macro:5
  }),
  scanUniverseTarget:150,
  carryForwardTarget:Object.freeze({bearish:5,bullish:5,reversal:5}),
  actionableConfidence:78,
  actionableScore:80,
  maxWatchlist:15,
  requireHistoricalValidation:true
});

function clamp(x,a=0,b=100){const n=Number(x);return Number.isFinite(n)?Math.max(a,Math.min(b,n)):0;}
function signed10(x){return Math.max(-10,Math.min(10,Number(x)||0));}
function finite(x){return Number.isFinite(Number(x));}

function sentimentScore(f){
  const parts=[];
  if(finite(f.return1d))parts.push(Number(f.return1d)*1.7);
  if(finite(f.return5d))parts.push(Number(f.return5d)*.7);
  if(finite(f.priceVsSma20))parts.push(Number(f.priceVsSma20)*.8);
  if(finite(f.priceVsSma50))parts.push(Number(f.priceVsSma50)*.5);
  if(finite(f.rsiBias))parts.push(Number(f.rsiBias)*4.5);
  if(finite(f.oiBias))parts.push(Number(f.oiBias)*4);
  if(finite(f.relativeStrength))parts.push(Number(f.relativeStrength)*4);
  let s=parts.length?parts.reduce((a,b)=>a+b,0)/parts.length:0;
  if(f.bearishDivergence)s-=2;
  if(f.bullishDivergence)s+=2;
  return signed10(s);
}
function normalizeSentiment(s){return clamp((signed10(s)+10)*5);}

function evidence(f,sentiment){
  const w=TRAP_CONFIG.weights;
  const values={
    regime:clamp(f.regime),structure:clamp(f.structure),rsi:clamp(f.rsi),
    divergence:clamp(f.divergence),oiVolume:clamp(f.oiVolume),options:clamp(f.options),
    sentiment:normalizeSentiment(sentiment),liquidity:clamp(f.liquidity),
    catalyst:clamp(f.catalyst),macro:clamp(f.macro)
  };
  let total=0,used=0;
  for(const k of Object.keys(w)){
    if(finite(f[k]) || k==="sentiment"){total+=values[k]*w[k];used+=w[k];}
  }
  return {score:used?total/used:0,coverage:used/100,values};
}
function directionalEvidence(f,sentiment){
  const e=evidence(f,sentiment);
  return {bull:e.score,bear:100-e.score,coverage:e.coverage,values:e.values};
}
function confidence(f,coverage){
  const agreement=finite(f.agreement)?clamp(f.agreement):50;
  const sentimentQuality=finite(f.sentimentQuality)?clamp(f.sentimentQuality):50;
  return Math.round(clamp(Math.min(1,coverage)*55+agreement*.20+sentimentQuality*.25));
}
function reversalScore(f){
  let s=0;
  if(f.bullishDivergence)s+=35;
  if(f.bearishDivergence)s+=35;
  if(finite(f.exhaustion))s+=clamp(f.exhaustion)*.20;
  if(finite(f.falseBreakRisk))s+=clamp(f.falseBreakRisk)*.20;
  if(finite(f.oversold))s+=clamp(f.oversold)*.15;
  return Math.round(clamp(s));
}

function evaluate(f){
  const sentiment=finite(f.sentimentScore)?signed10(f.sentimentScore):sentimentScore(f);
  const d=directionalEvidence(f,sentiment);
  const direction=f.direction==="BEARISH"?"BEARISH":f.direction==="BULLISH"?"BULLISH":"NEUTRAL";
  const directionalScore=direction==="BEARISH"?d.bear:d.bull;
  const conf=confidence(f,d.coverage);
  const quality=Math.round(d.coverage*100);
  const trap=finite(f.trap)?clamp(f.trap):Math.round(clamp(
    (finite(f.crowding)?Number(f.crowding):50)*.45+
    (finite(f.falseBreakRisk)?Number(f.falseBreakRisk):50)*.25+
    (finite(f.exhaustion)?Number(f.exhaustion):50)*.30
  ));
  return Object.freeze({
    sentimentScore:sentiment,bullScore:Math.round(d.bull),bearScore:Math.round(d.bear),
    directionalScore:Math.round(directionalScore),confidence:conf,dataQuality:quality,trap,
    reversalScore:reversalScore(f),
    correlation:finite(f.correlation)?Number(f.correlation):null,
    signal:f.signal||"WATCH",
    historicalValidated:f.historicalValidated===true,
    pass:conf>=TRAP_CONFIG.actionableConfidence &&
      directionalScore>=TRAP_CONFIG.actionableScore && quality>=70
  });
}

function rankUniverse(rows){return [...rows].map(r=>({...r,_eval:evaluate(r)}));}
function selectCarryForward(rows){
  const all=rankUniverse(rows);
  const bearish=all.filter(x=>x.direction==="BEARISH").sort((a,b)=>b._eval.directionalScore-a._eval.directionalScore).slice(0,5);
  const bullish=all.filter(x=>x.direction==="BULLISH").sort((a,b)=>b._eval.directionalScore-a._eval.directionalScore).slice(0,5);
  const reversal=all.filter(x=>x.reversalCandidate===true).sort((a,b)=>b._eval.reversalScore-a._eval.reversalScore).slice(0,5);
  return [...bearish,...bullish,...reversal].slice(0,15);
}
function promoteValidated(rows){return [...rows].filter(x=>x&&x.historicalValidated===true);}

function actionableGate(f){
  const e=evaluate(f);
  const continuation=(f.direction==="BEARISH"||f.direction==="BULLISH") &&
    Number(f.trigger5m)>=70 && Number(f.oiVolumeConfirm)>=70 &&
    Number(f.liquidityRisk||0)<65 && f.historicalValidated===true;
  const reversal=f.reversalCandidate===true &&
    Number(f.divergenceConfirm)>=75 && Number(f.priceReclaim)>=70 &&
    Number(f.oiVolumeConfirm)>=70 && Number(f.liquidityRisk||0)<65 &&
    f.historicalValidated===true;
  return Object.freeze({
    ...e,
    actionable:e.confidence>=TRAP_CONFIG.actionableConfidence &&
      e.directionalScore>=TRAP_CONFIG.actionableScore && e.dataQuality>=70 &&
      (continuation||reversal),
    gate:reversal?"REVERSAL CONFIRMED":continuation?"CONTINUATION CONFIRMED":"WAIT",
    tradeSide:reversal?(f.bullishDivergence?"CALL":"PUT"):
      continuation?(f.direction==="BEARISH"?"PUT":"CALL"):"NONE"
  });
}

/*
  Research analyzer.
  The UI may receive live data through window.TRAP_DATA.research[symbol].
  This function deliberately returns "DATA_REQUIRED" when the required
  timestamp-safe inputs are absent instead of inventing today's values.
*/
function researchAnalyze(input){
  const f=input||{};
  const required=["price","return1d","rsi","volume","oi","optionChain"];
  const missing=required.filter(k=>f[k]===undefined||f[k]===null);
  const hasLive=f.dataStatus==="LIVE" || f.timestamp || f.asOf;
  const sentiment=finite(f.sentimentScore)?signed10(f.sentimentScore):sentimentScore(f);
  const e=evaluate({...f,sentimentScore:sentiment});
  const direction=f.direction || (sentiment>=3?"BULLISH":sentiment<=-3?"BEARISH":"NEUTRAL");
  const trendStrength=finite(f.trendStrength)?clamp(f.trendStrength):e.directionalScore;
  const reversalRisk=finite(f.reversalProbability)?clamp(f.reversalProbability):reversalScore(f);
  const crowdingSide=f.crowdingSide||"NOT CALCULATED";
  const crowdingLevel=finite(f.crowdingLevel)?clamp(f.crowdingLevel):null;
  const crowdingDivergence=!!f.crowdingDivergence;
  const falseContrarianRisk=finite(f.falseContrarianRisk)?clamp(f.falseContrarianRisk):null;
  const optionSuitable=f.optionSuitable===true;
  const tradeSide=f.tradeSide||"NONE";
  const gate=f.gate||"WAIT";
  const strike=f.bestStrike||null;
  const entry=f.breakout||f.breakdown||null;
  return Object.freeze({
    symbol:f.symbol||"",
    dataStatus:hasLive?"LIVE":"DATA_REQUIRED",
    asOf:f.asOf||f.timestamp||null,
    missing,
    price:finite(f.price)?Number(f.price):null,
    dayChange:finite(f.return1d)?Number(f.return1d):null,
    sentiment,
    confidence:e.confidence,
    direction,
    trendStrength,
    reversalRisk,
    crowdingSide,
    crowdingLevel,
    crowdingDivergence,
    falseContrarianRisk,
    optionSuitable,
    tradeSide,
    gate,
    bestStrike:strike,
    iv:finite(f.iv)?Number(f.iv):null,
    correlation:finite(f.correlation)?Number(f.correlation):null,
    breakout:finite(f.breakout)?Number(f.breakout):null,
    breakdown:finite(f.breakdown)?Number(f.breakdown):null,
    invalidation:finite(f.invalidation)?Number(f.invalidation):null,
    target1:finite(f.target1)?Number(f.target1):null,
    target2:finite(f.target2)?Number(f.target2):null,
    expectedMove:finite(f.expectedMove)?Number(f.expectedMove):null,
    holding:f.holding||null,
    trigger5m:finite(f.trigger5m)?Number(f.trigger5m):null,
    optionReason:f.optionReason||"Option contract selection requires live chain, fresh OI/activity, IV, Greeks, spread/depth and timestamp-safe timing.",
    newsFactor:f.newsFactor||null,
    backtestStatus:f.backtestStatus||"NOT RUN",
    conclusion:f.conclusion||"NO LIVE RESEARCH SIGNAL POSTED"
  });
}

window.TRAP_ENGINE=Object.freeze({
  config:TRAP_CONFIG,clamp,signed10,sentimentScore,evidence,directionalEvidence,
  confidence,reversalScore,evaluate,rankUniverse,selectCarryForward,
  promoteValidated,actionableGate,researchAnalyze
});
