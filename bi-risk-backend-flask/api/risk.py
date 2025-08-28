import numpy as np
import pandas as pd
from typing import Dict

def detect_anomalies_zscore(series: pd.Series, z_threshold: float = 3.0) -> Dict:
    x = pd.to_numeric(series, errors="coerce")
    mean = x.mean()
    std = x.std(ddof=0)
    if std == 0 or np.isnan(std):
        mask = np.zeros(len(x), dtype=bool)
    else:
        z = (x - mean) / std
        mask = np.abs(z) >= z_threshold
    anomaly_indices = np.where(mask)[0].tolist()

    return {
        "n": int(len(x)),
        "n_anomalies": int(mask.sum()),
        "mean": float(mean) if mean == mean else float("nan"),
        "std": float(std) if std == std else float("nan"),
        "z_threshold": float(z_threshold),
        "anomaly_mask": mask.astype(bool).tolist(),
        "anomaly_indices": anomaly_indices
    }

def simple_forecast(series: pd.Series, periods: int = 12) -> pd.Series:
    """
    Minimal ARIMA(1,1,1)-like differencing + naive smoothing fallback for robustness.
    This avoids heavy dependencies and tends to produce a reasonable baseline forecast.
    """
    y = pd.to_numeric(series, errors="coerce").dropna()

    if len(y) < 4:
        # Not enough data: flat forecast using last value
        last = y.iloc[-1] if len(y) else 0.0
        idx = pd.date_range(y.index.max() if len(y) else pd.Timestamp.today(),
                            periods=periods+1, freq=_infer_freq(y.index))
        return pd.Series([last]*periods, index=idx[1:])

    # Simple differencing
    diff = y.diff().dropna()
    # Use last-k average of diffs as drift
    k = min(5, len(diff))
    drift = diff.tail(k).mean()

    # Build future index
    freq = _infer_freq(y.index)
    start = y.index.max()
    future_idx = pd.date_range(start=start, periods=periods+1, freq=freq)[1:]

    # Forecast: last value + cumulative drift
    forecasts = []
    last = y.iloc[-1]
    for i in range(1, periods+1):
        forecasts.append(last + drift * i)

    return pd.Series(forecasts, index=future_idx)

def _infer_freq(index):
    try:
        return pd.infer_freq(index) or "D"
    except Exception:
        return "D"
