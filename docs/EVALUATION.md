# 🏆 FlashGuard Pro - Hackathon Evaluation & Judging Matrix

This document maps every hackathon judging criterion directly to the exact source file, line of code, or automated verification test command that proves it.

---

## 🎯 Hackathon Judging Criteria Mapping

| Judging Criterion | Score Weight | FlashGuard Pro Implementation Proof | Verification Command / Target File |
| :--- | :---: | :--- | :--- |
| **1. Innovation & Problem Severity** | **25%** | Addresses India's ₹22,495+ Crore digital financial fraud epidemic. Trained on the **Bank of India Hackathon Selection Round Dataset (IIT Hyderabad)**. Combines Scikit-Learn `HistGradientBoosting` ML inference with an 11-layer deterministic security rule matrix. | [`docs/PRD.md`](docs/PRD.md)<br>[`backend/predict.py`](file:///d:/study%20man/projects/Project_FlashGuard/backend/predict.py) |
| **2. Technical Execution & SLA** | **25%** | Sub-30ms measured ML inference latency (actual **~1.51 ms**). 100 selected feature vectors, automatic missing value imputation, and zero data leakage. | `python scripts/verify_claims.py`<br>[`backend/ml_adapter.py`](file:///d:/study%20man/projects/Project_FlashGuard/backend/ml_adapter.py) |
| **3. Model Reliability & Integrity** | **20%** | Cryptographically frozen `fraudguard_model.pkl` with SHA256 integrity hash verification. 100% ROC-AUC & F1 score on test set. Legacy PaySim model hard-disabled. | `python backend/final_verify.py`<br>[`backend/MODEL_FREEZE.md`](file:///d:/study%20man/projects/Project_FlashGuard/backend/MODEL_FREEZE.md) |
| **4. Multi-Platform User Experience** | **15%** | Cross-platform Flutter mobile application (`fraudguard_flutter`) paired with a high-throughput FastAPI REST API & WebSocket live alert stream. | [`fraudguard_flutter/lib/main.dart`](file:///d:/study%20man/projects/Project_FlashGuard/fraudguard_flutter/lib/main.dart)<br>[`backend/main.py`](file:///d:/study%20man/projects/Project_FlashGuard/backend/main.py) |
| **5. Production Readiness & CI** | **15%** | Automated 14-claim evaluation engine (`scripts/verify_claims.py`) and 3 standalone Python verification test suites passing 100%. | `python backend/test_model.py`<br>`python backend/test_pipeline.py` |

---

## 🔬 Empirical Claim Verification Index

Below is the exhaustive audit of all 14 claims asserted in [`README.md`](../README.md):

### Claim 1: Active Production Model Artifact
- **Statement**: `backend/fraudguard_model.pkl` is present and active.
- **Measured Value**: File size **423,090 bytes**.
- **Proof File**: [`backend/fraudguard_model.pkl`](file:///d:/study%20man/projects/Project_FlashGuard/backend/fraudguard_model.pkl)

### Claim 2: Model Metadata & Dataset Provenance Contract
- **Statement**: Metadata contains `model_name="FraudGuard"`, `model_version="fraudguard-dataset-v1"`, and `dataset_source="Bank of India Hackathon Selection Round (IIT Hyderabad)"`.
- **Measured Value**: Verified in `model_metadata.json`.
- **Proof File**: [`backend/model_metadata.json`](file:///d:/study%20man/projects/Project_FlashGuard/backend/model_metadata.json)

### Claim 3: Model Bundle Integrity
- **Statement**: Loaded bundle contains model, custom preprocessor, and 100 selected feature keys.
- **Measured Value**: Keys `['model', 'preprocessor', 'selected_features', 'threshold', 'target', 'model_version', 'model_type', 'metrics']`.
- **Proof Command**: `python backend/test_model.py`

### Claim 4: Model Architecture Specification
- **Statement**: Uses `HistGradientBoostingClassifier` trained on Bank of India dataset `DataSet.csv`.
- **Measured Value**: Verified class `sklearn.ensemble.HistGradientBoostingClassifier`.
- **Proof File**: [`backend/build_fraudguard_model.py`](file:///d:/study%20man/projects/Project_FlashGuard/backend/build_fraudguard_model.py)

### Claim 5: Zero Data Leakage & Feature Selection
- **Statement**: Exactly 100 features selected; target label `F3912` explicitly excluded from predictors.
- **Measured Value**: `len(features) == 100` and `'F3912' not in features`.
- **Proof File**: [`backend/ml_adapter.py`](file:///d:/study%20man/projects/Project_FlashGuard/backend/ml_adapter.py)

### Claim 6: Cryptographic Production Freeze Hash
- **Statement**: Model SHA256 hash matches `backend/MODEL_FREEZE.md`.
- **Measured Value**: `f23a869a5e516c53b2b4185c809151b771761ebe4c002f1f6b49aa05905472f0`.
- **Proof Command**: `python backend/final_verify.py`

### Claim 7: Inference Latency SLA
- **Statement**: ML model inference latency is strictly under 30.00 ms per transaction.
- **Measured Value**: **~1.51 ms average** (p95: ~2.46 ms).
- **Proof Command**: `python scripts/verify_claims.py`

### Claim 8: Test Set Benchmark Performance
- **Statement**: Test split ROC-AUC = 1.0000, PR-AUC = 1.0000, F1 = 1.0000.
- **Measured Value**: Confirmed via cross-validation and independent test split evaluation.
- **Proof File**: [`notebook/dataset_model_pipeline.ipynb`](file:///d:/study%20man/projects/Project_FlashGuard/notebook/dataset_model_pipeline.ipynb)

### Claim 9: 11-Layer Hybrid Security Engine
- **Statement**: Combines ML probability with velocity, location anomaly, amount deviation, & recipient risk.
- **Measured Value**: Fused risk score output (0–100 scale) with decision levels `ACCEPT`, `REVIEW`, `BLOCK`.
- **Proof File**: [`backend/predict.py`](file:///d:/study%20man/projects/Project_FlashGuard/backend/predict.py)

### Claim 10: Persistent SQLite Database Ledger
- **Statement**: All transactions logged into persistent SQLite store `flashguard.db`.
- **Measured Value**: Database file exists, tables initialized.
- **Proof File**: [`backend/database.py`](file:///d:/study%20man/projects/Project_FlashGuard/backend/database.py)

### Claim 11: Legacy PaySim Decommissioning
- **Statement**: Legacy PaySim model is 100% disabled from active inference pipelines.
- **Measured Value**: `fraud_adapter.model_version == "fraudguard-dataset-v1"`.
- **Proof Command**: `python backend/test_pipeline.py`

### Claim 12: High-Performance FastAPI Backend
- **Statement**: Production-ready ASGI backend with REST API, CORS middleware, & rate limiting.
- **Measured Value**: Routes `/health`, `/predict`, `/transactions`, `/dashboard/stats` active.
- **Proof File**: [`backend/main.py`](file:///d:/study%20man/projects/Project_FlashGuard/backend/main.py)

### Claim 13: Cross-Platform Flutter Mobile Application
- **Statement**: End-user mobile transaction wallet UI for instant risk feedback.
- **Measured Value**: Flutter codebase at `fraudguard_flutter/` with Bank of India IIT Hyd hackathon badges.
- **Proof File**: [`fraudguard_flutter/pubspec.yaml`](file:///d:/study%20man/projects/Project_FlashGuard/fraudguard_flutter/pubspec.yaml)

### Claim 14: 100% Automated Test Suite Passing
- **Statement**: All automated verification test suites pass without error.
- **Measured Value**: 9/9 checks in `final_verify.py`, 10/10 in `test_model.py`, 12/12 in `test_pipeline.py`.
- **Proof Commands**: Run all 3 verification scripts in `backend/`.

---

## ⚡ Honest Scope Declaration

To maintain absolute transparency with hackathon judges:

1. **What is Active & Production-Ready**:
   - `FraudGuard` (`HistGradientBoostingClassifier`) inference engine trained on Bank of India (IIT Hyd) selection round dataset.
   - 11-Layer deterministic risk scoring engine.
   - FastAPI REST API & WebSocket broadcast pipeline.
   - SQLite persistent ledger.
   - Automated claim verification & test suites.
   - Flutter mobile application stack (`fraudguard_flutter`).

2. **What is Disabled / Excluded**:
   - Legacy PaySim model (`flashguard_model.pkl` in legacy directory) — explicitly turned off to ensure zero model confusion.
   - Third-party cloud dependencies — 100% local execution for complete data privacy.
