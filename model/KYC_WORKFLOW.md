# KYC Autonomous Verification Workflow

This document outlines the end-to-end process of the KYC (Know Your Customer) autonomous verification system, from data acquisition to the final machine learning decision.

## 1. Project Overview
The objective is to automate the verification of users' identity documents and biometric data using AI and Machine Learning. Specifically, it determines whether a submission should be **VERIFIED** or **REJECTED** based on multiple risk factors.

## 2. The Verification Flow

### Phase 1: Data Acquisition (Input)
- **Document Image**: The user uploads an ID card (Aadhaar, PAN, Passport, etc.).
- **Selfie Image**: The user captures a real-time selfie for face matching.
- **Form Data**: Fundamental information provided by the user (Name, Email, Phone).

### Phase 2: Intelligence Engines (Processing)
1. **OCR Service**: Extracts text from the ID card (Name, DOB, ID Number).
2. **Face Service**: 
   - Compares the face on the ID card with the uploaded selfie.
   - Perfroms **Liveness Detection** to prevent spoofing/deepfake attacks.
3. **Risk Perception**: Detects potential tampering (photoshop, overlapping text) and fraud patterns.

### Phase 3: ML Engine (The Decision Maker)
The system uses a **Random Forest Classifier** trained on the following features:
- **Face Match Confidence**: How well the selfie matches the ID photo.
- **Liveness Score**: Probability that the user is a real person.
- **Tamper Risk**: Detection of anomalies in the document structure.
- **Document Auth Score**: Verification of security features on the ID.
- **Identity Consistency**: Cross-referencing extracted OCR data with user-provided info.
- **Fraud Pattern Risk**: Matching against known identity theft patterns (Identity Graph).

### Phase 4: Final Outcome (Output)
The model outputs a final status:
- ✅ **VERIFIED**: All checks pass high-confidence thresholds.
- ❌ **REJECTED**: Critical failures (e.g., face mismatch or liveness failure).
- ⚠️ **FLAGGED**: Low confidence in some areas, requiring manual review (optional state).

## 3. Implementation Files
- `kyc_model.py`: Unified data structures and schemas.
- `train_kyc.py`: Model training script using Random Forest.
- `test_kyc_performance.py`: Evaluation script for accuracy and precision.
- `kyc_classifier.pkl`: The saved pre-trained model.

## 4. How to Use
1. Prepare user data as documented in `KYCVerificationRequest`.
2. Feed the extracted metadata into the `kyc_classifier.pkl`.
3. Receive the automated verification result.
