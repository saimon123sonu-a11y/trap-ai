/* TRAP AI Decision Engine
 * Deterministic, feed-agnostic core.
 * Live adapters must supply timestamped OHLCV/OI/options/news/positioning data.
 * No broker credentials belong in this file.
 */
window.TRAP_CONFIG = Object.freeze({
  sentimentExtreme: 8,
  reversalTrap: 90,
  reversalCrowdHigh: 90,
  reversalCrowdLow: 20,
  trendTrapMax: 60,
  trendCrowdMax: 90,
  timeframes: ["1W","1D","3H","1H","15M","5M"],
  weights: Object.freeze({
    regime: 18, structure: 18, rsi: 15, divergence: 14,
    oiVolume: 10, options: 8, sentiment: 7, liquidity: 5, timing: 3, catalyst: 2
  })
});

function clamp(x,a=0,b=100){ return Math.max(a,Math.min(b,x)); }
function avg(a){ const v=a.filter(Number.isFinite); return v.length?v.reduce((x,y)=>x+y,0)/v.length:0; }
function sign(x){ return x>0?1:x<0?-1:0; }

/* Expected normalized feature contract:
{
 sentiment: -10..10, crowding: 0..100, trap: 0..100,
 rsi: 0..100, rsiSlope: -1..1,
 bullishDivergence: bool, bearishDivergence: bool,
 reversalConfirmed: bool,
 trendStrength: 0..100, volumeConfirmation: 0..100, oiConfirmation: 0..100,
 liquidity: 0..100, optionQuality: 0..100,
 timeframes: { "1W": -1..1, "1D": -1..1, "3H": -1..1, "1H": -1..1, "15M": -1..1, "5M": -1..1 },
 priceStructure: -1..1, catalyst: -1..1,
 lunarScore: -1..1, gannScore: -1..1, astroScore: -1..1,
 dataQuality: 0..100
}
*/

function timeframeScore(tf, direction){
  const v=Number(tf?.[direction.tf] ?? 0);
  return clamp(50 + 50 * direction.side * v);
}

function alignmentScore(tf, side){
  const w={ "1W":.22,"1D":.22,"3H":.18,"1H":.18,"15M":.12,"5M":.08 };
  return clamp(Object.keys(w).reduce((s,k)=>s+w[k]*clamp(50+50*side*Number(tf?.[k]??0)),0));
}

function reversalSignal(f){
  const bull=f.sentiment>=TRAP_CONFIG.sentimentExtreme;
  const bear=f.sentiment<=-TRAP_CONFIG.sentimentExtreme;
  const put=bull && f.crowding>TRAP_CONFIG.reversalCrowdHigh && f.trap>TRAP_CONFIG.reversalTrap &&
    !!f.bearishDivergence && !!f.reversalConfirmed;
  const call=bear && f.crowding<TRAP_CONFIG.reversalCrowdLow && f.trap>TRAP_CONFIG.reversalTrap &&
    !!f.bullishDivergence && !!f.reversalConfirmed;
  return {put,call};
}

function trendSignal(f){
  const bullish=f.sentiment>=3 && f.crowding<TRAP_CONFIG.trendCrowdMax && f.trap<TRAP_CONFIG.trendTrapMax;
  const bearish=f.sentiment<=-3 && f.crowding<TRAP_CONFIG.trendCrowdMax && f.trap<TRAP_CONFIG.trendTrapMax;
  const longAlign=alignmentScore(f.timeframes,1)>=72;
  const shortAlign=alignmentScore(f.timeframes,-1)>=72;
  const longMomentum=f.rsi>=50 && f.rsiSlope>=0 && !f.bearishDivergence;
  const shortMomentum=f.rsi<=50 && f.rsiSlope<=0 && !f.bullishDivergence;
  const longConfirm=f.trendStrength>=60 && f.volumeConfirmation>=60 && f.oiConfirmation>=55;
  const shortConfirm=longConfirm;
  return {
    call:bullish&&longAlign&&longMomentum&&longConfirm,
    put:bearish&&shortAlign&&shortMomentum&&shortConfirm,
    longAlign,shortAlign
  };
}

function technicalScore(f,side){
  const rsiMomentum = side>0 ? clamp((f.rsi-50)*2) : clamp((50-f.rsi)*2);
  const divergencePenalty = (side>0&&f.bearishDivergence)||(side<0&&f.bullishDivergence) ? 35 : 0;
  return clamp(.28*alignmentScore(f.timeframes,side)+.22*f.trendStrength+
    .18*f.volumeConfirmation+.18*f.oiConfirmation+.14*rsiMomentum-divergencePenalty);
}

function confidence(f,side,mode){
  const tech=technicalScore(f,side);
  const align=alignmentScore(f.timeframes,side);
  const options=clamp(f.optionQuality??50);
  const liq=clamp(f.liquidity??50);
  const timing=clamp(50+25*avg([f.lunarScore??0,f.gannScore??0,f.astroScore??0]));
  const c=.34*tech+.22*align+.16*options+.14*liq+.08*timing+.06*clamp(f.dataQuality??0);
  return clamp(c);
}

function evaluate(features){
  const f=features||{};
  const rev=reversalSignal(f), trend=trendSignal(f);
  let mode="NO TRADE", side=0, reason="Critical gate not satisfied.";
  if(rev.put){ mode="REVERSAL"; side=-1; reason="Extreme bullish sentiment + >90 crowding + >90 trap + bearish RSI divergence + confirmed reversal."; }
  else if(rev.call){ mode="REVERSAL"; side=1; reason="Extreme bearish sentiment + <20 crowding + >90 trap + bullish RSI divergence + confirmed reversal."; }
  else if(trend.call){ mode="TREND"; side=1; reason="Bullish multi-timeframe alignment + momentum + trend/OI/volume confirmation."; }
  else if(trend.put){ mode="TREND"; side=-1; reason="Bearish multi-timeframe alignment + momentum + trend/OI/volume confirmation."; }
  const tech=side?technicalScore(f,side):technicalScore(f,sign(f.sentiment)||1);
  const conf=side?confidence(f,side,mode):0;
  const timingRaw=avg([f.lunarScore??0,f.gannScore??0,f.astroScore??0]);
  const timingEffect=clamp(50+50*timingRaw);
  const signal=side===1?"CALL":side===-1?"PUT":"NO TRADE";
  return Object.freeze({
    signal, mode, side, reason,
    sentiment:clamp(f.sentiment,-10,10),
    crowding:clamp(f.crowding??0), trap:clamp(f.trap??0),
    technical:Math.round(tech), confidence:Math.round(conf),
    timingOverlay:Math.round(timingEffect),
    reversal:rev, trend,
    pass:mode!=="NO TRADE" && conf>=70 && (f.liquidity??0)>=60 && (f.optionQuality??0)>=60
  });
}

window.TRAP_ENGINE = Object.freeze({config:TRAP_CONFIG,evaluate,reversalSignal,trendSignal,technicalScore,confidence,alignmentScore});
