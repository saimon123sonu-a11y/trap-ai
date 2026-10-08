/* TRAP AI Decision Engine v2 — evidence-driven, no hard-coded sentiment */
window.TRAP_CONFIG=Object.freeze({
 timeframes:["1W","1D","3H","1H","15M","5M"],
 weights:Object.freeze({regime:18,structure:18,rsi:15,divergence:14,oiVolume:10,options:8,sentiment:7,liquidity:5,catalyst:3,macro:2}),
 extremeSentiment:8,reversalTrap:90,reversalCrowdHigh:90,reversalCrowdLow:20,trendTrapMax:60,trendCrowdMax:90
});
function clamp(x,a=0,b=100){return Math.max(a,Math.min(b,x));}
function clamp10(x){return clamp(x,-10,10);}
function n(x,d=0){return Number.isFinite(Number(x))?Number(x):d;}
function avg(a){const v=a.filter(Number.isFinite);return v.length?v.reduce((s,x)=>s+x,0)/v.length:0;}
function alignmentScore(tf,side){const w={"1W":.22,"1D":.22,"3H":.18,"1H":.18,"15M":.12,"5M":.08};return clamp(Object.keys(w).reduce((s,k)=>s+w[k]*clamp(50+50*side*n(tf?.[k])),0));}
function sentimentScore(f){
 const c=[];
 if(Number.isFinite(Number(f.return1d)))c.push(clamp10(n(f.return1d)*1.8));
 if(Number.isFinite(Number(f.return5d)))c.push(clamp10(n(f.return5d)*.7));
 if(Number.isFinite(Number(f.return20d)))c.push(clamp10(n(f.return20d)*.35));
 if(Number.isFinite(Number(f.priceVsSma20)))c.push(clamp10(n(f.priceVsSma20)*.8));
 if(Number.isFinite(Number(f.priceVsSma50)))c.push(clamp10(n(f.priceVsSma50)*.5));
 if(Number.isFinite(Number(f.structure)))c.push(clamp10(n(f.structure)*7));
 if(Number.isFinite(Number(f.rsiBias)))c.push(clamp10(n(f.rsiBias)*5));
 if(Number.isFinite(Number(f.oiBias)))c.push(clamp10(n(f.oiBias)*5));
 if(Number.isFinite(Number(f.volumeBias)))c.push(clamp10(n(f.volumeBias)*4));
 if(Number.isFinite(Number(f.relativeStrength)))c.push(clamp10(n(f.relativeStrength)*4));
 if(Number.isFinite(Number(f.newsBias)))c.push(clamp10(n(f.newsBias)*3));
 if(Number.isFinite(Number(f.macroBias)))c.push(clamp10(n(f.macroBias)*2));
 let score=avg(c);
 if(f.bearishDivergence)score-=2;
 if(f.bullishDivergence)score+=2;
 const sharpDown=n(f.return1d)<=-2,belowBoth=n(f.priceVsSma20)<0&&n(f.priceVsSma50)<0;
 const sharpUp=n(f.return1d)>=2,aboveBoth=n(f.priceVsSma20)>0&&n(f.priceVsSma50)>0;
 if(sharpDown&&belowBoth)score=Math.min(score,1.5);
 if(sharpUp&&aboveBoth)score=Math.max(score,-1.5);
 return clamp10(score);
}
function evidenceQuality(f){
 const keys=["return1d","return5d","return20d","priceVsSma20","priceVsSma50","structure","rsiBias","oiBias","volumeBias","relativeStrength","newsBias","macroBias"];
 return Math.round(clamp(keys.filter(k=>Number.isFinite(Number(f[k]))).length/keys.length*70+n(f.dataQuality)*.3));
}
function technicalScore(f,side){
 const rsi=side>0?clamp((n(f.rsi)-50)*2):clamp((50-n(f.rsi))*2);
 const div=((side>0&&f.bearishDivergence)||(side<0&&f.bullishDivergence))?30:0;
 return Math.round(clamp(.30*alignmentScore(f.timeframes,side)+.20*n(f.trendStrength)+.17*n(f.volumeConfirmation)+.17*n(f.oiConfirmation)+.16*rsi-div));
}
function trapScore(f){
 let s=clamp(n(f.crowding)); if(f.bearishDivergence||f.bullishDivergence)s+=12;
 if(n(f.oiPriceDivergence)>0)s+=12;if(n(f.exhaustion)>0)s+=15;if(n(f.vixAcceleration)>0)s+=8;if(n(f.falseBreakRisk)>0)s+=15;
 return Math.round(clamp(s));
}
function reversalSignal(f){
 const s=n(f.sentiment),t=n(f.trap??trapScore(f));
 return {put:s>=8&&n(f.crowding)>90&&t>90&&!!f.bearishDivergence&&!!f.reversalConfirmed,
 call:s<=-8&&n(f.crowding)<20&&t>90&&!!f.bullishDivergence&&!!f.reversalConfirmed};
}
function trendSignal(f){
 const s=n(f.sentiment),c=n(f.crowding),t=n(f.trap??trapScore(f));
 const bull=s>=3&&c<90&&t<60,bear=s<=-3&&c<90&&t<60;
 const la=alignmentScore(f.timeframes,1)>=72,sa=alignmentScore(f.timeframes,-1)>=72;
 const lm=n(f.rsi)>=50&&n(f.rsiSlope)>=0&&!f.bearishDivergence;
 const sm=n(f.rsi)<=50&&n(f.rsiSlope)<=0&&!f.bullishDivergence;
 const ok=n(f.trendStrength)>=60&&n(f.volumeConfirmation)>=60&&n(f.oiConfirmation)>=55;
 return {call:bull&&la&&lm&&ok,put:bear&&sa&&sm&&ok,longAlign:la,shortAlign:sa};
}
function confidence(f,side){return Math.round(clamp(.34*technicalScore(f,side)+.22*alignmentScore(f.timeframes,side)+.16*clamp(n(f.optionQuality))+.14*clamp(n(f.liquidity))+.08*evidenceQuality(f)+.06*n(f.catalystScore,50)));}
function evaluate(input){
 const f={...input};f.sentiment=Number.isFinite(Number(f.sentiment))?clamp10(f.sentiment):sentimentScore(f);f.trap=Number.isFinite(Number(f.trap))?clamp(f.trap):trapScore(f);
 const rev=reversalSignal(f),tr=trendSignal(f);let mode="NO TRADE",side=0,reason="Evidence incomplete or contradictory.";
 if(rev.put){mode="REVERSAL";side=-1;reason="Extreme bullish crowding + bearish RSI divergence + confirmed reversal."}
 else if(rev.call){mode="REVERSAL";side=1;reason="Extreme bearish positioning + bullish RSI divergence + confirmed reversal."}
 else if(tr.call){mode="TREND";side=1;reason="Aligned bullish regime, momentum, structure, OI and volume."}
 else if(tr.put){mode="TREND";side=-1;reason="Aligned bearish regime, momentum, structure, OI and volume."}
 const tech=side?technicalScore(f,side):technicalScore(f,n(f.sentiment)>=0?1:-1),conf=side?confidence(f,side):0;
 return Object.freeze({signal:side===1?"CALL":side===-1?"PUT":"NO TRADE",mode,side,reason,sentiment:Math.round(f.sentiment*10)/10,crowding:Math.round(clamp(f.crowding)),trap:Math.round(f.trap),technical:tech,confidence:conf,dataQuality:evidenceQuality(f),pass:mode!=="NO TRADE"&&conf>=70&&n(f.liquidity)>=60&&n(f.optionQuality)>=60});
}
function rankOpportunity(rows){return(rows||[]).map(r=>({...r,result:evaluate(r)})).filter(x=>x.result.pass).sort((a,b)=>b.result.confidence-a.result.confidence);}
window.TRAP_ENGINE=Object.freeze({config:TRAP_CONFIG,sentimentScore,evidenceQuality,trapScore,evaluate,rankOpportunity,reversalSignal,trendSignal,technicalScore,alignmentScore});