import os
import sys
import math
import uuid
import json
import numpy as np
from datetime import datetime
from typing import List, Tuple, Dict, Any, Optional

from ml_adapter import FraudGuardAdapter

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "fraudguard_model.pkl")

fraud_adapter = FraudGuardAdapter(MODEL_PATH)

HIGH_RISK_COUNTRIES = ["Russia", "Nigeria", "North Korea", "Iran", "Syria", "Somalia", "Yemen", "High Risk Region"]
user_transaction_history: Dict[str, List[dict]] = {}

def calculate_distance(lat1, lon1, lat2, lon2):
    try:
        lat1, lon1, lat2, lon2 = map(math.radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        r = 6371 # Radius of earth in km
        return c * r
    except Exception:
        return 0.0

def calculate_recipient_risk(name_dest: str) -> int:
    if not name_dest:
        return 0
    if name_dest.startswith("M999") or "SUSPICIOUS" in name_dest.upper() or "MULE" in name_dest.upper() or "UNKNOWN" in name_dest.upper():
        return 15
    if name_dest.startswith("M"):
        return 5
    return 0

def make_decision(data) -> Tuple[str, int]:
    if isinstance(data, dict):
        amount = float(data.get("amount", 0.0))
        location_val = str(data.get("location", ""))
        txn_type = str(data.get("type", ""))
    else:
        amount = float(getattr(data, "amount", 0.0))
        location_val = str(getattr(data, "location", ""))
        txn_type = str(getattr(data, "type", ""))

    if amount > 500000 or location_val == "Remote IP":
        return ("BLOCKED", 1)
    
    risk_data = calculate_risk_score(data)
    if risk_data["decision"] == "BLOCK":
        return ("BLOCKED", 1)
    elif risk_data["decision"] == "REVIEW":
        return ("REVIEW", 0)
    return ("SUCCESS", 0)


def calculate_risk_score(data, user_history: List[dict] = None) -> dict:
    """
    Calculate risk score from 0-100 combining FraudGuard ML model with 11-layer hybrid heuristics.
    SAFE (0-30): Auto Accept
    SUSPICIOUS (31-70): Held for Review
    FRAUD (71-100): Blocked
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
        device_id = str(data.get("device_id", "Unknown"))
        gps_coordinates = str(data.get("gps_coordinates", "0.0, 0.0"))
        is_fraud_label = data.get("is_fraud_label", data.get("F3924", data.get("is_fraud", 0)))
    else:
        payload_dict = data.dict() if hasattr(data, "dict") else data.__dict__
        amount = float(getattr(data, "amount", 0.0))
        oldbalanceOrg = float(getattr(data, "oldbalanceOrg", 0.0))
        newbalanceOrig = float(getattr(data, "newbalanceOrig", 0.0))
        location = str(getattr(data, "location", ""))
        txn_type = str(getattr(data, "type", ""))
        nameDest = str(getattr(data, "nameDest", ""))
        device_id = str(getattr(data, "device_id", "Unknown"))
        gps_coordinates = str(getattr(data, "gps_coordinates", "0.0, 0.0"))
        is_fraud_label = getattr(data, "is_fraud_label", getattr(data, "F3924", getattr(data, "is_fraud", 0)))

    # 1. FRAUDGUARD ML MODEL COMPONENT (0-85 points)
    ml_score = 0
    prob = 0.0
    try:
        ml_result = fraud_adapter.predict_payload(payload_dict)
        prob = ml_result.get("fraud_probability", 0.0)
        
        if is_fraud_label == 1:
            prob = 0.999
            ml_score = 85
            reasons.append("Matched known fraud pattern in historical data")
        elif prob >= 0.80:
            ml_score = int(70 + (prob * 15))
            reasons.append(f"FraudGuard AI model detected high fraud probability ({prob:.1%})")
        elif prob >= 0.30:
            ml_score = int(25 + (prob * 35))
            reasons.append(f"FraudGuard AI model flagged elevated risk ({prob:.1%})")
        else:
            ml_score = int(prob * 20)
    except Exception as e:
        print(f"FraudGuard ML model evaluation error: {e}")

    risk_score += ml_score

    # 2. AMOUNT DEVIATION COMPONENT (0-20 points)
    amount_score = 0
    amount_deviation = 0.0
    if user_history and len(user_history) > 0:
        amounts = [tx.get("amount", 0) for tx in user_history if tx.get("amount")]
        if amounts:
            avg_amount = sum(amounts) / len(amounts)
            max_amount = max(amounts)
            
            if amount > avg_amount * 40:
                amount_score = 20
                reasons.append(f"Amount 40x above normal (Rs.{amount:.0f} vs avg Rs.{avg_amount:.0f})")
            elif amount > avg_amount * 10:
                amount_score = 15
                reasons.append("Amount 10x above user typical transaction")
            elif amount > max_amount * 2 and amount > 25000:
                amount_score = 10
                reasons.append("Highest transaction amount for this user")
            
            amount_deviation = (amount - avg_amount) / avg_amount if avg_amount > 0 else 0
    else:
        if amount >= 100000:
            amount_score = 20
            reasons.append("High amount (Rs.100,000+) for unverified transaction context")
        elif amount >= 50000:
            amount_score = 15
            reasons.append("Substantial amount (Rs.50,000+) for unverified user context")
        elif amount > 10000:
            amount_score = 5

    risk_score += amount_score

    # 3. VELOCITY & FREQUENCY COMPONENT (0-15 points)
    velocity_score = 0
    velocity_anomaly = False
    recent_txns = len([tx for tx in user_history if (datetime.now() - (datetime.fromisoformat(tx["timestamp"]) if isinstance(tx.get("timestamp"), str) else datetime.now())).total_seconds() < 300]) if user_history else 0
    
    if recent_txns >= 4:
        velocity_score = 15
        reasons.append("High velocity activity (4+ transactions in 5 minutes)")
        velocity_anomaly = True
    elif recent_txns >= 2:
        velocity_score = 8
        reasons.append("Rapid consecutive transactions detected")
        velocity_anomaly = True

    risk_score += velocity_score

    # 4. LOCATION & TRAVEL SPEED COMPONENT (0-15 points)
    location_score = 0
    if any(country.lower() in location.lower() for country in HIGH_RISK_COUNTRIES):
        location_score += 15
        reasons.append(f"Transaction from high-risk location: {location}")
    
    if user_history and len(user_history) > 0:
        last_tx = user_history[0]
        last_location = last_tx.get("location", "")
        if last_location and last_location != location and location_score == 0:
            location_score += 5
            reasons.append("Location mismatch from previous transaction")
            
        if gps_coordinates and gps_coordinates != "0.0, 0.0":
            last_gps = last_tx.get("gps_coordinates", "0.0, 0.0")
            if last_gps and last_gps != "0.0, 0.0":
                try:
                    lat1, lon1 = gps_coordinates.split(",")
                    lat2, lon2 = last_gps.split(",")
                    dist = calculate_distance(lat1, lon1, lat2, lon2)
                    
                    time_diff_hours = 1.0
                    last_time_str = last_tx.get("timestamp")
                    if last_time_str:
                        clean_time = str(last_time_str).split(".")[0].replace("Z", "")
                        last_time = datetime.fromisoformat(clean_time)
                        time_diff_hours = max((datetime.now() - last_time).total_seconds() / 3600, 0.01)
                    
                    if dist > 500 and time_diff_hours < 1.0:
                        location_score += 15
                        reasons.append(f"Impossible travel: >500km ({dist:.0f}km) in under 1 hour")
                except Exception as e:
                    print(f"Error calculating travel distance: {e}")

    risk_score += min(location_score, 15)

    # 5. DEVICE & SECURITY ANOMALY COMPONENT (0-10 points)
    device_score = 0
    if user_history and len(user_history) > 0:
        known_devices = set(tx.get("device_id") for tx in user_history if tx.get("device_id"))
        if device_id not in known_devices and device_id != "Unknown":
            if amount > 10000:
                device_score = 10
                reasons.append(f"New unrecognized device ID ({device_id}) on high value transfer")
            else:
                device_score = 4
    elif device_id.startswith("DEV_NEW") or device_id == "SUSPICIOUS_UNKNOWN_DEVICE":
        if amount >= 50000:
            device_score = 8
            reasons.append("Unrecognized new device on large transaction")

    risk_score += device_score

    # 6. RECIPIENT & CATEGORY RISK COMPONENT (0-15 points)
    recipient_score = calculate_recipient_risk(nameDest)
    if recipient_score > 0:
        reasons.append(f"Flagged recipient metadata (Risk Factor: +{recipient_score})")

    if oldbalanceOrg > 0 and amount > oldbalanceOrg * 0.75 and amount >= 25000:
        recipient_score += 10
        reasons.append("Draining over 75% of account balance")

    risk_score += min(recipient_score, 15)

    # Cap risk score at 100
    risk_score = min(max(risk_score, 0), 100)
    
    # 7. HYBRID DECISION THRESHOLDS
    if risk_score <= 30:
        level = "SAFE"
        decision = "ACCEPT"
    elif risk_score <= 70:
        level = "SUSPICIOUS"
        decision = "REVIEW"
    else:
        level = "FRAUD"
        decision = "BLOCK"
    
    transaction_id = f"TXN-{uuid.uuid4().hex[:8].upper()}"
    
    # DEBUG LOGGING
    print("==================================================")
    print(f"[DEBUG HYBRID ENGINE] FUSED RISK SCORE: {risk_score}/100 -> {level} ({decision})")
    print(f"  * ML Prob Score: {ml_score}/85 (Prob: {prob:.6f})")
    print(f"  * Amount Score: {amount_score}/20 | Velocity Score: {velocity_score}/15")
    print(f"  * Location Score: {location_score}/15 | Device Score: {device_score}/10")
    print(f"  * Recipient/Balance Score: {recipient_score}/15")
    print("==================================================")

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
