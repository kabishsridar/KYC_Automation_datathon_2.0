# Merged KYC Model

Unified data model and schema for all KYC-related implementations in `datathon_2.0`.

## Source Versions Merged

| Location | Description |
|----------|--------------|
| `backend/` | Autonomous KYC API – OCR extraction, face verification, risk engine |
| `agent/unifi-platform/backend/` | UniFi API – User `kyc_status`, `/kyc/verify`, `kyc_vault` table |
| `New folder (2)/New folder/dashboard/` | DevFlow KYC Intelligence Platform – Kiosk, Identity Graph, Document Intelligence |

## Model Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KYC VERIFICATION FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  KycVerificationRequest          KycVerificationResponse                     │
│  ├─ id_card_image               ├─ risk_score                               │
│  ├─ selfie_image                ├─ decision (Auto/Additional/Manual)         │
│  ├─ provided_name               ├─ status (VERIFIED/REJECTED/FLAGGED)        │
│  ├─ document_type/url           ├─ extracted_data                           │
│  └─ customer (DevFlow)          ├─ face_match, liveness_status                │
│                                └─ doc_intelligence (DevFlow metrics)        │
│                                                                             │
│  Supporting Models:                                                          │
│  ├─ ExtractedData (OCR: name, dob, id_number, address)                       │
│  ├─ FaceVerificationResult (is_match, is_live)                              │
│  ├─ RiskAssessment (score 0-100, decision)                                   │
│  ├─ DocumentIntelligenceReport (docAuth, tamperRisk, fraudPattern)           │
│  └─ IdentityGraphData (fraud network: shared phone/email/device/IP)          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         STORAGE & ENTITIES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  User (kyc_status: PENDING | COMPLETED | FAILED)                              │
│  KycVaultRecord (encrypted document storage)                                  │
│  KycSubmission (for identity graph / fraud detection)                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Files

| File | Purpose |
|------|---------|
| `kyc_model.py` | Python dataclasses – unified request/response, entities, enums |
| `kyc_schema.sql` | PostgreSQL schema – users, kyc_vault, kyc_submissions, verifications |
| `README.md` | This documentation |

## Usage

```python
from model.kyc_model import (
    KycVerificationRequest,
    KycVerificationResponse,
    KycStatus,
    VerificationStatus,
    ExtractedData,
    RiskAssessment,
)
```

## KYC Workflow Steps (DevFlow Kiosk)

1. **Customer Identity** – name, customer_id, phone, email  
2. **Document Acquisition** – select doc type (Aadhaar, PAN, Passport, DL), upload  
3. **Biometric Capture** – selfie/liveness  
4. **Neural Intelligence** – OCR, tamper detection, face match  
5. **Verification Result** – VERIFIED / REJECTED / FLAGGED  
