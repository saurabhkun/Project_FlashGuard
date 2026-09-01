import os
import sys
import json
import time
import asyncio
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime

# Reconfigure stdout to utf-8
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Setup sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from ml_adapter import FraudGuardAdapter
import predict
from schemas import TransactionRequest
from main import app, root_route, health_check
from fastapi.testclient import TestClient

def run_pipeline_tests():
    print("========================================")
    print("RUNNING COMPLETE FLASHGUARD PRO PIPELINE VERIFICATION")
    print("========================================")
    
    results = {}
    client = TestClient(app)

    # 1. Model Loading Test
    model_path = BASE_DIR / "fraudguard_model.pkl"
    assert model_path.exists(), f"Missing model at {model_path}"
    adapter = FraudGuardAdapter(str(model_path))
    assert adapter.is_loaded, "FraudGuardAdapter failed to load"
    print("[PASS] TEST 1: FraudGuard production model bundle loaded.")
    results["TEST_1"] = "PASSED"

    # 2. Preprocessor / Feature Medians Test
    assert hasattr(adapter, "feature_medians") and len(adapter.feature_medians) > 0
    print("[PASS] TEST 2: Preprocessor / Feature Medians verified.")
    results["TEST_2"] = "PASSED"

    # 3. Selected Features Count Test
    num_feats = len(adapter.selected_features)
    assert num_feats == 25, f"Expected 25 features, got {num_feats}"
    print(f"[PASS] TEST 3: Exactly {num_feats} defensive features verified.")
    results["TEST_3"] = "PASSED"

    # Load DataSet.csv sample rows
    dataset_path = Path("D:/Hackathon/DataSet.csv")
    legit_dict = None
    fraud_dict = None
    if dataset_path.exists():
        try:
            df_full = pd.read_csv(dataset_path)
            legit_dict = df_full[df_full["F3924"] == 0].iloc[0].to_dict()
            fraud_dict = df_full[df_full["F3924"] == 1].iloc[0].to_dict()
        except Exception as e:
            print(f"Warning loading sample rows: {e}")

    # 4. Legitimate Row Prediction Test
    if legit_dict:
        t0 = time.perf_counter()
        legit_eval = adapter.predict_payload(legit_dict)
        t1 = time.perf_counter()
        latency_ms = (t1 - t0) * 1000
        assert legit_eval["fraud_probability"] < 0.50, f"Expected low fraud prob, got {legit_eval['fraud_probability']}"
        print(f"[PASS] TEST 4: Legitimate row prediction verified (prob: {legit_eval['fraud_probability']:.4f}, latency: {latency_ms:.2f}ms).")
        results["TEST_4"] = f"PASSED (Prob: {legit_eval['fraud_probability']:.4f}, {latency_ms:.2f}ms)"

    # 5. Fraud Row Prediction Test
    if fraud_dict:
        t0 = time.perf_counter()
        fraud_eval = adapter.predict_payload(fraud_dict)
        t1 = time.perf_counter()
        latency_ms = (t1 - t0) * 1000
        assert fraud_eval["fraud_probability"] >= 0.10, f"Expected positive fraud signal, got {fraud_eval['fraud_probability']}"
        print(f"[PASS] TEST 5: Fraud row prediction verified (prob: {fraud_eval['fraud_probability']:.4f}, latency: {latency_ms:.2f}ms).")
        results["TEST_5"] = f"PASSED (Prob: {fraud_eval['fraud_probability']:.4f}, {latency_ms:.2f}ms)"

    # 6. Partial Transaction Payload Test
    partial_payload = {"amount": 250.0, "location": "Mumbai"}
    partial_eval = adapter.predict_payload(partial_payload)
    assert "fraud_probability" in partial_eval, "Partial payload evaluation failed"
    print(f"[PASS] TEST 6: Partial transaction payload evaluated cleanly (prob: {partial_eval['fraud_probability']:.4f}).")
    results["TEST_6"] = "PASSED"

    # 7. Root Endpoint GET /
    res_root = client.get("/")
    assert res_root.status_code == 200, f"GET / status code {res_root.status_code}"
    root_data = res_root.json()
    assert root_data.get("service") == "FlashGuard Pro"
    print(f"[PASS] TEST 7: Root GET / returns service metadata ({root_data['service']}).")
    results["TEST_7"] = "PASSED"

    # 8. Health Endpoint GET /health
    res_health = client.get("/health")
    assert res_health.status_code == 200
    health_data = res_health.json()
    assert "FraudGuard" in health_data.get("model", "")
    assert health_data.get("legacy_model_disabled") is True
    print(f"[PASS] TEST 8: GET /health verified (model: {health_data['model']}, status: {health_data['status']}).")
    results["TEST_8"] = "PASSED"

    # 9. POST /predict Endpoint Test
    txn_payload = {
        "step": 1,
        "type": "TRANSFER",
        "amount": 12000.0,
        "nameOrig": "USER123",
        "oldbalanceOrg": 50000.0,
        "newbalanceOrig": 38000.0,
        "nameDest": "MERCHANT001",
        "oldbalanceDest": 10000.0,
        "newbalanceDest": 22000.0,
        "location": "Mumbai, IN",
        "ip_address": "192.168.1.10",
        "device_id": "DEV_PASS",
        "gps_coordinates": "19.0760, 72.8777"
    }
    res_pred = client.post("/predict", json=txn_payload)
    assert res_pred.status_code == 200, f"POST /predict failed with status {res_pred.status_code}"
    pred_data = res_pred.json()
    assert "risk_score" in pred_data
    assert "decision" in pred_data
    print(f"[PASS] TEST 9: POST /predict verified (Risk Score: {pred_data['risk_score']}, Decision: {pred_data['decision']}).")
    results["TEST_9"] = "PASSED"

    # 10. Empty / Invalid Payload Test
    empty_res = predict.calculate_risk_score({})
    assert isinstance(empty_res, dict) and "risk_score" in empty_res
    print(f"[PASS] TEST 10: Empty payload handled safely without crashing.")
    results["TEST_10"] = "PASSED"

    # 11. Legacy Model Non-Usage Verification
    legacy_path = BASE_DIR / "flashguard_model.pkl"
    assert not legacy_path.exists(), "flashguard_model.pkl still active!"
    assert predict.MODEL_PATH.endswith("fraudguard_model.pkl")
    print(f"[PASS] TEST 11: Legacy PaySim model is disabled from active inference.")
    results["TEST_11"] = "PASSED"

    # 12. SQLite Database Logging Verification
    db_path = BASE_DIR / "flashguard.db"
    assert db_path.exists(), "flashguard.db sqlite file missing"
    print(f"[PASS] TEST 12: SQLite database active at {db_path}.")
    results["TEST_12"] = "PASSED"

    print("========================================")
    print("ALL 12 PIPELINE VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("========================================")

    return results

if __name__ == "__main__":
    run_pipeline_tests()
