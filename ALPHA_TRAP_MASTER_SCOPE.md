# Alpha Trap — Master Engineering Scope

## Product objective
Alpha Trap is an evidence-first trading research and decision-intelligence platform. Prefer WAIT / NO TRADE over weak, contradictory, stale, or incomplete evidence. Option return targets are scenarios, never guarantees.

## Preserved user requirements
- Build a fresh app named **Alpha Trap**; do not continue patching the previous UI.
- Preserve a recoverable copy of the old TRAP AI project before replacing the default branch.
- Public data only. Do not connect Angel One API unless the user changes this constraint.
- Use historical market data as of the latest completed trading session after market close.
- During trading hours, monitor current-session data on a five-minute intelligence cycle where source availability permits.
- Scan the full official 150-stock NSE F&O universe dynamically; RELIANCE, ITC, SBIN and TCS were examples, not a fixed watchlist.
- After close, produce 5 bullish, 5 bearish and 5 reversal candidates, plus separate positive/negative sentiment and bullish/bearish crowding research when supported by reliable data.
- Keep next-session research distinct from live-session BUY / SELL / WAIT decisions.
- Use two separate model assessments: Trend and Momentum. Display evidence, data coverage, timestamp, confidence, and disagreement. Do not call heuristic rules a trained AI model.
- Live actionable candidates require a trigger, invalidation/stop, target or risk/reward, timestamp, data quality, and reasons. Missing critical data means no live signal.
- Never fabricate price, OHLCV candles, timestamps, news, options OI, PCR, IV, Greeks, option walls or crowding.
- Show a compact five-minute refresh countdown on the left side of the interface.
- Browser polling is not a substitute for a server-side scheduled collector or after-close job.
- Historical backtesting, including 100 completed sessions for NIFTY, BANKNIFTY and broad stocks, then exact five-minute replay, option-history replay when available, and walk-forward out-of-sample validation.
- Model changes must be tested, checked for leakage and compared with the current champion before being accepted.

## Evidence hierarchy
1. Source integrity, freshness, and session date.
2. Market regime and macro/event risk.
3. Weekly/daily trend and multi-timeframe structure.
4. Three-hour and one-hour directional context.
5. Fifteen-minute setup.
6. Five-minute trigger/invalidation.
7. Option contract selection only after underlying direction passes.

The five-minute layer can activate or invalidate a thesis; it cannot independently reverse a higher-timeframe thesis.

## Independent analytical agents
- Technical/Structure: RSI on 1W/1D/3H/1H/15M/5M when history permits, divergences, price structure, trend, volume, support/resistance.
- Macro/News/Event: global indices, FX, yields, oil, gold, crypto, dated public headlines, event risk.
- Options/Flow: PCR, OI, option walls, IV, Greeks, liquidity and crowding only when source and timestamp are verified.
- Fusion: combines evidence, penalizes contradictions, reports coverage and can return NO TRADE. Do not present a static weighted indicator as a trained model.

## Direction and reversal are separate
- Continuation direction: BULLISH / BEARISH / NEUTRAL.
- Reversal risk is separate from direction; high reversal risk is not an automatic CALL/PUT.
- A bearish setup with high reversal risk means wait for confirmation, not blindly buy PUT.
- A CALL requires bullish direction plus required reclaim/divergence/volume confirmation.
- A PUT requires bearish continuation plus a confirmed breakdown.
- Otherwise: WAIT / NO TRADE.

## UI
Decision boards should prioritize direction, sentiment (-10 to +10 when legitimately calculated), confidence, useful RSI/divergence, option side and entry trigger. Detailed OI, crowding, correlation, reversal diagnostics and research factors belong in Research / Deep Evidence.
- RED: actionable candidate only after required confirmation.
- GREEN: confirmed continuation / high-potential trend setup.
- YELLOW: reversal watch, not automatic trade.
- BLACK: liquidity risk / unsafe execution.
- Missing critical data: NO LIVE SIGNAL.
- Data-health panel must show provider, timestamp, valid/unavailable count, historical coverage, errors, and last successful run.

## Market workflow
Verified universe -> public data collection -> unusual activity -> detailed validation -> top 5 bearish + top 5 bullish + top 5 reversal -> 15-stock carry-forward research list. Monitor these 15 every five minutes. Do not create fresh market-wide actionable trades every cycle.
Recalculate promptly when material price/structure breaks, volume/OI changes, major news, FX/yield/oil shocks, macro events or company/regulatory announcements change the thesis. Log old/new state, cause, affected agents, timestamp and actionability.

## Data and provider limitations
Yahoo/public endpoints may support prototyping but are not exchange-grade participant OI, FII/DII, licensed news, tick feeds or historical option-chain datasets. Show provider limitations. No broker API, credentials, or private feeds without user approval.

## Backtesting and acceptance
Required stages:
A. 100 completed sessions across NIFTY, BANKNIFTY and a broad stock set.
B. Exact intraday five-minute replay.
C. Historical option-chain/OI/Greeks replay only if a verified historical dataset is available.
D. Walk-forward out-of-sample validation.
Metrics: win rate, expectancy, profit factor, average/median return, max drawdown, Sharpe/Sortino, average winner/loser, false-signal rate, regime/time-of-day performance, confidence/crowding bands and 2x/3x/4x option opportunity hit rates.
Never optimize to a requested accuracy target. Accept a model only if out-of-sample expectancy and robustness improve.
Before production claims: syntax/unit tests pass, data collector run succeeds, actual numeric prices and timestamps exist, all views have meaningful states, Research handles NIFTY/NTPC/BTC and arbitrary supported searches, scanner covers verified universe, no fabricated fields, after-close report exists, backtest report exists, and deployment is verified.

## Current implementation status
The new Alpha Trap frontend explicitly shows unavailable/stale data and disables live signals when critical data is absent. The previous market collector had a confirmed failed run (0 valid symbols out of 62 requested, HTTP 404s across public-data attempts). The data pipeline must be repaired and tested against real responses before production readiness can be claimed.
