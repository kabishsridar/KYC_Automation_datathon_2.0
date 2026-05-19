"""
Merged KYC Model - Unified data model from all KYC implementations in datathon_2.0

Sources merged:
- backend/ (Autonomous KYC API): OCR, face verification, risk engine
- agent/unifi-platform/backend: User kyc_status, kyc_vault schema
- New folder (2)/New folder/dashboard: DevFlow Intelligence Platform, Identity Graph, Document Intelligence
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Optional


# ============== Enums ==============

class KycStatus(str, Enum):
    """User-level KYC status (from UniFi)"""
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class VerificationStatus(str, Enum):
    """Document verification outcome (from DevFlow + Autonomous KYC)"""
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"
    FLAGGED = "FLAGGED"
    PENDING = "PENDING"


class DocumentType(str, Enum):
    """Supported ID document types"""
    AADHAAR = "Aadhaar"
    PAN = "PAN Card"
    PASSPORT = "Passport"
    DRIVING_LICENSE = "Driving License"


class DecisionType(str, Enum):
    """Risk-based decision (from Autonomous KYC)"""
    AUTO_APPROVAL = "Auto approval"
    ADDITIONAL_DOCUMENTS = "Request additional documents"
    MANUAL_REVIEW = "Manual review / Reject"


# ============== Input Models ==============

@dataclass
class CustomerIdentity:
    """Customer info for KYC session (from DevFlow Kiosk)"""
    name: str
    customer_id: str
    phone: str
    email: str


@dataclass
class KycVerificationRequest:
    """Unified verification request - merges all API inputs"""
    # From Autonomous KYC
    id_card_image: Optional[bytes] = None
    selfie_image: Optional[bytes] = None
    provided_name: Optional[str] = None
    # From UniFi
    document_type: Optional[str] = None
    document_url: Optional[str] = None
    # From DevFlow
    customer: Optional[CustomerIdentity] = None
    doc_type: Optional[DocumentType] = None


# ============== Extracted Data ==============

@dataclass
class ExtractedData:
    """OCR + Document Intelligence extraction (merged from backend OCR + DevFlow)"""
    name: Optional[str] = None
    dob: Optional[str] = None
    id_number: Optional[str] = None
    address: Optional[str] = None
    raw_text: Optional[str] = None
    # DevFlow metadata
    metadata: dict = field(default_factory=lambda: {
        "software": None,
        "modified": None,
        "location": None
    })


# ============== Face Verification ==============

@dataclass
class FaceVerificationResult:
    """Face match + liveness (from backend face_service)"""
    is_match: bool
    is_live: bool
    confidence_score: Optional[float] = None
    error: Optional[str] = None


# ============== Risk Assessment ==============

@dataclass
class RiskAssessment:
    """Risk scoring (from backend risk_engine + DevFlow metrics)"""
    score: int  # 0-100, lower is better
    decision: DecisionType
    message: str
    # DevFlow extended metrics
    doc_auth_score: Optional[int] = None
    tamper_risk_score: Optional[int] = None
    identity_consistency: Optional[int] = None
    face_match_confidence: Optional[int] = None
    fraud_pattern_risk: Optional[int] = None


# ============== Document Intelligence Report ==============

@dataclass
class DocumentIntelligenceReport:
    """Full document analysis (from DevFlow DocumentIntelligenceEngine)"""
    doc_type: str
    status: VerificationStatus
    extracted_data: ExtractedData
    doc_auth_score: int
    tamper_risk_score: int
    identity_consistency: int
    face_match_confidence: int
    fraud_pattern_risk: int
    verification_id: Optional[str] = None


# ============== KYC Verification Response ==============

@dataclass
class KycVerificationResponse:
    """Unified API response - merges all versions"""
    # Core (Autonomous KYC)
    risk_score: int
    decision: str
    extracted_data: ExtractedData
    face_match: bool
    liveness_status: bool
    message: str
    # UniFi-style
    status: VerificationStatus
    verification_id: Optional[str] = None
    confidence_score: Optional[float] = None
    # DevFlow-style
    doc_intelligence: Optional[DocumentIntelligenceReport] = None


# ============== Identity Graph (Fraud Network) ==============

@dataclass
class KycSubmission:
    """Single KYC submission for identity graph (from DevFlow IdentityGraphEngine)"""
    id: str  # e.g. KYC-10291
    customer: str
    phone: str
    email: str
    document: str
    device_id: str
    ip: str
    address: str


@dataclass
class IdentityNode:
    """Graph node for fraud network visualization"""
    id: str
    label: str
    type: str  # "account" | "attribute"


@dataclass
class IdentityEdge:
    """Graph edge linking accounts/attributes"""
    from_id: str
    to_id: str


@dataclass
class IdentityGraphData:
    """Fraud network detection (from DevFlow IdentityGraphEngine)"""
    nodes: list[IdentityNode]
    edges: list[IdentityEdge]
    connected_accounts: list[str]
    shared_phone: bool
    shared_email: bool
    shared_document: bool
    shared_device: bool
    shared_ip: bool
    shared_address: bool
    risk_score: int  # 0-100 Identity Network Risk


# ============== User & Storage ==============

@dataclass
class User:
    """User with KYC status (from UniFi)"""
    id: str
    full_name: str
    email: str
    phone_number: Optional[str] = None
    is_verified: bool = False
    kyc_status: KycStatus = KycStatus.PENDING
    risk_score: int = 0


@dataclass
class KycVaultRecord:
    """Encrypted KYC storage (from UniFi schema.sql)"""
    id: str
    user_id: str
    document_type: str
    document_number_encrypted: Optional[str] = None
    document_image_url: Optional[str] = None
    face_confidence_score: Optional[float] = None
    verification_payload: Optional[dict] = None
    updated_at: Optional[datetime] = None


# ============== KYC Workflow State ==============

class KycWorkflowStep(str, Enum):
    """Kiosk verification sequence (from DevFlow)"""
    CUSTOMER_IDENTITY = "Customer Identity"
    DOCUMENT_ACQUISITION = "Document Acquisition"
    BIOMETRIC_CAPTURE = "Biometric Capture"
    NEURAL_INTELLIGENCE = "Neural Intelligence"
    VERIFICATION_RESULT = "Verification Result"
