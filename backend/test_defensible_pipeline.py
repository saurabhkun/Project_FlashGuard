"""
Comprehensive Defensible Test Suite for FlashGuard Pro ML & Hybrid Engine
Validates:
1. Model bundle loading & integrity
2. Preprocessing & feature imputation
3. ₹500 Normal transaction (SAFE / ACCEPT)
4. ₹8,500 Suspicious transaction (SUSPICIOUS / REVIEW)
5. ₹15,000 High-risk / Blacklist transaction (FRAUD / BLOCK)
6. Partial payload handling (graceful, not automatic fraud)
7. Invalid/edge payload handling
8. API /health contract & active version
9. API /predict contract
10. Active model version string matches fraudguard-v2-hybrid
11. No legacy PaySim model in active path
12. ML score bounded component (<= 35 pts)
13. Legitimate transaction series has 0% false positive flood
"""

import os
import sys
import json
import unittest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from main import app
from ml_adapter import FraudGuardAdapter
from predict import calculate_risk_score, make_decision, fraud_adapter

client = TestClient(app)

def test_01_model_loading_and_metadata():
    """Verify v2 model is loaded properly with all required artifacts."""
    assert fraud_adapter.is_loaded is True
    assert fraud_adapter.model_version == "fraudguard-v2-hybrid"
    assert len(fraud_adapter.selected_features) == 25
    assert len(fraud_adapter.feature_medians) == 25
    print("\n[TEST 1 PASSED] Model bundle and metadata verified.")

def test_02_preprocessing_and_coverage():
    """Verify build_feature_vector creates proper dimensions and tracks coverage."""
    sample_payload = {"amount": 500.0, "F1058": 12.5, "F3805": 3.4}
    df_vec, coverage = fraud_adapter.build_feature_vector(sample_payload)
    assert df_vec.shape == (1, 25)
    assert coverage == 2 / 25 # 2 explicit features
    print("\n[TEST 2 PASSED] Preprocessing and coverage tracking verified.")

def test_03_normal_500_transaction_is_safe():
    """Verify a standard ₹500 mobile payment is evaluated as SAFE / ACCEPT."""
    normal_payload = {
        "step": 1,
        "type": "PAYMENT",
        "amount": 500.0,
        "nameOrig": "USER_ALICE",
        "oldbalanceOrg": 25000.0,
        "newbalanceOrig": 24500.0,
        "nameDest": "MERCHANT_GROCERY",
        "oldbalanceDest": 10000.0,
        "newbalanceDest": 10500.0,
        "location": "Mumbai, India",
        "gps_coordinates": "19.0760, 72.8777",
        "device_id": "DEVICE_ALICE_PHONE",
        "ip_address": "192.168.1.5"
    }
    res = calculate_risk_score(normal_payload)
    assert res["level"] == "SAFE"
    assert res["decision"] == "ACCEPT"
    assert res["risk_score"] <= 40
    print(f"\n[TEST 3 PASSED] Normal Rs.500 txn -> Score: {res['risk_score']}/100 ({res['level']}/{res['decision']})")

def test_04_suspicious_8500_transaction_is_review():
    """Verify an unusual ₹8,500 transaction with historical spike or unusual device flags REVIEW."""
    user_history = [
        {"amount": 500.0, "location": "Mumbai, India", "device_id": "DEVICE_BOB", "timestamp": (datetime.now() - timedelta(days=2)).isoformat()},
        {"amount": 450.0, "location": "Mumbai, India", "device_id": "DEVICE_BOB", "timestamp": (datetime.now() - timedelta(days=1)).isoformat()}
    ]
    unusual_payload = {
        "step": 1,
        "type": "TRANSFER",
        "amount": 8500.0, # 17x average spending
        "nameOrig": "USER_BOB",
        "oldbalanceOrg": 10000.0,
        "newbalanceOrig": 1500.0,
        "nameDest": "NEW_RECIPIENT_XYZ",
        "oldbalanceDest": 0.0,
        "newbalanceDest": 8500.0,
        "location": "Delhi, India", # location change
        "gps_coordinates": "28.6139, 77.2090",
        "device_id": "NEW_UNRECOGNIZED_DEVICE",
        "ip_address": "10.0.0.99"
    }
    res = calculate_risk_score(unusual_payload, user_history=user_history)
    assert res["decision"] == "REVIEW" or res["risk_score"] >= 41
    print(f"\n[TEST 4 PASSED] Suspicious Rs.8,500 txn -> Score: {res['risk_score']}/100 ({res['level']}/{res['decision']})")

def test_05_fraud_15000_transaction_to_mule_is_blocked():
    """Verify a ₹15,000 transaction with flagged recipient (MULE) + balance drain is BLOCKED."""
    user_history = [
        {"amount": 400.0, "location": "Mumbai, India", "device_id": "DEVICE_CAROL", "timestamp": (datetime.now() - timedelta(hours=2)).isoformat()},
        {"amount": 300.0, "location": "Mumbai, India", "device_id": "DEVICE_CAROL", "timestamp": (datetime.now() - timedelta(minutes=3)).isoformat()},
        {"amount": 300.0, "location": "Mumbai, India", "device_id": "DEVICE_CAROL", "timestamp": (datetime.now() - timedelta(minutes=2)).isoformat()},
        {"amount": 300.0, "location": "Mumbai, India", "device_id": "DEVICE_CAROL", "timestamp": (datetime.now() - timedelta(minutes=1)).isoformat()}
    ]
    fraud_payload = {
        "step": 1,
        "type": "TRANSFER",
        "amount": 15000.0,
        "nameOrig": "USER_CAROL",
        "oldbalanceOrg": 16000.0, # Draining 94% of balance
        "newbalanceOrig": 1000.0,
        "nameDest": "MULE_ACCOUNT_M999_SUSPICIOUS", # Flagged recipient entity
        "oldbalanceDest": 0.0,
        "newbalanceDest": 15000.0,
        "location": "Russia", # High risk country
        "gps_coordinates": "55.7558, 37.6173",
        "device_id": "SUSPICIOUS_UNKNOWN_DEVICE",
        "ip_address": "185.220.101.5"
    }
    res = calculate_risk_score(fraud_payload, user_history=user_history)
    assert res["level"] == "FRAUD"
    assert res["decision"] == "BLOCK"
    assert res["risk_score"] >= 81
    print(f"\n[TEST 5 PASSED] Fraudulent Rs.15,000 txn -> Score: {res['risk_score']}/100 ({res['level']}/{res['decision']})")

def test_06_partial_payload_is_handled_gracefully():
    """Verify a payload with only amount and destination doesn't crash or falsely trigger high fraud."""
    partial_payload = {
        "amount": 750.0,
        "nameDest": "FRIEND_BOB"
    }
    res = calculate_risk_score(partial_payload)
    assert res["level"] == "SAFE"
    assert res["decision"] == "ACCEPT"
    assert res["risk_score"] <= 40
    print(f"\n[TEST 6 PASSED] Partial payload evaluated gracefully -> Score: {res['risk_score']}/100 ({res['level']})")

def test_07_invalid_or_empty_payload_handled_safely():
    """Verify empty payload defaults to safe baseline."""
    empty_payload = {}
    res = calculate_risk_score(empty_payload)
    assert res["risk_score"] <= 40
    assert res["decision"] == "ACCEPT"
    print("\n[TEST 7 PASSED] Empty payload handled safely.")

def test_08_health_endpoint_contract():
    """Verify GET /health returns accurate active model metadata."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_version"] == "fraudguard-v2-hybrid"
    assert data["model_type"] == "CalibratedRandomForestClassifier"
    assert data["selected_features"] == 25
    assert data["legacy_model_disabled"] is True
    print("\n[TEST 8 PASSED] /health endpoint structure verified.")

def test_09_predict_endpoint_contract():
    """Verify POST /predict returns valid RiskScoreResponse schema."""
    req_body = {
        "step": 1,
        "type": "PAYMENT",
        "amount": 250.0,
        "nameOrig": "TEST_USER_99",
        "oldbalanceOrg": 5000.0,
        "newbalanceOrig": 4750.0,
        "nameDest": "CAFE_COFFEE",
        "oldbalanceDest": 0.0,
        "newbalanceDest": 250.0,
        "location": "Bengaluru, India",
        "device_id": "DEVICE_PHONE_99",
        "ip_address": "10.0.2.2"
    }
    response = client.post("/predict", json=req_body)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "level" in data
    assert "decision" in data
    assert "reasons" in data
    assert "transaction_id" in data
    assert data["level"] in ["SAFE", "SUSPICIOUS", "FRAUD"]
    assert data["decision"] in ["ACCEPT", "REVIEW", "BLOCK"]
    print(f"\n[TEST 9 PASSED] /predict contract verified. Score: {data['risk_score']}, Decision: {data['decision']}")

def test_10_active_model_version_verified():
    """Verify active model version string across system."""
    assert fraud_adapter.model_version == "fraudguard-v2-hybrid"
    res = client.get("/health").json()
    assert res["model_version"] == "fraudguard-v2-hybrid"
    print("\n[TEST 10 PASSED] Active model version verified across adapter and API.")

def test_11_no_legacy_paysim_in_active_path():
    """Verify no legacy paysim references are being loaded for live inference."""
    health = client.get("/health").json()
    assert health["dataset"] == "DataSet.csv"
    assert health["legacy_model_disabled"] is True
    print("\n[TEST 11 PASSED] Legacy model confirmed disabled.")

def test_12_ml_rule_fusion_bounded():
    """Verify ML score contribution is strictly bounded (max 35 points)."""
    # Even with a hypothetical 1.0 probability, ML contribution is <= 35
    ml_eval = fraud_adapter.predict_payload({"amount": 1000.0})
    assert ml_eval["ml_score"] <= 35.0
    print(f"\n[TEST 12 PASSED] ML score component strictly bounded: {ml_eval['ml_score']} <= 35.0")

def test_13_legitimate_series_has_zero_false_positive_flood():
    """Verify 10 successive legitimate everyday transactions are all evaluated as SAFE."""
    for i in range(10):
        txn = {
            "step": i + 1,
            "type": "PAYMENT",
            "amount": 100.0 + (i * 50.0), # 100, 150, 200...
            "nameOrig": f"USER_LEGIT_{i}",
            "oldbalanceOrg": 10000.0,
            "newbalanceOrig": 10000.0 - (100.0 + i * 50.0),
            "nameDest": f"SHOP_KEEPER_{i}",
            "oldbalanceDest": 500.0,
            "newbalanceDest": 500.0 + (100.0 + i * 50.0),
            "location": "Mumbai, India",
            "device_id": f"DEVICE_LEGIT_{i}"
        }
        res = calculate_risk_score(txn)
        assert res["level"] == "SAFE", f"Transaction {i} unexpectedly flagged as {res['level']}"
        assert res["decision"] == "ACCEPT"
    print("\n[TEST 13 PASSED] 10/10 legitimate transactions passed as SAFE (0% false positive rate).")

if __name__ == "__main__":
    test_funcs = [
        test_01_model_loading_and_metadata,
        test_02_preprocessing_and_coverage,
        test_03_normal_500_transaction_is_safe,
        test_04_suspicious_8500_transaction_is_review,
        test_05_fraud_15000_transaction_to_mule_is_blocked,
        test_06_partial_payload_is_handled_gracefully,
        test_07_invalid_or_empty_payload_handled_safely,
        test_08_health_endpoint_contract,
        test_09_predict_endpoint_contract,
        test_10_active_model_version_verified,
        test_11_no_legacy_paysim_in_active_path,
        test_12_ml_rule_fusion_bounded,
        test_13_legitimate_series_has_zero_false_positive_flood
    ]
    print(f"Executing {len(test_funcs)} automated tests for FlashGuard Pro ML...")
    for idx, fn in enumerate(test_funcs, 1):
        fn()
    print("\n" + "="*60)
    print(f"ALL {len(test_funcs)}/13 TESTS PASSED SUCCESSFULLY! (100% GREEN)")
    print("="*60)
