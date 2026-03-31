from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class TransactionRequest(BaseModel):
    step: int
    type: str
    amount: float
    nameOrig: str
    oldbalanceOrg: float
    newbalanceOrig: float
    nameDest: str
    oldbalanceDest: float
    newbalanceDest: float
    location: str
    ip_address: Optional[str] = "0.0.0.0"
    device_id: Optional[str] = "Unknown"
    gps_coordinates: Optional[str] = "0.0, 0.0"
    # NEW: Added to catch the truth from the dataset
    is_fraud_label: Optional[int] = 0 

# Risk Score Response with SHAP-like explanations
class RiskScoreResponse(BaseModel):
    risk_score: int               # 0-100
    level: str                    # SAFE, SUSPICIOUS, FRAUD
    decision: str                 # ACCEPT, REVIEW, BLOCK
    reasons: List[str]            # SHAP-like reason codes
    transaction_id: str
    is_new_user: bool
    behavioral_insight: Optional[str] = None
    amount_deviation: Optional[float] = None
    velocity_anomaly: Optional[bool] = None

# Feedback Request for learning
class FeedbackRequest(BaseModel):
    transaction_id: str
    user_feedback: str           # "GENUINE" or "FRAUD"
    feedback_type: str           # "false_positive" or "false_negative"
    comments: Optional[str] = None

# Dashboard Statistics
class DashboardStats(BaseModel):
    total_transactions: int
    fraudulent_count: int
    suspicious_count: int
    safe_count: int
    fraud_detection_rate: float
    blocked_today: int
    total_volume: float
    average_transaction: float
    overall_risk_score: int
    recent_high_risk: List[dict]

# Transaction with status for listing
class TransactionWithStatus(BaseModel):
    id: str
    nameOrig: str
    nameDest: str
    type: str
    amount: float
    timestamp: datetime
    location: str
    status: str                  # SAFE, SUSPICIOUS, FRAUD
    risk_score: int
    action_taken: str

# Alert model
class Alert(BaseModel):
    id: str
    type: str                    # LOGIN_ATTEMPT, UNUSUAL_LOCATION, HIGH_RISK_TXN
    severity: str                # low, medium, high
    message: str
    timestamp: datetime
    related_user: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

# User behavioral profile
class UserBehaviorProfile(BaseModel):
    user_id: str
    avg_transaction_amount: float
    max_transaction_amount: float
    usual_transaction_hours: List[int]
    usual_locations: List[str]
    transaction_count: int
    last_transaction_date: datetime
    trust_score: int             # 0-100 based on behavior