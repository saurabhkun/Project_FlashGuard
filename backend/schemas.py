# schemas.py
from pydantic import BaseModel
from typing import Optional, List

# This matches one PaySim-style transaction
class TransactionRequest(BaseModel):
    # Basic transaction fields (PaySim-like)
    type: str                # e.g. "CASH_OUT", "TRANSFER", "PAYMENT"
    amount: float
    oldbalanceOrg: float
    newbalanceOrig: float
    oldbalanceDest: float
    newbalanceDest: float

    # Optional extra fields if you want to send them
    nameOrig: Optional[str] = None
    nameDest: Optional[str] = None
    isFlaggedFraud: Optional[int] = None  # 0 or 1, optional in requests


class PredictionResponse(BaseModel):
    is_fraud: bool           # model decision (True/False)
    fraud_probability: float # 0–1 probability from model
    message: Optional[str] = None

    # If you want to attach reasons / feature info
    reasons: Optional[List[str]] = None
