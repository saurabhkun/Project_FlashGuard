import requests
import time
import random
import sys

# Direct IP
URL = "http://127.0.0.1:8000/predict"

# --- NEW: USER POOL FOR BEHAVIORAL TESTING ---
# We use these IDs repeatedly to trigger "High Velocity" alerts
TEST_USER_POOL = ["C999888777", "C555444333", "C111222333"]

def generate_realistic_id():
    """Generates PaySim style IDs like C123456789"""
    return f"C{random.randint(100000000, 999999999)}"

def run_streamer():
    print("🚀 FlashGuard Behavioral Simulation: STARTING...")
    print(f"📡 Target API: {URL}")
    print("💡 Note: Repeating User IDs to trigger Behavioral Model B")
    print("-" * 60)

    while True:
        # 1. Decide if we use a repeat user (70% chance) or a new user (30% chance)
        if random.random() < 0.7:
            user_id = random.choice(TEST_USER_POOL)
        else:
            user_id = generate_realistic_id()

        # 2. Generate Data
        amt = random.choice([450.0, 1200.0, 3500.0, 52000.0, 89000.0])
        start_bal = random.uniform(100000.0, 500000.0)
        loc = random.choice(["Mumbai", "Delhi", "Bangalore", "Kolkata", "Remote IP"])

        sample_data = {
            "nameOrig": user_id,
            "nameDest": generate_realistic_id(),
            "type": random.choice(['PAYMENT', 'TRANSFER', 'CASH_OUT']),
            "amount": round(amt, 2),
            "oldbalanceOrg": round(start_bal, 2),
            "newbalanceOrig": round(start_bal - amt, 2),
            "oldbalanceDest": 5000.0,
            "newbalanceDest": 5000.0 + amt,
            "location": loc,
            "device_id": f"ID-{random.randint(1000, 9999)}",
            "gps_coords": f"{random.uniform(12.0, 28.0):.4f}, {random.uniform(72.0, 85.0):.4f}"
        }

        try:
            # 3. Send to Backend
            response = requests.post(URL, json=sample_data, timeout=5)
            
            if response.status_code == 200:
                result = response.json()
                status = result.get('status', 'UNKNOWN')
                insight = result.get('behavioral_insight', 'Analyzing...')
                h_count = result.get('history_count', 0)
                
                icon = "🚨" if status == "BLOCKED" else "✅"
                
                # 4. ENHANCED PRINT: Shows the history and the behavioral verdict
                print(f"{icon} User: {user_id} | Hist: {h_count} | Status: {status:<8} | Insight: {insight}")
            else:
                print(f"⚠️ Server Error: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Connection Failed: {e}")

        # Wait 2 seconds for readability
        time.sleep(2)

if __name__ == "__main__":
    try:
        run_streamer()
    except KeyboardInterrupt:
        print("\n🛑 Streamer stopped by user.")
        sys.exit()