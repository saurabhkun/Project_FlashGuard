import pickle
import os
import numpy as np
import pandas as pd

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