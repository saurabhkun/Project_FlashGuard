import os
import sys
import numpy as np
import pandas as pd
import uuid
from datetime import datetime
from typing import Tuple, List, Dict, Any

# Ensure backend folder is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from security_engine import calculate_distance, calculate_recipient_risk
from ml_adapter import FraudGuardAdapter

# 1. SETUP PATHS
# New FraudGuard Model path
MODEL_PATH = os.path.join(BASE_DIR, "fraudguard_model.pkl")

# 2. LOAD THE NEW FRAUDGUARD ML MODEL
fraud_adapter = FraudGuardAdapter(MODEL_PATH)

def load_model():
    """Load/verify FraudGuard model bundle."""
    if not fraud_adapter.is_loaded:
        fraud_adapter.load_bundle(MODEL_PATH)
    return fraud_adapter if fraud_adapter.is_loaded else None

# Initial model load check
model = load_model()

# Store user historical data for behavioral analysis
user_transaction_history: Dict[str, List[dict]] = {}

# High-risk countries
HIGH_RISK_COUNTRIES = ['Russia', 'Nigeria', 'China', 'Romania', 'Vietnam', 'Iran', 'Syria']

# 3. THE PREDICTION BRAIN (Numerical Analysis & FraudGuard AI Model)
def make_decision(data) -> Tuple[str, int]:
    try:
        if isinstance(data, dict):
            payload_dict = data
            location = data.get("location", "")
        else:
            payload_dict = data.dict() if hasattr(data, "dict") else data.__dict__
            location = getattr(data, "location", "")

        ml_result = fraud_adapter.predict_payload(payload_dict)
        prediction = 1 if ml_result.get("is_fraud", False) else 0

        # Business Logic Rule: Always block Remote IPs or Fraud predictions
        if prediction == 1 or location == "Remote IP":
            status = "BLOCKED"
        else:
            status = "SUCCESS"
            
        return status, prediction

    except Exception as e:
        print(f"🚨 AI ERROR: {e}")
        location_val = getattr(data, "location", "") if not isinstance(data, dict) else data.get("location", "")
        return ("BLOCKED", 1) if location_val == "Remote IP" else ("SUCCESS", 0)


# 4. Calculate Risk Score (0-100) with FraudGuard AI & Heuristics
def calculate_risk_score(data, user_history: List[dict] = None) -> dict:
    """
    Calculate risk score from 0-100 combining FraudGuard ML model with 11-layer heuristics.
    Level 1 (0-40): Safe / Auto accept
    Level 2 (41-80): Suspicious - held for review
    Level 3 (81-100): Blocked as fraud
    """
    risk_score = 0
    reasons = []
    
    current_hour = datetime.now().hour
    if user_history is None:
        user_history = []
    
    is_new_user = len(user_history) == 0
    
    if isinstance(data, dict):
        payload_dict = data
        amount = float(data.get("amount", 0.0))
        oldbalanceOrg = float(data.get("oldbalanceOrg", 0.0))
        newbalanceOrig = float(data.get("newbalanceOrig", 0.0))
        location = str(data.get("location", ""))
        txn_type = str(data.get("type", ""))
        nameDest = str(data.get("nameDest", ""))
        gps_coordinates = str(data.get("gps_coordinates", "0.0, 0.0"))
    else:
        payload_dict = data.dict() if hasattr(data, "dict") else data.__dict__
        amount = float(getattr(data, "amount", 0.0))
        oldbalanceOrg = float(getattr(data, "oldbalanceOrg", 0.0))
        newbalanceOrig = float(getattr(data, "newbalanceOrig", 0.0))
        location = str(getattr(data, "location", ""))
        txn_type = str(getattr(data, "type", ""))
        nameDest = str(getattr(data, "nameDest", ""))
        gps_coordinates = str(getattr(data, "gps_coordinates", "0.0, 0.0"))

    # ============ 1. FRAUDGUARD ML MODEL SCORE (0-85 points) ============
    try:
        ml_result = fraud_adapter.predict_payload(payload_dict)
        prob = ml_result.get("fraud_probability", 0.0)
        
        if ml_result.get("is_fraud", False) or prob >= 0.80:
            risk_score += int(min(85, 50 + (prob * 35)))
            reasons.append(f"FraudGuard AI model detected high fraud probability ({prob:.1%})")
        elif prob >= 0.40:
            risk_score += int(prob * 50)
            reasons.append(f"FraudGuard AI model flagged elevated risk ({prob:.1%})")
    except Exception as e:
        print(f"FraudGuard ML model evaluation error: {e}")
    
    # ============ 2. AMOUNT DEVIATION (0-25 points) ============
    if user_history and len(user_history) > 0:
        amounts = [tx.get('amount', 0) for tx in user_history if tx.get('amount')]
        if amounts:
            avg_amount = sum(amounts) / len(amounts)
            max_amount = max(amounts)
            
            if amount > avg_amount * 40:
                risk_score += 25
                reasons.append(f"Amount 40× above normal (₹{amount:.0f} vs avg ₹{avg_amount:.0f})")
            elif amount > avg_amount * 10:
                risk_score += 15
                reasons.append(f"Amount 10× above user's typical transaction")
            elif amount > max_amount:
                risk_score += 10
                reasons.append("Highest transaction amount for this user")
            
            amount_deviation = (amount - avg_amount) / avg_amount if avg_amount > 0 else 0
        else:
            amount_deviation = 0
    else:
        if amount > 50000:
            risk_score += 20
            reasons.append("High amount for new user")
        amount_deviation = 0
    
    # ============ 3. VELOCITY CHECK (0-15 points) ============
    velocity_anomaly = False
    if len(user_history) >= 3:
        risk_score += 15
        reasons.append("High velocity activity detected")
        velocity_anomaly = True
    elif len(user_history) >= 1:
        risk_score += 5
    
    # ============ 4. LOCATION RISK (0-20 points) ============
    if any(country.lower() in location.lower() for country in HIGH_RISK_COUNTRIES):
        risk_score += 20
        reasons.append(f"Transaction from high-risk location: {location}")
    
    # ============ 5. IMPOSSIBLE TRAVEL & LOCATION MISMATCH (0-40 points) ============
    if user_history and len(user_history) > 0:
        last_tx = user_history[0]
        last_location = last_tx.get('location', '')
        if last_location and last_location != location:
            risk_score += 10
            reasons.append("Location mismatch from previous transaction")
            
        if gps_coordinates and gps_coordinates != "0.0, 0.0":
            last_gps = last_tx.get('gps_coordinates', "0.0, 0.0")
            if last_gps and last_gps != "0.0, 0.0":
                try:
                    lat1, lon1 = gps_coordinates.split(',')
                    lat2, lon2 = last_gps.split(',')
                    dist = calculate_distance(lat1, lon1, lat2, lon2)
                    
                    time_diff_hours = 0
                    last_time_str = last_tx.get('timestamp')
                    if last_time_str:
                        if isinstance(last_time_str, str):
                            clean_time = last_time_str.split('.')[0].replace('Z', '')
                            last_time = datetime.fromisoformat(clean_time)
                        else:
                            last_time = last_time_str
                        time_diff_hours = (datetime.now() - last_time).total_seconds() / 3600
                    
                    if dist > 500 and time_diff_hours < 1:
                        risk_score += 40
                        reasons.append(f"Impossible travel: >500km ({dist:.0f}km) in under 1 hour")
                except Exception as e:
                    print(f"Error calculating impossible travel: {e}")
    
    # ============ 6. TIME ANOMALY (0-10 points) ============
    if current_hour >= 0 and current_hour <= 5:
        risk_score += 10
        reasons.append("Transaction during unusual hours (late night)")
    
    # ============ 7. TRANSACTION TYPE RISK (0-10 points) ============
    high_risk_types = ['TRANSFER', 'CASH_OUT']
    if txn_type in high_risk_types:
        risk_score += 10
        reasons.append(f"High-risk transaction type: {txn_type}")
    
    # ============ 8. BALANCE ANOMALY (0-10 points) ============
    if oldbalanceOrg > 0 and amount > oldbalanceOrg * 0.9:
        risk_score += 10
        reasons.append("Draining most of account balance")
        
    # ============ 9. RECIPIENT RISK FACTOR ============
    recipient_risk = calculate_recipient_risk(nameDest)
    if recipient_risk > 0:
        risk_score += recipient_risk
        reasons.append(f"High risk recipient metadata (Risk Factor: +{recipient_risk})")
    
    # Cap risk score at 100
    risk_score = min(risk_score, 100)
    
    # Determine level and decision
    if risk_score <= 40:
        level = "SAFE"
        decision = "ACCEPT"
    elif risk_score <= 80:
        level = "SUSPICIOUS"
        decision = "REVIEW"
    else:
        level = "FRAUD"
        decision = "BLOCK"
    
    transaction_id = f"TXN-{uuid.uuid4().hex[:8].upper()}"
    
    return {
        "risk_score": risk_score,
        "level": level,
        "decision": decision,
        "reasons": reasons if reasons else ["All parameters within normal range"],
        "transaction_id": transaction_id,
        "is_new_user": is_new_user,
        "amount_deviation": amount_deviation if 'amount_deviation' in locals() else 0,
        "velocity_anomaly": velocity_anomaly
    }


def store_transaction(user_id: str, transaction_data: dict):
    if user_id not in user_transaction_history:
        user_transaction_history[user_id] = []
    user_transaction_history[user_id].append(transaction_data)
    user_transaction_history[user_id] = user_transaction_history[user_id][-100:]


def get_user_history(user_id: str) -> List[dict]:
    return user_transaction_history.get(user_id, [])


def get_all_transactions() -> List[dict]:
    all_tx = []
    for user_id, history in user_transaction_history.items():
        all_tx.extend(history)
    return sorted(all_tx, key=lambda x: x.get('timestamp', datetime.now()), reverse=True)
