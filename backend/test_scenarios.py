import os
import sys
import json
from datetime import datetime

# Setup path to backend
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from predict import calculate_risk_score, make_decision, fraud_adapter

def test_scenario_1_normal_500():
    """TEST 1: Rs.500 normal transaction (same device, normal location, normal recipient)"""
    payload = {
        "step": 1,
        "type": "PAYMENT",
        "amount": 500.0,
        "nameOrig": "USER_NORM_001",
        "oldbalanceOrg": 10000.0,
        "newbalanceOrig": 9500.0,
        "nameDest": "MERCHANT_COFFEE",
        "oldbalanceDest": 0.0,
        "newbalanceDest": 500.0,
        "location": "Mumbai, India",
        "ip_address": "192.168.1.50",
        "device_id": "DEV_USER_001",
        "gps_coordinates": "19.0760, 72.8777"
    }
    
    result = calculate_risk_score(payload)
    print(f"\n[TEST 1] Rs.500 Normal Txn -> Score: {result['risk_score']}, Level: {result['level']}, Decision: {result['decision']}")
    
    assert result['risk_score'] <= 30, f"Expected risk_score <= 30 for Rs.500 normal txn, got {result['risk_score']}"
    assert result['level'] == 'SAFE', f"Expected level SAFE, got {result['level']}"
    assert result['decision'] == 'ACCEPT', f"Expected decision ACCEPT, got {result['decision']}"

def test_scenario_2_normal_1000():
    """TEST 2: Rs.1,000 normal transaction (same device/location)"""
    payload = {
        "step": 1,
        "type": "PAYMENT",
        "amount": 1000.0,
        "nameOrig": "USER_NORM_001",
        "oldbalanceOrg": 9500.0,
        "newbalanceOrig": 8500.0,
        "nameDest": "STORE_GROCERY",
        "oldbalanceDest": 1000.0,
        "newbalanceDest": 2000.0,
        "location": "Mumbai, India",
        "ip_address": "192.168.1.50",
        "device_id": "DEV_USER_001",
        "gps_coordinates": "19.0760, 72.8777"
    }
    
    result = calculate_risk_score(payload)
    print(f"\n[TEST 2] Rs.1000 Normal Txn -> Score: {result['risk_score']}, Level: {result['level']}, Decision: {result['decision']}")
    
    assert result['risk_score'] <= 30, f"Expected risk_score <= 30 for Rs.1000 normal txn, got {result['risk_score']}"
    assert result['level'] == 'SAFE', f"Expected level SAFE, got {result['level']}"
    assert result['decision'] == 'ACCEPT', f"Expected decision ACCEPT, got {result['decision']}"

def test_scenario_3_legit_5000():
    """TEST 3: Rs.5,000 transaction (slightly unusual but legitimate)"""
    payload = {
        "step": 1,
        "type": "TRANSFER",
        "amount": 5000.0,
        "nameOrig": "USER_NORM_002",
        "oldbalanceOrg": 50000.0,
        "newbalanceOrig": 45000.0,
        "nameDest": "FRIEND_UPI",
        "oldbalanceDest": 2000.0,
        "newbalanceDest": 7000.0,
        "location": "Pune, India",
        "ip_address": "192.168.1.88",
        "device_id": "DEV_USER_002",
        "gps_coordinates": "18.5204, 73.8567"
    }
    
    result = calculate_risk_score(payload)
    print(f"\n[TEST 3] Rs.5000 Txn -> Score: {result['risk_score']}, Level: {result['level']}, Decision: {result['decision']}")
    
    assert result['risk_score'] <= 70, f"Expected risk_score <= 70 for Rs.5000 txn, got {result['risk_score']}"
    assert result['level'] in ['SAFE', 'SUSPICIOUS'], f"Expected level SAFE or SUSPICIOUS, got {result['level']}"

def test_scenario_4_unusual_50000():
    """TEST 4: Rs.50,000 transaction (unusual amount, new recipient)"""
    payload = {
        "step": 1,
        "type": "TRANSFER",
        "amount": 50000.0,
        "nameOrig": "USER_NORM_003",
        "oldbalanceOrg": 60000.0,
        "newbalanceOrig": 10000.0,
        "nameDest": "UNKNOWN_ACCOUNT_99",
        "oldbalanceDest": 0.0,
        "newbalanceDest": 50000.0,
        "location": "Delhi, India",
        "ip_address": "10.0.0.45",
        "device_id": "DEV_NEW_999",
        "gps_coordinates": "28.6139, 77.2090"
    }
    
    result = calculate_risk_score(payload)
    print(f"\n[TEST 4] Rs.50000 Txn -> Score: {result['risk_score']}, Level: {result['level']}, Decision: {result['decision']}")
    
    assert result['risk_score'] >= 31, f"Expected risk_score >= 31 for Rs.50000 unusual txn, got {result['risk_score']}"
    assert result['level'] in ['SUSPICIOUS', 'HIGH', 'FRAUD'], f"Expected SUSPICIOUS or FRAUD level, got {result['level']}"

def test_scenario_5_fraud_100000():
    """TEST 5: Rs.100,000 transaction (new device, unusual location, rapid transfers, suspicious recipient)"""
    payload = {
        "step": 1,
        "type": "TRANSFER",
        "amount": 100000.0,
        "nameOrig": "USER_VICTIM_001",
        "oldbalanceOrg": 105000.0,
        "newbalanceOrig": 5000.0,
        "nameDest": "M999_MULE_ACCOUNT",
        "oldbalanceDest": 0.0,
        "newbalanceDest": 100000.0,
        "location": "High Risk Region",
        "ip_address": "185.220.101.5",
        "device_id": "SUSPICIOUS_UNKNOWN_DEVICE",
        "gps_coordinates": "0.0, 0.0"
    }
    
    # Simulate high velocity history for victim
    history = [
        {"timestamp": datetime.now().isoformat(), "amount": 100000, "location": "High Risk Region"},
        {"timestamp": datetime.now().isoformat(), "amount": 100000, "location": "High Risk Region"}
    ]
    
    result = calculate_risk_score(payload, user_history=history)
    print(f"\n[TEST 5] Rs.100000 Fraud Txn -> Score: {result['risk_score']}, Level: {result['level']}, Decision: {result['decision']}")
    
    assert result['risk_score'] >= 71, f"Expected risk_score >= 71 for Rs.100000 fraud txn, got {result['risk_score']}"
    assert result['level'] == 'FRAUD', f"Expected level FRAUD, got {result['level']}"
    assert result['decision'] == 'BLOCK', f"Expected decision BLOCK, got {result['decision']}"

def run_all_scenarios():
    print("==================================================")
    print("?? RUNNING REALISTIC TRANSACTION SCENARIO SUITE")
    print("==================================================")
    
    test_scenario_1_normal_500()
    test_scenario_2_normal_1000()
    test_scenario_3_legit_5000()
    test_scenario_4_unusual_50000()
    test_scenario_5_fraud_100000()
    
    print("\n==================================================")
    print("? ALL 5 REALISTIC TRANSACTION SCENARIOS PASSED!")
    print("==================================================")

if __name__ == "__main__":
    run_all_scenarios()
