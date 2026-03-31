import pandas as pd
import os
import random
import requests
import time

# ⚙️ UPDATED CONFIGURATION (Based on your folder structure)
# Your CSV is in a folder named 'data' inside the root directory
CSV_PATH = os.path.join("..", "data", "paysim.csv")
API_URL = "http://127.0.0.1:8000/predict"
LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "London", "New York", "San Francisco", "Tokyo"]

print(f"📂 Looking for true Paysim dataset at: {os.path.abspath(CSV_PATH)}")

# 📂 LOAD DATASET
if os.path.exists(CSV_PATH):
    try:
        df = pd.read_csv(CSV_PATH, nrows=200000) # Load a chunk of true dataset for speed
        print(f"✅ True Dataset loaded! ({len(df)} rows)")
        USING_CSV = True
    except Exception as e:
        print(f"⚠️ Error reading CSV: {e}")
        USING_CSV = False
else:
    print(f"❌ true paysim.csv not found. Please check the path.")
    USING_CSV = False

def generate_transaction():
    if USING_CSV:
        # 20% probability to pick a REAL fraud row from the dataset for the demo
        if random.random() < 0.2:
            fraud_rows = df[df['isFraud'] == 1]
            row = fraud_rows.sample(1).iloc[0] if not fraud_rows.empty else df.sample(1).iloc[0]
        else:
            row = df.sample(1).iloc[0]
        
        def get_val(keys, default=0):
            for k in keys:
                if k in row: return row[k]
                for ak in row.index:
                    if k.lower() == ak.lower(): return row[ak]
            return default

        return {
            "step": int(get_val(['step'], 1)),
            "type": str(get_val(['type'], 'TRANSFER')),
            "amount": round(float(get_val(['amount'], 0)), 2),
            "nameOrig": str(get_val(['nameOrig', 'nameorig'], "UNKNOWN_SENDER")),
            "oldbalanceOrg": float(get_val(['oldbalanceOrg'], 0)),
            "newbalanceOrig": float(get_val(['newbalanceOrig'], 0)),
            "nameDest": str(get_val(['nameDest'], "UNKNOWN_RECIPIENT")),
            "oldbalanceDest": float(get_val(['oldbalanceDest'], 0)),
            "newbalanceDest": float(get_val(['newbalanceDest'], 0)),
            "location": random.choice(LOCATIONS),
            "device_id": f"D-{random.randint(100, 999)}",
            "gps_coords": "19.07, 72.87",
            "is_fraud_label": int(get_val(['isFraud', 'isfraud'], 0)) # Send the truth!
        }
        
    
def start_streaming():
    print("🚀 FlashGuard Streamer Started!")
    while True:
        txn = generate_transaction()
        if not txn:
            print("❌ No data to send.")
            break
            
        try:
            response = requests.post(API_URL, json=txn)
            if response.status_code == 200:
                res_data = response.json()
                print(f"✅ Sent: {txn['nameOrig']} | ₹{txn['amount']} | Result: {res_data.get('decision', 'OK')}")
            else:
                print(f"❌ Server Error {response.status_code}: {response.text}")
        except Exception as e:
            print(f"🔌 Connection Error: {e}")
        
        time.sleep(2)

if __name__ == "__main__":
    start_streaming()