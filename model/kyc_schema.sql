-- Merged KYC Database Schema
-- Unified from: backend, agent/unifi-platform, New folder (2)/New folder/dashboard

-- 1. Users & KYC Status (from UniFi)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    kyc_status TEXT DEFAULT 'PENDING',  -- PENDING, COMPLETED, FAILED
    risk_score INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. KYC Vault - Encrypted Storage (from UniFi)
CREATE TABLE kyc_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type TEXT,  -- PAN, AADHAAR, PASSPORT, DRIVING_LICENSE
    document_number_encrypted TEXT,
    document_image_url TEXT,
    face_confidence_score FLOAT,
    verification_payload JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. KYC Submissions (from DevFlow Identity Graph)
CREATE TABLE kyc_submissions (
    id TEXT PRIMARY KEY,  -- e.g. KYC-10291
    user_id UUID REFERENCES users(id),
    customer_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    document_number TEXT,
    device_id TEXT,
    ip_address TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. KYC Verification Results (merged from all APIs)
CREATE TABLE kyc_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id TEXT REFERENCES kyc_submissions(id),
    user_id UUID REFERENCES users(id),
    verification_id TEXT UNIQUE,  -- e.g. VRF_1234, DF-INTEL-X900
    risk_score INT NOT NULL,
    decision TEXT NOT NULL,  -- Auto approval, Request additional documents, Manual review
    status TEXT NOT NULL,  -- VERIFIED, REJECTED, FLAGGED
    extracted_data JSONB,  -- name, dob, id_number, address
    face_match BOOLEAN,
    liveness_status BOOLEAN,
    doc_auth_score INT,
    tamper_risk_score INT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Identity Graph Edges (for fraud network detection)
CREATE TABLE identity_graph_edges (
    id SERIAL PRIMARY KEY,
    from_submission_id TEXT REFERENCES kyc_submissions(id),
    to_submission_id TEXT REFERENCES kyc_submissions(id),
    shared_attribute TEXT,  -- phone, email, document, device, ip, address
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
