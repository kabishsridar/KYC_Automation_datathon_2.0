def calculate_risk_score(extracted_data: dict, face_verification: dict, provided_name: str) -> dict:
    """
    Calculates the KYC risk score based on combined evidence.
    Score: 0-100. Lower is better (safer).
    """
    score = 0
    messages = []

    # 1. Assess Name Matching (Provided vs OCR)
    ocr_name = extracted_data.get("name")
    if not ocr_name:
        score += 30
        messages.append("Could not extract name from ID card.")
    else:
        # Basic comparison - case insensitive
        if provided_name.strip().lower() not in ocr_name.lower():
            score += 40
            messages.append(f"Name mismatch: Provided '{provided_name}', found '{ocr_name}'")

    # 2. Identify missing OCR datapoints
    if not extracted_data.get("dob"):
        score += 10
        messages.append("DOB missing from ID.")
        
    if not extracted_data.get("id_number"):
        score += 20
        messages.append("Valid ID number format not detected.")

    # 3. Assess Face Verification
    if face_verification.get("error"):
        score += 50
        messages.append(f"Face verification failed: {face_verification['error']}")
    else:
        if not face_verification.get("is_match"):
            score += 60
            messages.append("Face mismatch between selfie and ID.")
        
        if not face_verification.get("is_live"):
            score += 30
            messages.append("Liveness check failed. Potential spoof attack.")

    # Bound score
    score = min(score, 100)
    score = max(score, 0)

    # Decision Matrix from Implementation Plan
    if score <= 30:
        decision = "Auto approval"
        icon = "✅"
    elif score <= 70:
        decision = "Request additional documents"
        icon = "⚠"
    else:
        decision = "Manual review / Reject"
        icon = "❌"

    return {
        "score": score,
        "decision": decision,
        "message": " | ".join(messages) if messages else "All checks passed successfully.",
        "icon": icon
    }
