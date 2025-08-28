# BI Risk Backend (Flask)

## Setup
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Server runs at: `http://localhost:5000`

## API Endpoints
- `GET /api/health` — status check
- `POST /api/upload` — multipart file upload (CSV/XLSX) -> returns `dataset_id`
- `GET /api/columns/<dataset_id>` — returns all columns and numeric/categorical splits
- `POST /api/analyze` — JSON body `{dataset_id, value_column}` -> z-score anomalies
- `POST /api/forecast` — JSON body `{dataset_id, date_column, value_column, periods}` -> baseline forecast

## Notes
- Datasets are stored **in memory** for simplicity.
- For persistence, connect a database (e.g., Postgres) and map `dataset_id` to stored files.
