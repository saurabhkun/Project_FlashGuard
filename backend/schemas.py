from pydantic import BaseModel
from typing import Optional
from pydantic import BaseModel

class TransactionRequest(BaseModel):
    nameOrig: str      # This matches generate_realistic_id() in streamer
    nameDest: str      # This matches generate_realistic_id() in streamer
    type: str          # Required for the AI to predict
    amount: float
    oldbalanceOrg: float
    newbalanceOrig: float
    oldbalanceDest: float
    newbalanceDest: float
    location: str
    device_id: str
    gps_coords: str