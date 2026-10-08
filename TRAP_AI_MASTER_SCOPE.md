# TRAP AI — Master Engineering Scope

## 1. Product objective
TRAP AI is a decision-intelligence system for discretionary trading research. It must prefer **NO TRADE** over weak or contradictory evidence. A 3×–4× option return is an opportunity target, never a guarantee.

## 2. Decision hierarchy
1. Data freshness and integrity
2. Weekly regime
3. Daily trend / sentiment
4. 3H structure
5. 1H directional bias
6. 15M setup formation
7. 5M activation trigger
8. Option contract selection only after underlying direction is validated

The 5M layer can activate or invalidate an existing thesis; it must not independently reverse a higher-timeframe thesis.

## 3. Independent reasoning agents
- **Technical/Structure:** RSI across 1W/1D/3H/1H/15M/5M, RSI divergence, price structure, trend, volume and support/resistance.
- **Macro/News/Event:** global indices, USD/FX, yields, oil, gold, crypto, major public headlines and event risk.
- **Options/Flow:** PCR, OI, walls, IV, Greeks, liquidity and crowding when reliable option-chain data exists.
- **Fusion:** combines evidence, penalizes contradictions, detects regime conflict and produces direction, sentiment and confidence.

The fusion layer is not a static weighted-indicator score. It must explain evidence and may return NO TRADE.

## 4. Direction vs reversal
These are separate dimensions.

- **Continuation direction:** BULLISH / BEARISH / NEUTRAL.
- **Reversal risk:** probability that the continuation thesis may fail or reverse.
- High reversal risk does **not** mean CALL.
- A bearish setup with high reversal risk means: do not blindly buy PUT; wait for confirmation.
- CALL requires bullish directional evidence plus bullish RSI divergence/reclaim/volume-OI confirmation where applicable.
- PUT requires bearish continuation plus 5M breakdown/confirmation.
- If neither gate passes: **NO TRADE**.

## 5. Primary UI
Main decision boards should show only decision-relevant fields:
- Direction
- Sentiment (-10 to +10)
- AI Confidence
- RSI / divergence where useful
- Option side
- Entry trigger

Crowding, detailed OI, correlation, composite internals, reversal diagnostics and other research factors belong in Research/Deep Evidence or backend logs.

## 6. Signal semantics
- RED: actionable candidate only after all required confirmation gates.
- GREEN: confirmed continuation / high-potential trend setup.
- YELLOW: reversal watch, not an automatic trade.
- BLACK: liquidity risk / unsafe execution.

Missing critical data => **NO LIVE SIGNAL**.

## 7. Market workflow
Reliable universe -> unusual activity -> detailed validation -> Top 5 bearish + Top 5 bullish + Top 5 reversal -> 15-stock carry-forward watchlist.

The 15 selected names are monitored on the 5-minute intelligence cycle. Do not continuously generate new actionable trades from the entire market every five minutes.

## 8. Event sensitivity
Normal intelligence cycle: every 5 minutes.

Force an immediate recalculation when material:
- price/structure break,
- volume/OI/crowding change,
- major public news,
- FX/yield/oil shock,
- scheduled macro event,
- company/regulatory announcement

changes the thesis.

Every event-driven change should retain:
previous signal, new signal, cause, changed agent(s), timestamp and actionability.

## 9. Option selection
Underlying first, option second.

Validate:
delta, gamma, theta, vega, IV, expiry, spread, liquidity, OI and expected move. Any indicative option return must be explicitly labelled as a scenario and never a guaranteed return.

## 10. Backtesting
Required phases:
- Phase A: 100 completed sessions across NIFTY, BANKNIFTY and a broad stock set.
- Phase B: exact intraday 5-minute replay.
- Phase C: historical option-chain/OI/Greeks replay.
- Phase D: walk-forward out-of-sample validation.

Required metrics:
win rate, expectancy, profit factor, average/median return, max drawdown, Sharpe/Sortino, average winner/loser, false-signal rate, regime performance, time-of-day performance, confidence/crowding bands and 2×/3×/4× option opportunity hit rates.

Never optimize to a requested accuracy target. Accept a model only if out-of-sample expectancy and robustness improve.

## 11. Continuous improvement
Every model change follows:
change -> unit/syntax tests -> backtest -> leakage check -> robustness tests -> benchmark vs champion -> accept or rollback.

Champion/challenger evaluation is preferred over silently replacing the live logic.

## 12. Data limitations
Public Yahoo Finance endpoints are useful for prototyping but are not equivalent to exchange-grade participant OI, FII/DII, licensed news, tick feeds or historical option-chain datasets. TRAP AI must expose this limitation rather than fabricate unavailable fields.

## 13. Phone-off operation
The browser/Android client is a display and control surface. Collection, scheduled analysis, event detection, signal history and backtesting must run server-side.

## 14. Production acceptance
Before calling TRAP AI production-ready:
- all four tabs produce meaningful output;
- Research works for BTC, NIFTY, NTPC and arbitrary supported searches;
- market page covers NIFTY/BANKNIFTY/SENSEX plus cross-market context;
- stock page produces 5/5/5 only from validated data;
- no fabricated values;
- event-sensitive recalculation is logged;
- backtest report is generated;
- syntax/tests pass;
- freshness is visible;
- deployment is verified after the final commit.

## 15. Current baseline
The existing simple directional backtest (~49.5% one-session baseline) is a rejection/baseline result, not a production performance claim. Historical option backtesting remains incomplete until a verified historical option-chain dataset is connected.
