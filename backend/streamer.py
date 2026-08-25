import os
import sys
import random
import requests
import time
import pandas as pd
import numpy as np

# Reconfigure stdout to utf-8
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

API_URL = "http://127.0.0.1:8000/predict"
LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "London", "New York", "San Francisco", "Tokyo", "Russia", "Singapore"]
TYPES = ["TRANSFER", "PAYMENT", "CASH_OUT", "DEBIT"]

# Candidate CSV paths
CANDIDATE_PATHS = [
    r"D:\Hackathon\DataSet.csv",
    os.path.join("..", "data", "paysim.csv"),
    os.path.join("..", "data", "processed_paysim.csv"),
    os.path.join("data", "paysim.csv")
]

df = None
active_csv_path = None

for path in CANDIDATE_PATHS:
    if os.path.exists(path):
        try:
            df = pd.read_csv(path, nrows=50000)
            active_csv_path = path
            print(f"[OK] Loaded dataset from: {active_csv_path} ({len(df)} rows)")
            break
        except Exception as e:
            print(f"[WARN] Error reading {path}: {e}")

if df is None:
    print("[INFO] No local CSV dataset found. Streamer will use dynamic transaction generator.")

def sanitize_value(v):
    if pd.isna(v) or v is None:
        return 0.0
    if isinstance(v, (np.integer, int, bool)):
        return int(v)
    if isinstance(v, (np.floating, float)):
        return float(v) if not np.isnan(v) and not np.isinf(v) else 0.0
    return str(v)

def generate_transaction():
    if df is not None:
        raw_row = df.sample(1).iloc[0].to_dict()
        row = {k: sanitize_value(v) for k, v in raw_row.items()}
        
        # If dataset is DataSet.csv format (with F3924)
        if "F3924" in row:
            # 15% chance to force a fraud sample row for demo
            if random.random() < 0.15:
                fraud_rows = df[df["F3924"] == 1]
                if not fraud_rows.empty:
                    raw_row = fraud_rows.sample(1).iloc[0].to_dict()
                    row = {k: sanitize_value(v) for k, v in raw_row.items()}
            
            payload = dict(row)
            payload["step"] = int(row.get("step", 1))
            payload["amount"] = float(row.get("amount", random.randint(500, 50000)))
            payload["type"] = str(row.get("type", random.choice(TYPES)))
            payload["nameOrig"] = f"USER_{random.randint(100, 999)}"
            payload["oldbalanceOrg"] = float(row.get("oldbalanceOrg", 50000.0))
            payload["newbalanceOrig"] = float(row.get("newbalanceOrig", 40000.0))
            payload["nameDest"] = f"DEST_{random.randint(100, 999)}"
            payload["oldbalanceDest"] = float(row.get("oldbalanceDest", 0.0))
            payload["newbalanceDest"] = float(row.get("newbalanceDest", 10000.0))
            payload["location"] = random.choice(LOCATIONS)
            payload["is_fraud_label"] = int(row.get("F3924", 0))
            return payload
        else:
            # Standard PaySim format
            return {
                "step": int(row.get("step", 1)),
                "type": str(row.get("type", random.choice(TYPES))),
                "amount": round(float(row.get("amount", random.randint(500, 25000))), 2),
                "nameOrig": str(row.get("nameOrig", f"USER_{random.randint(100, 999)}")),
                "oldbalanceOrg": float(row.get("oldbalanceOrg", 50000)),
                "newbalanceOrig": float(row.get("newbalanceOrig", 40000)),
                "nameDest": str(row.get("nameDest", f"DEST_{random.randint(100, 999)}")),
                "oldbalanceDest": float(row.get("oldbalanceDest", 0)),
                "newbalanceDest": float(row.get("newbalanceDest", 10000)),
                "location": random.choice(LOCATIONS),
                "device_id": f"D-{random.randint(100, 999)}",
                "gps_coords": "19.07, 72.87",
                "is_fraud_label": int(row.get("isFraud", row.get("isfraud", 0)))
            }

    # Dynamic fallback generator if no CSV available
    is_fraud = 1 if random.random() < 0.15 else 0
    amount = random.randint(50000, 250000) if is_fraud else random.randint(200, 15000)
    location = random.choice(["Russia", "Romania", "Iran"]) if is_fraud else random.choice(LOCATIONS[:5])
    txn_type = random.choice(["TRANSFER", "CASH_OUT"]) if is_fraud else random.choice(TYPES)
    
    return {
        "step": 1,
        "type": txn_type,
        "amount": float(amount),
        "nameOrig": f"USER_{random.randint(1000, 9999)}",
        "oldbalanceOrg": float(amount + 5000 if is_fraud else 50000),
        "newbalanceOrig": 0.0 if is_fraud else float(50000 - amount),
        "nameDest": f"DEST_{random.randint(1000, 9999)}",
        "oldbalanceDest": 0.0,
        "newbalanceDest": float(amount),
        "location": location,
        "device_id": f"DEV_{random.randint(100, 999)}",
        "gps_coords": "19.0760, 72.8777",
        "is_fraud_label": is_fraud
    }

def start_streaming():
    print("[STREAM] FlashGuard Live Streamer Started! (Press Ctrl+C to stop)")
    counter = 0
    while True:
        counter += 1
        txn = generate_transaction()
        try:
            response = requests.post(API_URL, json=txn, timeout=5)
            if response.status_code == 200:
                res_data = response.json()
                print(f"[{counter}] [OK] Txn: {txn['nameOrig']} -> {txn['nameDest']} | ₹{txn['amount']:.2f} | Location: {txn['location']} | Risk: {res_data.get('risk_score')}% ({res_data.get('level')}) -> Decision: {res_data.get('decision')}")
            else:
                print(f"[{counter}] [ERROR] Server Status {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[{counter}] [ERROR] Connection Error: {e}")
        
        time.sleep(2)

if __name__ == "__main__":
    start_streaming()