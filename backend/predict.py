import pickle
import os
import numpy as np
import pandas as pd
import uuid
from datetime import datetime
from typing import Tuple, List, Dict
from security_engine import calculate_distance, calculate_recipient_risk

# 1. SETUP PATHS
# Since flashguard_model.pkl is in the SAME folder as this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "flashguard_model.pkl")

# 2. LOAD THE ML MODEL
def load_model():
    try:
        if not os.path.exists(MODEL_PATH):
            print(f"⚠️ Warning: Model file NOT found at {MODEL_PATH}")
            return None
        with open(MODEL_PATH, "rb") as f:
            return pickle.load(f)
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None

# Load the model once when the server starts
model = load_model()

# Store user historical data for behavioral analysis
user_transaction_history: Dict[str, List[dict]] = {}

# High-risk countries
HIGH_RISK_COUNTRIES = ['Russia', 'Nigeria', 'China', 'Romania', 'Vietnam', 'Iran', 'Syria']

# 3. THE PREDICTION BRAIN (Numerical Analysis)
def make_decision(data):
    try:
        # Prepare features exactly as the PaySim model expects
        features = {
            "amount": data.amount,
            "oldbalanceOrg": data.oldbalanceOrg,
            "newbalanceOrig": data.newbalanceOrig,
            "oldbalanceDest": data.oldbalanceDest,
            "newbalanceDest": data.newbalanceDest,
            "errorBalanceOrig": data.newbalanceOrig + data.amount - data.oldbalanceOrg,
            "type_CASH_OUT": 1 if data.type == "CASH_OUT" else 0,
            "type_DEBIT": 1 if data.type == "DEBIT" else 0,
            "type_PAYMENT": 1 if data.type == "PAYMENT" else 0,
            "type_TRANSFER": 1 if data.type == "TRANSFER" else 0
        }
        
        # Convert to DataFrame for the model
        X = pd.DataFrame([features])
        
        # Get AI Prediction (0 = Success, 1 = Fraud)
        prediction = 0
        if model is not None:
            prediction = int(model.predict(X)[0])
        
        # Business Logic Rule: Always block Remote IPs for safety
        if prediction == 1 or data.location == "Remote IP":
            status = "BLOCKED"
        else:
            status = "SUCCESS"
            
        return status, prediction

    except Exception as e:
        print(f"🚨 AI ERROR: {e}")
        # Emergency Fallback
        return ("BLOCKED", 1) if data.location == "Remote IP" else ("SUCCESS", 0)


# 4. NEW: Calculate Risk Score (0-100) with SHAP-like explanations
def calculate_risk_score(data, user_history: List[dict] = None) -> dict:
    """
    Calculate risk score from 0-100 with SHAP-like reason codes
    Level 1 (0-30): Auto accept
    Level 2 (31-70): Suspected - held for review
    Level 3 (71-100): Blocked as fraud
    """
    risk_score = 0
    reasons = []
    
    # Get current hour for time-based analysis
    current_hour = datetime.now().hour
    
    # Initialize user history if not exists
    if user_history is None:
        user_history = []
    
    is_new_user = len(user_history) == 0
    
    # ============ ML MODEL SCORE (0-40 points) ============
    try:
        features = {
            "amount": data.amount,
            "oldbalanceOrg": data.oldbalanceOrg,
            "newbalanceOrig": data.newbalanceOrig,
            "oldbalanceDest": data.oldbalanceDest,
            "newbalanceDest": data.newbalanceDest,
            "errorBalanceOrig": data.newbalanceOrig + data.amount - data.oldbalanceOrg,
            "type_CASH_OUT": 1 if data.type == "CASH_OUT" else 0,
            "type_DEBIT": 1 if data.type == "DEBIT" else 0,
            "type_PAYMENT": 1 if data.type == "PAYMENT" else 0,
            "type_TRANSFER": 1 if data.type == "TRANSFER" else 0
        }
        X = pd.DataFrame([features])
        
        if model is not None:
            ml_prediction = int(model.predict(X)[0])
            if ml_prediction == 1:
                risk_score += 40
                reasons.append("ML model flagged as fraudulent")
    except Exception as e:
        print(f"ML model error: {e}")
    
    # ============ AMOUNT DEVIATION (0-25 points) ============
    if user_history and len(user_history) > 0:
        amounts = [tx.get('amount', 0) for tx in user_history if tx.get('amount')]
        if amounts:
            avg_amount = sum(amounts) / len(amounts)
            max_amount = max(amounts)
            
            # Amount 40x above normal
            if data.amount > avg_amount * 40:
                risk_score += 25
                reasons.append(f"Amount 40× above normal (₹{data.amount:.0f} vs avg ₹{avg_amount:.0f})")
            elif data.amount > avg_amount * 10:
                risk_score += 15
                reasons.append(f"Amount 10× above user's typical transaction")
            elif data.amount > max_amount:
                risk_score += 10
                reasons.append("Highest transaction amount for this user")
            
            # Calculate deviation for response
            amount_deviation = (data.amount - avg_amount) / avg_amount if avg_amount > 0 else 0
    else:
        # New user - check against global defaults
        if data.amount > 50000:
            risk_score += 20
            reasons.append("High amount for new user")
        amount_deviation = 0
    
    # ============ VELOCITY CHECK (0-15 points) ============
    velocity_anomaly = False
    if len(user_history) >= 3:
        # Multiple transactions in quick succession
        risk_score += 15
        reasons.append("High velocity activity detected")
        velocity_anomaly = True
    elif len(user_history) >= 1:
        risk_score += 5
    
    # ============ LOCATION RISK (0-20 points) ============
    if any(country.lower() in data.location.lower() for country in HIGH_RISK_COUNTRIES):
        risk_score += 20
        reasons.append(f"Transaction from high-risk location: {data.location}")
    
    # Check location change (impossible travel)
    if user_history and len(user_history) > 0:
        last_tx = user_history[0]
        last_location = last_tx.get('location', '')
        if last_location and last_location != data.location:
            risk_score += 10
            reasons.append("Location mismatch from previous transaction")
            
        # TASK 1: Distance > 500km in under 1 hour
        if hasattr(data, 'gps_coordinates') and data.gps_coordinates and data.gps_coordinates != "0.0, 0.0":
            last_gps = last_tx.get('gps_coordinates', "0.0, 0.0")
            if last_gps and last_gps != "0.0, 0.0":
                try:
                    lat1, lon1 = data.gps_coordinates.split(',')
                    lat2, lon2 = last_gps.split(',')
                    dist = calculate_distance(lat1, lon1, lat2, lon2)
                    
                    time_diff_hours = 0
                    last_time_str = last_tx.get('timestamp')
                    if last_time_str:
                        if isinstance(last_time_str, str):
                            # Handle different ISO formats
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
    
    # ============ TIME ANOMALY (0-10 points) ============
    # Unusual hours (late night: 12am - 5am)
    if current_hour >= 0 and current_hour <= 5:
        risk_score += 10
        reasons.append("Transaction during unusual hours (late night)")
    
    # ============ TRANSACTION TYPE RISK (0-10 points) ============
    high_risk_types = ['TRANSFER', 'CASH_OUT']
    if data.type in high_risk_types:
        risk_score += 10
        reasons.append(f"High-risk transaction type: {data.type}")
    
    # ============ BALANCE ANOMALY (0-10 points) ============
    if data.oldbalanceOrg > 0 and data.amount > data.oldbalanceOrg * 0.9:
        risk_score += 10
        reasons.append("Draining most of account balance")
        
    # ============ TASK 2: RECIPIENT RISK FACTOR ============
    recipient_risk = calculate_recipient_risk(data.nameDest)
    if recipient_risk > 0:
        risk_score += recipient_risk
        reasons.append(f"High risk recipient metadata (Risk Factor: +{recipient_risk})")
    
    # Cap risk score at 100
    risk_score = min(risk_score, 100)
    
    # Determine level and decision
    if risk_score <= 30:
        level = "LOW"
        decision = "ACCEPT"
    elif risk_score <= 70:
        level = "MEDIUM"
        decision = "REVIEW"
    else:
        level = "HIGH"
        decision = "BLOCK"
    
    # Generate transaction ID
    transaction_id = f"TXN-{uuid.uuid4().hex[:8].upper()}"
    
    return {
        "risk_score": risk_score,
        "level": level,
        "decision": decision,
        "reasons": reasons if reasons else ["All parameters within normal range"],
        "transaction_id": transaction_id,
        "is_new_user": is_new_user,
        "amount_deviation": amount_deviation if 'amount_deviation' in dir() else 0,
        "velocity_anomaly": velocity_anomaly
    }


# 5. Store transaction in history
def store_transaction(user_id: str, transaction_data: dict):
    """Store transaction in user history for behavioral learning"""
    if user_id not in user_transaction_history:
        user_transaction_history[user_id] = []
    user_transaction_history[user_id].append(transaction_data)
    # Keep only last 100 transactions per user
    user_transaction_history[user_id] = user_transaction_history[user_id][-100:]


# 6. Get user history
def get_user_history(user_id: str) -> List[dict]:
    """Get user's transaction history"""
    return user_transaction_history.get(user_id, [])


# 7. Get all transactions for dashboard
def get_all_transactions() -> List[dict]:
    """Get all stored transactions"""
    all_tx = []
    for user_id, history in user_transaction_history.items():
        all_tx.extend(history)
    return sorted(all_tx, key=lambda x: x.get('timestamp', datetime.now()), reverse=True)
