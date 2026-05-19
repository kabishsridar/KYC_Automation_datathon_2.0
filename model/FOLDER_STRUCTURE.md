# datathon_2.0 Folder Structure (KYC-Related)

Model of the datathon_2.0 folder with focus on KYC implementations.

```
datathon_2.0/
├── agent/
│   └── unifi-platform/
│       └── backend/
│           ├── main.py          # KYC: POST /kyc/verify, User.kyc_status
│           └── schema.sql       # kyc_vault table
├── backend/
│   ├── main.py                 # Autonomous KYC API: POST /api/kyc/verify
│   └── services/
│       ├── ocr_service.py      # OCR extraction (name, dob, id_number)
│       ├── face_service.py     # Face verification + liveness
│       └── risk_engine.py      # Risk score 0-100, decision
├── frontend/
│   └── src/
│       ├── App.jsx             # KYC verification UI
│       └── components/
│           ├── DocumentUpload.jsx
│           ├── LiveCamera.jsx
│           └── StatusDashboard.jsx
├── New folder (2)/
│   └── New folder/
│       └── dashboard/
│           └── src/
│               ├── app/
│               │   ├── kyc-verification-kiosk/page.js
│               │   ├── ai-identity-graph/page.js
│               │   ├── ai-tools/voice/page.js    # KYC Voice Assistant
│               │   ├── doctor-portal/page.js
│               │   ├── hospital/page.js
│               │   ├── nurse/page.js
│               │   └── page.js                   # KYC Intelligence Platform
│               └── components/
│                   ├── DocumentIntelligenceEngine.js
│                   └── IdentityGraphEngine.tsx
├── v2/                         # (HTML/CSS/JS, no KYC in this version)
└── model/                      # ← MERGED KYC MODEL (this folder)
    ├── kyc_model.py
    ├── kyc_schema.sql
    ├── README.md
    └── FOLDER_STRUCTURE.md
```

## KYC Version Summary

| Version | Path | Key Features |
|---------|------|--------------|
| 1 | `backend/` + `frontend/` | OCR, face verification, risk engine, multipart form |
| 2 | `agent/unifi-platform/backend/` | User kyc_status, kyc_vault, document_type + URL |
| 3 | `New folder (2)/.../dashboard/` | DevFlow Kiosk, Identity Graph, Document Intelligence |
