"""
FraudGuard Pro Hybrid Risk Engine (v2)
Combines calibrated Machine Learning fraud signals with multi-layer
behavioral heuristics (amount deviation, velocity, impossible travel,
recipient risk, account drain, device security, and temporal anomalies).
"""

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

# Initialize global adapter with fraudguard_v2 model bundle
fraud_adapter = FraudGuardAdapter(MODEL_PATH)

HIGH_RISK_COUNTRIES = ["Russia", "Nigeria", "North Korea", "Iran", "Syria", "Somalia", "Yemen", "High Risk Region", "Remote IP"]

def calculate_distance(lat1, lon1, lat2, lon2) -> float:
    """Calculates Haversine distance in kilometers between two GPS coordinates."""
    try:
        lat1, lon1, lat2, lon2 = map(math.radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
        c = 2 * math.asin(math.sqrt(a))
        return c * 6371.0 # Earth radius in km
    except Exception:
        return 0.0

def calculate_recipient_risk(name_dest: str) -> int:
    """Calculates risk score component for flagged recipient identifiers."""
    if not name_dest:
        return 0
    name_upper = str(name_dest).upper()
    if any(tag in name_upper for tag in ["M999", "SUSPICIOUS", "MULE", "FRAUD", "BLACKLIST"]):
        return 15
    if name_upper.startswith("M"):
        return 5
    return 0

def make_decision(data) -> Tuple[str, int]:
    """Compatibility helper returning (status_string, code)."""
    risk_data = calculate_risk_score(data)
    if risk_data["decision"] == "BLOCK":
        return ("BLOCKED", 1)
    elif risk_data["decision"] == "REVIEW":
        return ("REVIEW", 0)
    return ("SUCCESS", 0)

def calculate_risk_score(data, user_history: Optional[List[dict]] = None) -> dict:
    """
    Calculate fused risk score from 0-100 combining FraudGuard ML model with
    7-layer deterministic behavioral heuristics.

    Decision Tiers:
      0 - 40:  SAFE / ACCEPT
      41 - 80: SUSPICIOUS / REVIEW
      81 - 100: FRAUD / BLOCK
    """
    risk_score = 0.0
    reasons = []
    
    if user_history is None:
        user_history = []
    
    is_new_user = len(user_history) == 0
    current_hour = datetime.now().hour

    # Extract payload fields safely
    if isinstance(data, dict):
        payload_dict = data
        amount = float(data.get("amount", 0.0))
        oldbalanceOrg = float(data.get("oldbalanceOrg", 0.0))
        newbalanceOrig = float(data.get("newbalanceOrig", 0.0))
        location = str(data.get("location", ""))
        txn_type = str(data.get("type", "PAYMENT"))
        nameDest = str(data.get("nameDest", ""))
        device_id = str(data.get("device_id", "Unknown"))
        gps_coordinates = str(data.get("gps_coordinates", "0.0, 0.0"))
    else:
        payload_dict = data.dict() if hasattr(data, "dict") else data.__dict__
        amount = float(getattr(data, "amount", 0.0))
        oldbalanceOrg = float(getattr(data, "oldbalanceOrg", 0.0))
        newbalanceOrig = float(getattr(data, "newbalanceOrig", 0.0))
        location = str(getattr(data, "location", ""))
        txn_type = str(getattr(data, "type", "PAYMENT"))
        nameDest = str(getattr(data, "nameDest", ""))
        device_id = str(getattr(data, "device_id", "Unknown"))
        gps_coordinates = str(getattr(data, "gps_coordinates", "0.0, 0.0"))

    # =========================================================================
    # LAYER 1: MACHINE LEARNING RISK SIGNAL (0 - 35 points max)
    # =========================================================================
    ml_score = 0.0
    prob = 0.0
    feature_coverage = 0.0
    try:
        ml_res = fraud_adapter.predict_payload(payload_dict)
        prob = ml_res.get("fraud_probability", 0.0)
        ml_score = ml_res.get("ml_score", 0.0)
        feature_coverage = ml_res.get("feature_coverage", 0.0)
        if ml_res.get("reasons"):
            reasons.extend(ml_res.get("reasons"))
    except Exception as e:
        print(f"ML evaluation error in predict.py: {e}")
        ml_score = 0.0

    risk_score += ml_score

    # =========================================================================
    # LAYER 2: AMOUNT DEVIATION COMPONENT (0 - 25 points max)
    # =========================================================================
    amount_score = 0.0
    amount_deviation = 0.0
    if user_history and len(user_history) > 0:
        amounts = [float(tx.get("amount", 0)) for tx in user_history if tx.get("amount")]
        if amounts:
            avg_amount = sum(amounts) / len(amounts)
            max_amount = max(amounts)
            amount_deviation = (amount - avg_amount) / max(avg_amount, 1.0)
            
            if amount > avg_amount * 20 and amount >= 5000:
                amount_score = 25.0
                reasons.append(f"Amount 20x above user historical average (Rs.{amount:,.0f} vs avg Rs.{avg_amount:,.0f})")
            elif amount > avg_amount * 10 and amount >= 5000:
                amount_score = 20.0
                reasons.append(f"Amount 10x above user historical average (Rs.{amount:,.0f} vs avg Rs.{avg_amount:,.0f})")
            elif amount > avg_amount * 4 and amount >= 2500:
                amount_score = 15.0
                reasons.append(f"Amount 4x above user typical spending (Rs.{amount:,.0f} vs avg Rs.{avg_amount:,.0f})")
            elif amount > max_amount * 2 and amount >= 5000:
                amount_score = 10.0
                reasons.append("Highest single transaction amount for this account profile")
    else:
        # New or unprofiled account
        if amount >= 100000:
            amount_score = 25.0
            reasons.append("Large unverified transfer (Rs.1,00,000+) on new account profile")
        elif amount >= 50000:
            amount_score = 18.0
            reasons.append("Substantial transfer (Rs.50,000+) requiring stepped verification")
        elif amount >= 10000:
            amount_score = 10.0

    risk_score += amount_score

    # =========================================================================
    # LAYER 3: VELOCITY & TRANSACTION FREQUENCY (0 - 20 points max)
    # =========================================================================
    velocity_score = 0.0
    velocity_anomaly = False
    now = datetime.now()
    recent_txns = 0
    if user_history:
        for tx in user_history:
            ts_val = tx.get("timestamp")
            if ts_val:
                try:
                    if isinstance(ts_val, str):
                        clean_ts = ts_val.split(".")[0].replace("Z", "")
                        dt = datetime.fromisoformat(clean_ts)
                    elif isinstance(ts_val, datetime):
                        dt = ts_val
                    else:
                        continue
                    if (now - dt).total_seconds() < 300: # past 5 minutes
                        recent_txns += 1
                except Exception:
                    pass

    if recent_txns >= 4:
        velocity_score = 20.0
        velocity_anomaly = True
        reasons.append("High velocity transaction burst (4+ transfers in 5 minutes)")
    elif recent_txns >= 2:
        velocity_score = 15.0
        velocity_anomaly = True
        reasons.append("Rapid consecutive transactions detected within 5 minutes")

    risk_score += velocity_score

    # =========================================================================
    # LAYER 4: LOCATION & IMPOSSIBLE TRAVEL SPEED (0 - 20 points max)
    # =========================================================================
    location_score = 0.0
    if any(country.lower() in location.lower() for country in HIGH_RISK_COUNTRIES):
        location_score += 20.0
        reasons.append(f"High-risk geographic origin: {location}")
    
    if user_history and len(user_history) > 0:
        last_tx = user_history[0]
        last_location = str(last_tx.get("location", ""))
        if last_location and last_location.lower() != location.lower() and location_score == 0:
            location_score += 10.0
            reasons.append(f"Location mismatch from previous session ({location} vs {last_location})")
            
        if gps_coordinates and gps_coordinates != "0.0, 0.0":
            last_gps = str(last_tx.get("gps_coordinates", "0.0, 0.0"))
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
                        time_diff_hours = max((now - last_time).total_seconds() / 3600.0, 0.01)
                    
                    if dist > 500 and time_diff_hours < 1.0:
                        location_score = max(location_score, 20.0)
                        reasons.append(f"Impossible travel velocity: {dist:.0f}km in under {time_diff_hours:.1f}h")
                except Exception as e:
                    print(f"Error calculating travel distance: {e}")

    risk_score += min(location_score, 20.0)

    # =========================================================================
    # LAYER 5: RECIPIENT RISK & ACCOUNT DRAINING (0 - 25 points max)
    # =========================================================================
    recipient_score = 0.0
    rec_risk = calculate_recipient_risk(nameDest)
    if rec_risk >= 15:
        recipient_score += 20.0
        reasons.append(f"High-risk flagged beneficiary entity ({nameDest})")
    elif rec_risk > 0:
        recipient_score += 8.0
        reasons.append(f"Merchant/Beneficiary category risk factor ({nameDest})")

    if oldbalanceOrg > 0 and amount > oldbalanceOrg * 0.75 and amount >= 5000:
        recipient_score += 15.0
        reasons.append(f"Severe balance depletion: transfer drains {(amount/oldbalanceOrg)*100:.0f}% of total balance")

    risk_score += min(recipient_score, 25.0)

    # =========================================================================
    # LAYER 6: DEVICE SECURITY ANOMALY (0 - 15 points max)
    # =========================================================================
    device_score = 0.0
    if user_history and len(user_history) > 0:
        known_devices = set(tx.get("device_id") for tx in user_history if tx.get("device_id"))
        if device_id not in known_devices and device_id != "Unknown":
            if amount >= 5000:
                device_score = 15.0
                reasons.append(f"Unrecognized device ({device_id}) executing substantial transfer")
            else:
                device_score = 5.0
    elif any(susp in device_id.upper() for susp in ["SUSPICIOUS", "DEV_NEW", "EMULATOR_UNKNOWN"]):
        device_score = 12.0
        reasons.append("Unverified or emulation device footprint detected")

    risk_score += device_score

    # =========================================================================
    # LAYER 7: TIME ANOMALY (0 - 5 points max)
    # =========================================================================
    time_score = 0.0
    if current_hour >= 2 and current_hour <= 5 and amount >= 10000:
        time_score = 5.0
        reasons.append(f"Off-peak transfer hour window ({current_hour:02d}:00)")

    risk_score += time_score

    # Multi-factor threat synergy: If 3 or more distinct major risk components are active
    active_threat_layers = sum(1 for s in [amount_score >= 15, velocity_score >= 15, location_score >= 15, recipient_score >= 15, device_score >= 10] if s)
    if active_threat_layers >= 3:
        risk_score += 15.0
        reasons.append(f"Multi-vector threat synergy ({active_threat_layers} high-severity anomaly vectors simultaneously active)")

    # =========================================================================
    # FUSED SCORE & DECISION THRESHOLDS
    # =========================================================================
    final_score = int(round(min(max(risk_score, 0.0), 100.0)))
    
    if final_score <= 40:
        level = "SAFE"
        decision = "ACCEPT"
        if not reasons:
            reasons.append("All risk parameters and behavioral metrics within normal range")
    elif final_score <= 80:
        level = "SUSPICIOUS"
        decision = "REVIEW"
    else:
        level = "FRAUD"
        decision = "BLOCK"

    transaction_id = f"TXN-{uuid.uuid4().hex[:8].upper()}"

    return {
        "risk_score": final_score,
        "level": level,
        "decision": decision,
        "reasons": reasons,
        "transaction_id": transaction_id,
        "is_new_user": is_new_user,
        "amount_deviation": round(amount_deviation, 2),
        "velocity_anomaly": velocity_anomaly,
        "ml_probability": round(prob, 4),
        "feature_coverage": round(feature_coverage, 2),
        "breakdown": {
            "ml_score": round(ml_score, 1),
            "amount_score": round(amount_score, 1),
            "velocity_score": round(velocity_score, 1),
            "location_score": round(min(location_score, 15.0), 1),
            "recipient_score": round(min(recipient_score, 15.0), 1),
            "device_score": round(device_score, 1),
            "time_score": round(time_score, 1)
        }
    }
