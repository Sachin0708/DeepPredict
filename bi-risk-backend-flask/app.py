import os
import uuid
import io
import pandas as pd
import numpy as np

from flask import Flask, request, jsonify
from flask_cors import CORS
from api.risk import detect_anomalies_zscore, simple_forecast

app = Flask(__name__)
CORS(app)

# In-memory dataset store: { dataset_id: DataFrame }
DATASETS = {}

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/api/upload", methods=["POST"])
def upload():
    """
    Accepts a CSV or XLSX file and stores it in memory.
    Returns a dataset_id to be used for later analysis.
    """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded with field name 'file'"}), 400

    f = request.files["file"]
    name = f.filename.lower()
    try:
        if name.endswith(".csv"):
            df = pd.read_csv(f)
        elif name.endswith(".xlsx") or name.endswith(".xls"):
            df = pd.read_excel(f)
        else:
            # Try CSV as fallback
            df = pd.read_csv(f)
    except Exception as e:
        return jsonify({"error": f"Failed to parse file: {e}"}), 400

    dataset_id = str(uuid.uuid4())
    DATASETS[dataset_id] = df

    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    obj_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()

    return jsonify({
        "dataset_id": dataset_id,
        "shape": list(df.shape),
        "columns": df.columns.tolist(),
        "numeric_columns": numeric_cols,
        "categorical_columns": obj_cols
    })

@app.route("/api/columns/<dataset_id>", methods=["GET"])
def columns(dataset_id):
    df = DATASETS.get(dataset_id)
    if df is None:
        return jsonify({"error": "dataset_id not found"}), 404

    import numpy as np
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    obj_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()
    return jsonify({
        "columns": df.columns.tolist(),
        "numeric_columns": numeric_cols,
        "categorical_columns": obj_cols
    })

@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    Body JSON:
    {
      "dataset_id": "...",
      "value_column": "revenue"   # numeric column to analyze
    }
    Returns anomalies using z-score.
    """
    data = request.get_json(force=True)
    dataset_id = data.get("dataset_id")
    value_col = data.get("value_column")

    df = DATASETS.get(dataset_id)
    if df is None:
        return jsonify({"error": "dataset_id not found"}), 404
    if value_col not in df.columns:
        return jsonify({"error": f"value_column '{value_col}' not found"}), 400

    series = pd.to_numeric(df[value_col], errors="coerce")
    result = detect_anomalies_zscore(series)

    # Return chart-friendly payload
    points = []
    for i, v in enumerate(series.tolist()):
        points.append({
            "index": i,
            "value": None if pd.isna(v) else float(v),
            "is_anomaly": bool(result["anomaly_mask"][i])
        })

    return jsonify({
        "summary": {
            "n": int(result["n"]),
            "n_anomalies": int(result["n_anomalies"]),
            "z_threshold": float(result["z_threshold"]),
            "mean": None if pd.isna(result["mean"]) else float(result["mean"]),
            "std": None if pd.isna(result["std"]) else float(result["std"])
        },
        "points": points,
        "anomaly_indices": result["anomaly_indices"]
    })

@app.route("/api/forecast", methods=["POST"])
def forecast():
    """
    Body JSON:
    {
      "dataset_id": "...",
      "date_column": "date",
      "value_column": "revenue",
      "periods": 12   # number of periods to forecast
    }
    """
    data = request.get_json(force=True)
    dataset_id = data.get("dataset_id")
    date_col = data.get("date_column")
    value_col = data.get("value_column")
    periods = int(data.get("periods", 12))

    df = DATASETS.get(dataset_id)
    if df is None:
        return jsonify({"error": "dataset_id not found"}), 404
    if date_col not in df.columns or value_col not in df.columns:
        return jsonify({"error": "date_column or value_column not found"}), 400

    # Prepare time series
    ts = df[[date_col, value_col]].copy()
    ts[date_col] = pd.to_datetime(ts[date_col], errors="coerce")
    ts = ts.dropna(subset=[date_col])
    ts = ts.sort_values(by=date_col)
    ts = ts.set_index(date_col)
    ts[value_col] = pd.to_numeric(ts[value_col], errors="coerce")

    fc_df = simple_forecast(ts[value_col], periods=periods)

    # merge recent actuals for charting
    recent_actuals = ts.tail(min(100, len(ts)))[value_col]
    actual_points = [{"date": d.strftime("%Y-%m-%d"), "value": None if pd.isna(v) else float(v)}
                     for d, v in recent_actuals.items()]
    forecast_points = [{"date": d.strftime("%Y-%m-%d"), "forecast": None if pd.isna(v) else float(v)}
                       for d, v in fc_df.items()]

    return jsonify({
        "recent_actuals": actual_points,
        "forecast": forecast_points
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
