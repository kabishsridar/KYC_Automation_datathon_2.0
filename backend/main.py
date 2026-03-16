from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import Optional

from services.ocr_service import ocr_extract_data
from services.face_service import verify_face
from services.risk_engine import calculate_risk_score

app = FastAPI(title="Autonomous KYC API", description="API for automating KYC processes")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class KYCDecisionResponse(BaseModel):
    risk_score: int
    decision: str
    extracted_data: dict
    face_match: bool
    liveness_status: bool
    message: str

@app.get("/")
def read_root():
    return {"message": "Autonomous KYC API is running"}

@app.post("/api/kyc/verify", response_model=KYCDecisionResponse)
async def verify_kyc(
    id_card_image: UploadFile = File(...),
    selfie_image: UploadFile = File(...),
    provided_name: str = Form(...),
):
    try:
        # Read file contents
        id_image_bytes = await id_card_image.read()
        selfie_image_bytes = await selfie_image.read()

        # Step 1: OCR Extraction
        extracted_data = ocr_extract_data(id_image_bytes)

        # Step 2: Face Verification & Liveness
        face_verification_result = verify_face(id_image_bytes, selfie_image_bytes)
        
        # Step 3: Risk Assessment
        risk_result = calculate_risk_score(
            extracted_data, 
            face_verification_result, 
            provided_name
        )

        return KYCDecisionResponse(
            risk_score=risk_result["score"],
            decision=risk_result["decision"],
            extracted_data=extracted_data,
            face_match=face_verification_result["is_match"],
            liveness_status=face_verification_result["is_live"],
            message=risk_result["message"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
