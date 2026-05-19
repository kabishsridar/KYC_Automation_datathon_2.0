from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

import models
import schemas
from database import SessionLocal, engine
from ai_engine import analyze_heart_rate, generate_alert_message

models.Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="LifeLine AI Backend")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Temporary endpoint to seed a patient
@app.post("/seed-patient")
def seed_patient(patient: schemas.PatientBase, db: Session = Depends(get_db)):
    db_patient = models.Patient(**patient.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@app.post("/health-data")
def receive_health_data(data: schemas.HeartRateCreate, db: Session = Depends(get_db)):
    # Verify patient
    patient = db.query(models.Patient).filter(models.Patient.patient_id == data.patient_id).first()
    if not patient:
        # Create a dummy patient if not exists for demo purposes
        patient = models.Patient(patient_id=data.patient_id, name="User " + data.patient_id, age=30, guardian_contact="+123456789")
        db.add(patient)
        db.commit()
        db.refresh(patient)

    # Save heart rate data
    db_hr = models.HeartRateData(
        patient_id=data.patient_id,
        heart_rate=data.heart_rate,
        oxygen_level=data.oxygen_level,
        timestamp=data.timestamp
    )
    db.add(db_hr)
    
    # AI Monitoring
    alert_level = analyze_heart_rate(data.heart_rate)
    
    response: dict = {"status": "success", "alert_triggered": False}

    if alert_level != "NORMAL":
        message = generate_alert_message(alert_level, data.heart_rate)
        # Create Alert
        db_alert = models.Alert(
            patient_id=data.patient_id,
            alert_type=alert_level,
            message=message,
            timestamp=data.timestamp
        )
        db.add(db_alert)
        response["alert_triggered"] = True
        response["alert"] = {
            "type": alert_level,
            "message": message
        }
    
    db.commit()
    return response

@app.get("/patient-report")
def get_patient_report(patient_id: str, db: Session = Depends(get_db)):
    hr_data = db.query(models.HeartRateData).filter(
        models.HeartRateData.patient_id == patient_id
    ).all()

    if not hr_data:
        # Return empty summary if no data
        return schemas.DailySummary(average_heart_rate=0, lowest_heart_rate=0, highest_heart_rate=0, abnormal_events=0)
    
    rates = [d.heart_rate for d in hr_data]
    avg = sum(rates) / len(rates)
    lowest = min(rates)
    highest = max(rates)

    alerts_count = db.query(models.Alert).filter(
        models.Alert.patient_id == patient_id
    ).count()

    summary = schemas.DailySummary(
        average_heart_rate=round(avg, 2),
        lowest_heart_rate=lowest,
        highest_heart_rate=highest,
        abnormal_events=alerts_count
    )
    return summary

@app.get("/alerts", response_model=List[schemas.AlertRead])
def get_alerts(patient_id: str | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Alert)
    if patient_id:
        query = query.filter(models.Alert.patient_id == patient_id)
    return query.order_by(models.Alert.timestamp.desc()).all()

@app.get("/patients")
def get_patients(db: Session = Depends(get_db)):
    return db.query(models.Patient).all()
