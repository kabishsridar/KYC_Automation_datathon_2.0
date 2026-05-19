from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

class HeartRateCreate(BaseModel):
    patient_id: str
    heart_rate: float
    oxygen_level: Optional[float] = None
    timestamp: datetime

class PatientBase(BaseModel):
    patient_id: str
    name: str
    age: int
    guardian_contact: str

class AlertRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    alert_id: int
    patient_id: str
    alert_type: str
    message: str
    timestamp: datetime

class DailySummary(BaseModel):
    average_heart_rate: float
    lowest_heart_rate: float
    highest_heart_rate: float
    abnormal_events: int
