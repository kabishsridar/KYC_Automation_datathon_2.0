# Autonomous KYC Implementation Plan

## Goal Description
The objective is to build an "Autonomous KYC" system that automates the customer onboarding process for banking and financial use cases. The system will leverage AI to collect data, verify identity documents, and assess risk with minimal human intervention. 

**Key Features:**
1. **Web Portal Formulation**: Form to capture Name, Address, DOB, Phone, Email, and ID Proof documents (PAN, Aadhaar, Passport, DL).
2. **AI Identity Verification**: 
   - Extract data from documents using OCR/LLMs.
   - Verify document authenticity and detect tampering/expiry.
   - Perform face verification matching live selfies to ID photos with liveness detection via web camera.
3. **Automated Decision Making**: Generate a risk score to determine the next action:
   - *0–30 (Low)*: Auto approval ✅
   - *31–70 (Medium)*: Request additional documents ⚠
   - *71–100 (High)*: Manual review 🔍 / Reject ❌
4. **Live Interview / Video Verification**: Capture and verify the user via a webcam interface.

## Tech Stack Recommendation
- **Frontend / Web Portal**: React.js or Next.js with Tailwind CSS (for modern aesthetics and web camera integration).
- **Backend API**: Python (FastAPI or Flask) for high-performance ML model serving.
- **AI/ML Layer**: 
  - *OCR*: `pytesseract` or `EasyOCR`.
  - *Face Matching & Liveness*: `opencv-python`, `face_recognition`, or standard deep learning facial frameworks (e.g., DeepFace).
  - *Data Validation & Intelligence*: Local LLM or standard NLP techniques for name/address matching.

## Proposed Changes

### Frontend (Web Portal)
#### [NEW] `frontend/src/App.jsx`
Main workflow container for the onboarding steps.
#### [NEW] `frontend/src/components/DocumentUpload.jsx`
Component handling drag-and-drop file uploads for IDs (Aadhaar, PAN, etc.).
#### [NEW] `frontend/src/components/LiveCamera.jsx`
Component connecting to the user's webcam for selfie capture and liveness detection.
#### [NEW] `frontend/src/components/StatusDashboard.jsx`
Dashboard displaying the automated decision (Approved, Needs Review, Rejected) and the risk score.

---

### Backend (Python API)
#### [NEW] `backend/main.py`
FastAPI application entry point containing routes for `/upload-id`, `/verify-face`, and `/get-decision`.
#### [NEW] `backend/services/ocr_service.py`
Service that uses OCR to extract text (Name, DOB, ID number) from the uploaded document images.
#### [NEW] `backend/services/face_service.py`
Service to compare the cropped face from the ID card against the live selfie and perform basic liveness checks.
#### [NEW] `backend/services/risk_engine.py`
Logic to compute the risk score (0-100) based on OCR confidence, face match distance, and missing information, subsequently outputting the automated decision.

## Verification Plan

### Automated Tests
- Unit tests written in `pytest` for the `risk_engine.py` to ensure correct score-to-decision mapping.
- API endpoint tests using `pytest` and `httpx` to mock file uploads and assert JSON responses.
- OCR text extraction tests with mock driver's license/ID images to verify text parsing.

### Manual Verification
- **E2E Flow Test**: The developer and user will launch both frontend and backend servers.
- **Upload test**: User will upload a sample ID image through the UI.
- **Camera test**: User will allow camera permissions in the browser to take a live selfie.
- **Decision Verification**: Ensure the final screen accurately reflects the data extracted and assigns a plausible risk score and outcome.

## User Review Required
> [!IMPORTANT]
> Please review the chosen tech stack (React + Python/FastAPI) and confirm if this aligns with your preferences before we begin execution. Also, indicate if you have any specific AI models or cloud APIs (e.g., AWS Rekognition, Azure Face API, openAI) you want to use instead of local open-source Python libraries.
