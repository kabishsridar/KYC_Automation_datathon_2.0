from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="UniFi API", description="Universal Financial Identity Platform API")

# Mock Data Models
class User(BaseModel):
    id: str
    full_name: str
    email: str
    is_verified: bool = False
    kyc_status: str = "PENDING"

class BankAccount(BaseModel):
    id: str
    bank_name: str
    account_type: str
    balance: float
    currency: str = "USD"

@app.get("/")
async def root():
    return {"message": "Welcome to UniFi API", "status": "online"}

@app.get("/users/me", response_model=User)
async def get_current_user():
    # Mock user
    return User(id="usr_123", full_name="John Doe", email="john@example.com", is_verified=True, kyc_status="COMPLETED")

@app.get("/accounts", response_model=List[BankAccount])
async def get_accounts():
    # Mock accounts
    return [
        BankAccount(id="acc_1", bank_name="Bank of America", account_type="SAVINGS", balance=12500.50),
        BankAccount(id="acc_2", bank_name="Chase", account_type="CREDIT_CARD", balance=-450.20),
        BankAccount(id="acc_3", bank_name="Revolut", account_type="WALLET", balance=3200.00)
    ]

@app.post("/kyc/verify")
async def verify_kyc(document_type: str, document_url: str):
    # Simulated AI logic
    import random
    confidence = random.uniform(0.85, 0.99)
    liveness = random.choice([True, True, True, False]) # 75% success
    
    if not liveness:
        return {"status": "FAILED", "reason": "Liveness check failed (Deepfake detected)"}
    
    return {
        "status": "SUCCESS",
        "data": {
            "full_name": "JOHN DOE",
            "document_number": "XXXX-XXXX-1234",
            "confidence_score": confidence,
            "verification_id": f"VRF_{random.randint(1000, 9999)}"
        }
    }

@app.get("/intelligence/categorize")
async def categorize_transactions(description: str):
    # Simulated AI Categorization (NLP)
    mapping = {
        "starbucks": "Food & Dining",
        "uber": "Transport",
        "netflix": "Subscriptions",
        "aws": "Business/Tech",
        "rent": "Housing"
    }
    desc_lower = description.lower()
    for key, cat in mapping.items():
        if key in desc_lower:
            return {"description": description, "category": cat}
    
    return {"description": description, "category": "General"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
