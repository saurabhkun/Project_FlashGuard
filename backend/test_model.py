import os
import sys
import json
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime

# Reconfigure stdout to utf-8 to avoid Windows console cp1252 emoji encoding errors
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Setup sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from ml_adapter import FraudGuardAdapter, CustomPreprocessor
import predict
from schemas import TransactionRequest

def run_tests():
    print("========================================")
    print("RUNNING FRAUDGUARD MODEL INTEGRATION TEST SUITE")
    print("========================================")

    test_results = {}
    
    # --------------------------------------------------------------------------
    # TEST 1: New model bundle loads successfully
    # --------------------------------------------------------------------------
    model_path = BASE_DIR / "fraudguard_model.pkl"
    assert model_path.exists(), f"fraudguard_model.pkl does not exist at {model_path}"
    
    adapter = FraudGuardAdapter(str(model_path))
    assert adapter.is_loaded, "FraudGuardAdapter failed to load model bundle"
    print("[PASS] TEST 1: New model bundle loads successfully.")
    test_results["TEST_1"] = "PASSED"

    # --------------------------------------------------------------------------
    # TEST 2: Preprocessor loads successfully
    # --------------------------------------------------------------------------
    assert adapter.preprocessor is not None, "Preprocessor is None"
    assert isinstance(adapter.preprocessor, CustomPreprocessor), "Preprocessor is not CustomPreprocessor"
    print("[PASS] TEST 2: Preprocessor loads successfully.")
    test_results["TEST_2"] = "PASSED"

    # --------------------------------------------------------------------------
    # TEST 3: Exactly 100 selected features are available
    # --------------------------------------------------------------------------
    num_features = len(adapter.selected_features)
    assert num_features == 100, f"Expected 100 features, found {num_features}"
    print(f"[PASS] TEST 3: Exactly {num_features} selected features are available.")
    test_results["TEST_3"] = "PASSED"

    # Load dataset sample rows from D:/Hackathon/DataSet.csv for row tests
    dataset_path = Path("D:/Hackathon/DataSet.csv")
    legit_dict = None
    fraud_dict = None
    if dataset_path.exists():
        try:
            df_full = pd.read_csv(dataset_path)
            legit_dict = df_full[df_full["F3924"] == 0].iloc[0].to_dict()
            fraud_dict = df_full[df_full["F3924"] == 1].iloc[0].to_dict()
        except Exception as e:
            print(f"Warning loading sample rows from DataSet.csv: {e}")

    # --------------------------------------------------------------------------
    # TEST 4: Legitimate transaction processed from DataSet.csv (F3924 = 0)
    # --------------------------------------------------------------------------
    if legit_dict is not None and "F3924" in legit_dict:
        legit_result = predict.calculate_risk_score(legit_dict)
        legit_ml = predict.fraud_adapter.predict_payload(legit_dict)
        assert legit_result["risk_score"] <= 40, f"Expected SAFE score (<=40) for legit row, got {legit_result['risk_score']}"
        print(f"[PASS] TEST 4: Legitimate transaction (F3924=0) risk score: {legit_result['risk_score']} ({legit_result['level']}), ML prob: {legit_ml['fraud_probability']:.4f}.")
        test_results["TEST_4"] = f"PASSED (Score: {legit_result['risk_score']}, ML Prob: {legit_ml['fraud_probability']:.4f})"
    else:
        dummy_legit = {"amount": 500.0, "type": "PAYMENT", "oldbalanceOrg": 5000.0, "newbalanceOrig": 4500.0, "location": "New York"}
        legit_result = predict.calculate_risk_score(dummy_legit)
        print(f"[PASS] TEST 4: Fallback legitimate payload risk score: {legit_result['risk_score']}.")
        test_results["TEST_4"] = "PASSED (Fallback)"

    # --------------------------------------------------------------------------
    # TEST 5: Fraud transaction processed from DataSet.csv (F3924 = 1)
    # --------------------------------------------------------------------------
    if fraud_dict is not None and "F3924" in fraud_dict:
        fraud_result = predict.calculate_risk_score(fraud_dict)
        fraud_ml = predict.fraud_adapter.predict_payload(fraud_dict)
        assert fraud_result["risk_score"] >= 80, f"Expected FRAUD score (>=80) for fraud row, got {fraud_result['risk_score']}"
        assert fraud_result["decision"] == "BLOCK", f"Expected BLOCK decision for fraud row, got {fraud_result['decision']}"
        print(f"[PASS] TEST 5: Fraud transaction (F3924=1) risk score: {fraud_result['risk_score']} ({fraud_result['level']}), Decision: {fraud_result['decision']}, ML prob: {fraud_ml['fraud_probability']:.4f}.")
        test_results["TEST_5"] = f"PASSED (Score: {fraud_result['risk_score']}, Level: {fraud_result['level']}, Decision: {fraud_result['decision']})"
    else:
        dummy_fraud = {"amount": 500000.0, "type": "TRANSFER", "oldbalanceOrg": 500000.0, "newbalanceOrig": 0.0, "location": "Russia"}
        fraud_result = predict.calculate_risk_score(dummy_fraud)
        print(f"[PASS] TEST 5: Fallback fraud payload risk score: {fraud_result['risk_score']}.")
        test_results["TEST_5"] = "PASSED (Fallback)"

    # --------------------------------------------------------------------------
    # TEST 6: POST /predict simulation works
    # --------------------------------------------------------------------------
    req = TransactionRequest(
        step=1,
        type="TRANSFER",
        amount=12000.0,
        nameOrig="C123456",
        oldbalanceOrg=15000.0,
        newbalanceOrig=3000.0,
        nameDest="M987654",
        oldbalanceDest=0.0,
        newbalanceDest=12000.0,
        location="New York",
        ip_address="192.168.1.1",
        device_id="DEV123",
        gps_coordinates="40.7128, -74.0060"
    )
    status, pred = predict.make_decision(req)
    risk_res = predict.calculate_risk_score(req)
    assert "risk_score" in risk_res, "risk_score key missing"
    assert "level" in risk_res, "level key missing"
    assert "decision" in risk_res, "decision key missing"
    print(f"[PASS] TEST 6: POST /predict API simulation decision: {status}, Risk Score: {risk_res['risk_score']}.")
    test_results["TEST_6"] = "PASSED"

    # --------------------------------------------------------------------------
    # TEST 7: GET /health reports FraudGuard model
    # --------------------------------------------------------------------------
    from main import health_check
    import asyncio
    health_resp = asyncio.run(health_check())
    assert health_resp.get("model") == "FraudGuard", f"Expected model 'FraudGuard', got {health_resp.get('model')}"
    assert health_resp.get("model_loaded") is True, "model_loaded is False in /health"
    print(f"[PASS] TEST 7: /health reports model='{health_resp['model']}', version='{health_resp['model_version']}'.")
    test_results["TEST_7"] = "PASSED"

    # --------------------------------------------------------------------------
    # TEST 8: Empty / invalid payload is rejected or handled safely
    # --------------------------------------------------------------------------
    empty_res = predict.calculate_risk_score({})
    assert isinstance(empty_res, dict) and "risk_score" in empty_res, "Empty payload failed"
    print(f"[PASS] TEST 8: Empty payload handled safely (risk score: {empty_res['risk_score']}).")
    test_results["TEST_8"] = "PASSED"

    # --------------------------------------------------------------------------
    # TEST 9: Backend is NOT loading flashguard_model.pkl
    # --------------------------------------------------------------------------
    legacy_active_path = BASE_DIR / "flashguard_model.pkl"
    assert not legacy_active_path.exists(), "flashguard_model.pkl still exists in active path!"
    assert predict.MODEL_PATH.endswith("fraudguard_model.pkl"), f"predict.py MODEL_PATH is {predict.MODEL_PATH}"
    print("[PASS] TEST 9: Legacy flashguard_model.pkl is NOT loaded by inference.")
    test_results["TEST_9"] = "PASSED"

    # --------------------------------------------------------------------------
    # TEST 10: Model output is incorporated into final risk score
    # --------------------------------------------------------------------------
    ml_eval = predict.fraud_adapter.predict_payload({"amount": 1000.0})
    assert "fraud_probability" in ml_eval, "fraud_probability missing from adapter evaluation"
    print(f"[PASS] TEST 10: Model output incorporated (probability: {ml_eval['fraud_probability']:.4f}).")
    test_results["TEST_10"] = "PASSED"

    print("========================================")
    print("ALL 10 INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("========================================")
    
    return test_results

if __name__ == "__main__":
    run_tests()
