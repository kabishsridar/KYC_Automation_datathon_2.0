-- UniFi Core Database Schema (PostgreSQL)

-- 1. Users & Identity
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    kyc_status TEXT DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
    risk_score INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bank Accounts
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_type TEXT NOT NULL, -- SAVINGS, CREDIT_CARD, WALLET
    masked_account_number TEXT NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    consent_token TEXT,
    last_synced TIMESTAMP WITH TIME ZONE
);

-- 3. Transactions (Aggregated)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    category TEXT, -- Food, Travel, etc. (Populated by AI)
    description TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_anomaly BOOLEAN DEFAULT FALSE,
    metadata JSONB -- Flexible field for bank-specific data
);

-- 4. KYC Data (Encrypted Storage)
CREATE TABLE kyc_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type TEXT, -- PAN,AADHAAR,PASSPORT
    document_number_encrypted TEXT,
    document_image_url TEXT,
    face_confidence_score FLOAT,
    verification_payload JSONB, -- Results from OCR and Liveness checks
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Automation Rules
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rule_type TEXT, -- MIN_BALANCE, SAVINGS_SWEEP
    source_account_id UUID REFERENCES bank_accounts(id),
    target_account_id UUID REFERENCES bank_accounts(id),
    threshold_amount DECIMAL(15, 2),
    is_active BOOLEAN DEFAULT TRUE
);
