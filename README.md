# Alpha Trap

Alpha Trap is a clean rebuild of the prior TRAP AI project. The previous codebase is preserved on the branch `archive/trap-ai-pre-alpha-20261009`.

## Product rules
- Public-data collection only; no Angel One API.
- Historical OHLCV baseline from the latest completed trading session; five-minute current-session refresh when the source is available.
- Full verified NSE F&O universe target: 150 instruments. Do not claim full coverage until the actual official list is present and the collector reports per-symbol success.
- After-close research: 5 bullish, 5 bearish, and 5 reversal candidates, plus separately sourced sentiment and positioning/crowding analysis.
- Intraday mode is separate from next-session research. Last session's watchlist is not automatically a live signal.
- Trend and Momentum are separate assessments; disagreement and missing data can produce WAIT / NO TRADE.
- No invented prices, candles, timestamps, news, OI, PCR, Greeks, IV, or crowding values.
- Every candidate must carry source/as-of time, data quality, reason, trigger, invalidation, and risk/reward where the data supports it.
- A five-minute browser timer is only a UI check. Collection and after-close research run in scheduled automation.
- A scheduled workflow is not proof of a working feed; verify successful runs and actual numeric data.

## Current build status
The Alpha Trap interface is a fresh shell that explicitly surfaces missing/stale data and suppresses fabricated signals. The public snapshot pipeline must pass transport and historical-data validation before the app can be described as operational. The dashboard deliberately does not invent market values when `data/latest.json` has unavailable rows.

## Deployment
The repository's GitHub Pages workflow deploys the root folder. The market refresh workflow runs every five minutes and must be repaired and verified separately. After-close research is a separate required workflow phase.

## Testing checklist
1. JavaScript syntax checks pass.
2. Snapshot schema validation passes.
3. Missing prices render as unavailable, not zero.
4. Historical candle availability is explicit.
5. Data refresh timestamp is visible.
6. No live signal is enabled with missing critical data.
7. Verify GitHub Actions and deployed URL after changes.