import os
import sys
import json
import joblib
import hashlib
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def run_verification():
    print("==================================================")
    print("FRAUDGUARD PRO - FINAL VERIFICATION SUITE")
    print("==================================================")
    
    passed_checks = 0
    total_checks = 9
    
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(backend_dir, "fraudguard_model.pkl")
    meta_path = os.path.join(backend_dir, "model_metadata.json")
    freeze_path = os.path.join(backend_dir, "MODEL_FREEZE.md")
    
    # 1. Model file exists
    if os.path.exists(model_path):
        print("[PASS] Check 1: Model file exists (fraudguard_model.pkl)")
        passed_checks += 1
    else:
        print("[FAIL] Check 1: Model file missing")
        
    # 2. Metadata exists
    if os.path.exists(meta_path):
        print("[PASS] Check 2: Metadata file exists (model_metadata.json)")
        passed_checks += 1
    else:
        print("[FAIL] Check 2: Metadata file missing")
        
    # 3. Model loads successfully
    bundle = None
    try:
        bundle = joblib.load(model_path)
        print("[PASS] Check 3: Model bundle loaded successfully via joblib")
        passed_checks += 1
    except Exception as e:
        print(f"[FAIL] Check 3: Model bundle load error: {e}")
        
    # 4. Model type is correct
    model_obj = bundle.get("model") if isinstance(bundle, dict) else bundle
    model_type = type(model_obj).__name__
    if model_type == "HistGradientBoostingClassifier":
        print(f"[PASS] Check 4: Model architecture verified ({model_type})")
        passed_checks += 1
    else:
        print(f"[FAIL] Check 4: Unexpected model architecture ({model_type})")
        
    # 5. Exactly 100 features exist & F3912 is excluded
    features = bundle.get("selected_features", []) if isinstance(bundle, dict) else []
    f3912_present = "F3912" in features
    if len(features) == 100 and not f3912_present:
        print("[PASS] Check 5: Exactly 100 features verified (F3912 excluded)")
        passed_checks += 1
    else:
        print(f"[FAIL] Check 5: Feature count={len(features)}, F3912 present={f3912_present}")
        
    # 6. Health endpoint verification
    try:
        from main import app
        from fastapi.testclient import TestClient
        client = TestClient(app)
        res = client.get("/health")
        if res.status_code == 200 and res.json().get("model") == "FraudGuard":
            print("[PASS] Check 6: FastAPI /health endpoint returned 200 OK and FraudGuard model status")
            passed_checks += 1
        else:
            print(f"[FAIL] Check 6: Health endpoint returned invalid response: {res.status_code}")
    except Exception as e:
        print(f"[FAIL] Check 6: Health endpoint test error: {e}")
        
    # 7. Predict endpoint verification
    try:
        payload = {
            "step": 1,
            "type": "PAYMENT",
            "amount": 500.0,
            "nameOrig": "C_TEST_001",
            "oldbalanceOrg": 5000.0,
            "newbalanceOrig": 4500.0,
            "nameDest": "M_TEST_001",
            "oldbalanceDest": 0.0,
            "newbalanceDest": 0.0,
            "location": "Mumbai, India",
            "ip_address": "192.168.1.1",
            "device_id": "DEV123",
            "gps_coordinates": "19.0760, 72.8777"
        }
        res = client.post("/predict", json=payload)
        if res.status_code == 200 and "risk_score" in res.json():
            data = res.json()
            score = data["risk_score"]
            decision = data["decision"]
            print(f"[PASS] Check 7: /predict endpoint working (Risk Score: {score}, Decision: {decision})")
            passed_checks += 1
        else:
            print(f"[FAIL] Check 7: /predict endpoint error ({res.status_code})")
    except Exception as e:
        print(f"[FAIL] Check 7: Predict test error: {e}")
        
    # 8. Legacy PaySim model is not loaded in active inference
    try:
        from predict import fraud_adapter
        if fraud_adapter.model_version == "fraudguard-dataset-v1":
            print("[PASS] Check 8: Active inference uses FraudGuard model (fraudguard-dataset-v1)")
            passed_checks += 1
        else:
            print(f"[FAIL] Check 8: Active inference using unexpected version: {fraud_adapter.model_version}")
    except Exception as e:
        print(f"[FAIL] Check 8: Active inference check error: {e}")
        
    # 9. SHA256 Hash matches MODEL_FREEZE.md
    try:
        with open(model_path, "rb") as f:
            actual_hash = hashlib.sha256(f.read()).hexdigest()
            
        freeze_hash = None
        if os.path.exists(freeze_path):
            with open(freeze_path, "r", encoding="utf-8") as f:
                for line in f:
                    if "SHA256 Hash" in line:
                        freeze_hash = line.split(":")[-1].strip().replace("`", "")
                        break
                        
        if actual_hash == freeze_hash:
            short_hash = actual_hash[:16]
            print(f"[PASS] Check 9: SHA256 model hash matched MODEL_FREEZE.md ({short_hash}...)")
            passed_checks += 1
        else:
            print(f"[FAIL] Check 9: SHA256 mismatch! Actual: {actual_hash}, Freeze: {freeze_hash}")
    except Exception as e:
        print(f"[FAIL] Check 9: Hash check error: {e}")
        
    print("==================================================")
    print(f"TOTAL RESULT: {passed_checks}/{total_checks} CHECKS PASSED")
    print("==================================================")
    
    return passed_checks == total_checks

if __name__ == "__main__":
    success = run_verification()
    sys.exit(0 if success else 1)

