from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from database import Base
from datetime import datetime

class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    guardian_contact = Column(String)

class HeartRateData(Base):
    __tablename__ = "heart_rate_data"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.patient_id"))
    heart_rate = Column(Float)
    oxygen_level = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.patient_id"))
    alert_type = Column(String)
    message = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
