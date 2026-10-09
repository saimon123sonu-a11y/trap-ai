# Alpha Trap — Lunar Cycle & Gann-Style Research Note

**Purpose:** Add astronomical lunar phase labeling and a transparent, instrument-specific historical comparison to Alpha Trap without treating lunar astrology or Gann methods as established predictive science.

## What the implementation calculates

### Lunar phase
- Uses the mean synodic month (29.530588853 days) and a documented reference new-moon epoch (2000-01-06 18:14 UTC) to estimate phase, lunar age, and illuminated fraction.
- Labels approximate new-moon windows (within 3 days of new moon) and full-moon windows (within 3 days of full moon).
- Joins each dated daily return to its calendar lunar phase and reports the observed mean return difference: full-moon-window mean minus new-moon-window mean.
- Reports sample counts. Fewer than 10 observed daily returns in either window is explicitly marked insufficient for interpretation.
- This is a descriptive browser calculation, not a complete statistical event study. Daily observations within a phase window are not independent; a proper research-grade test should aggregate by lunar cycle, control for market/sector/regime effects, correct for multiple testing, and validate on untouched out-of-sample dates.

### Gann-style price/time references
- Identifies the recent 60-bar high and low and counts bars since each pivot.
- Calculates illustrative square-root price reference levels around the latest close using ±0.25 and ±0.50 square-root increments.
- These are configurable geometric reference levels only. They are not a validated Gann trading system, do not calculate a universal 1x1 angle (that requires an explicit price/time scale), and must not be interpreted as support/resistance without price-action confirmation.

## How to interpret the output

- **Astronomical phase** is a calculated calendar label; it does not imply a bullish or bearish market direction.
- **Full vs new moon return difference** is a sample statistic, not a causal effect, probability of profit, or forecast.
- **Gann-style levels** are candidate reference levels only.
- Lunar/Gann context should be a low-weight research feature. It must not override verified price/volume evidence, sector breadth, trend, volatility, risk controls, or a confirmed entry trigger.
- If history is insufficient or timestamps are invalid, the module reports unavailable/insufficient instead of fabricating values.
- Do not use this feature by itself to trade options. Options selection requires a verified option chain, expiry, Greeks, liquidity, spreads and current premium. Intraday execution requires timestamped intraday data.

## Scientific evidence: mixed, not settled

1. Yuan, Zheng & Zhu (2006), *Are investors moonstruck? Lunar phases and stock returns*, Journal of Empirical Finance. Their international sample reported lower returns around full moon than new moon; this is a published result, not proof the effect persists in every market or period. https://doi.org/10.1016/j.jempfin.2005.06.001
2. Keef & Khaled (2011), *Are investors moonstruck? Further international evidence on lunar phases and stock returns*. Their alternative specification found an enhanced new-moon effect but no overall full-moon effect. https://doi.org/10.1016/j.jempfin.2010.11.002
3. Tan & Floros (2013), *Moon Phases, Mood and Stock Market Returns: International Evidence*. They found statistically significant effects only in a subset of 59 markets, with effects varying by country and calendar anomalies. https://doi.org/10.1177/0972652712473405
4. Herbst (2007), *Lunacy in the Stock Market—What Is the Evidence?* reported no consistent, predictable lunar influence on Dow Jones returns or volatility. https://doi.org/10.1007/s10818-007-9016-3

**Conclusion:** There is published research in both directions and results vary by market, sample and method. The appropriate engineering approach is to expose the hypothesis, calculate a reproducible sample statistic, and test whether it adds out-of-sample value—not to label it “completely scientific” or assume full moon/new moon predicts direction.

## Recommended validation before allowing it to influence live signals

1. Obtain at least 10 years of clean daily adjusted OHLCV for the intended instrument universe, with exchange trading dates and corporate-action handling.
2. Compare full/new-moon windows against matched control dates and a simple no-lunar baseline.
3. Aggregate by lunar cycle, use block/bootstrap or suitable time-series inference, and control for weekday, month-end, volatility, sector and broad-market regime.
4. Freeze definitions before testing; account for multiple testing across symbols, sectors, windows and parameters.
5. Run walk-forward and untouched out-of-sample tests; report effect size, confidence interval, sample count, turnover, transaction costs and drawdown.
6. Keep lunar/Gann features disabled as trade triggers until they show stable incremental value beyond the price/volume and sector model.

## Current application limitation

This module runs on the history available for the selected instrument. Snapshot history may be short, so it can legitimately return “insufficient sample.” It does not yet constitute a full historical portfolio backtest or a calibrated predictive model.
