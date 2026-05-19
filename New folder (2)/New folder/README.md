# LifeLine AI Backend

A FastAPI-based health monitoring backend that analyzes heart rate data in real time and generates alerts for abnormal conditions. Designed for patient monitoring systems with AI-powered anomaly detection.

## Features

- **Real-time heart rate analysis** — Detects normal, warning, and critical heart rate levels
- **Automatic alert generation** — Creates alerts for abnormal readings (low/high heart rate)
- **Patient management** — Register and track patients with guardian contact info
- **Daily reports** — Get summary statistics (average, min, max heart rate, abnormal events)
- **SQLite database** — Lightweight, file-based storage (no external DB required)

## Heart Rate Thresholds

| Level | Range | Alert Type |
|-------|-------|------------|
| Normal | 60–100 bpm | — |
| Warning (Low) | 50–60 bpm | WARNING_LOW |
| Warning (High) | 100–120 bpm | WARNING_HIGH |
| Critical (Low) | <50 bpm | CRITICAL_LOW |
| Critical (High) | >120 bpm | CRITICAL_HIGH |

## Prerequisites

- Python 3.10+
- pip

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   venv\Scripts\activate   # Windows
   # source venv/bin/activate   # macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

```bash
cd backend
uvicorn main:app --reload
```

The API will be available at:
- **API:** http://127.0.0.1:8000
- **Interactive docs:** http://127.0.0.1:8000/docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/seed-patient` | Register a new patient |
| POST | `/health-data` | Submit heart rate & oxygen data (creates patient if needed) |
| GET | `/patient-report?patient_id={id}` | Get daily summary for a patient |
| GET | `/alerts?patient_id={id}` | Get alerts (optional filter by patient) |
| GET | `/patients` | List all patients |

### Example: Submit Health Data

```bash
curl -X POST http://127.0.0.1:8000/health-data \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "patient-001",
    "heart_rate": 75,
    "oxygen_level": 98,
    "timestamp": "2024-01-15T10:00:00"
  }'
```

### Example: Register a Patient

```bash
curl -X POST http://127.0.0.1:8000/seed-patient \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "patient-001",
    "name": "John Doe",
    "age": 65,
    "guardian_contact": "+1234567890"
  }'
```

## Project Structure

```
backend/
├── main.py        # FastAPI app & routes
├── ai_engine.py   # Heart rate analysis & alert message generation
├── database.py    # SQLAlchemy engine & session
├── models.py      # Patient, HeartRateData, Alert models
├── schemas.py     # Pydantic request/response schemas
├── requirements.txt
└── lifeline.db    # SQLite database (created on first run)
```

## Dependencies

- **FastAPI** — Web framework
- **Uvicorn** — ASGI server
- **SQLAlchemy** — ORM & database
- **Pydantic** — Data validation

## License

MIT
