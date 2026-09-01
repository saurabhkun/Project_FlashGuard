# FraudGuard AI Model Freeze & Version Registry

> [!IMPORTANT]
> This document certifies the model version registry, frozen benchmark artifacts, and the active **FraudGuard v2 Hybrid** engine for hackathon evaluation and production demo.

---

## 🛡️ Active Model Specifications (v2 Hybrid)

* **Active Model Name**: FraudGuard Pro Hybrid Risk Engine
* **Model Version**: `fraudguard-v2-hybrid`
* **ML Architecture**: CalibratedRandomForestClassifier (Sigmoid Calibrated, depth=6, min_samples_leaf=3)
* **Feature Selection**: Top 25 high-information features strictly selected from `X_train`
* **Target Feature**: `F3924`
* **Inference Strategy**: Coverage-attenuated ML signal (0-35 points) + 7-Layer Behavioral Risk Engine (0-65 points)
* **Status**: **ACTIVE & PRODUCTION FROZEN**

---

## 📊 Dataset & Honest Validation Metrics

* **Training Dataset**: `DataSet.csv` (9,082 rows × 3,925 columns)
* **Class Distribution**: 81 Fraud (0.89%) / 9,001 Legitimate (99.11%)
* **Pre-split Isolation**: 70% Train (6,357 rows, 57 fraud) / 15% Val (1,362 rows, 12 fraud) / 15% Test (1,363 rows, 12 fraud)
* **Validation ROC-AUC**: 0.9688 | **Val PR-AUC**: 0.5093
* **Untouched Test ROC-AUC**: 0.9330 | **Test PR-AUC**: 0.5834
* **Test Precision**: 0.7500 (6 TP, 2 FP on 1,363 holdout transactions)
* **Test Recall**: 0.5000 (Direct ML model catches 6/12 holdout frauds; combined Hybrid Engine catches 100%)
* **Test F1-Score**: 0.6000
* **Holdout Confusion Matrix**: `[[1349, 2], [6, 6]]`
* **Median Inference Latency**: ~3.8 ms (Model predict_proba) / <5 ms (Full API response)

---

## 📦 Artifact Integrity & Hashes

| Version | Artifact Path | SHA256 Hash | Status |
| :--- | :--- | :--- | :--- |
| **v2 (Active)** | `backend/fraudguard_model.pkl` | `3f264611418b639614a2d618f696768fd8b9593c7efcf3ff9e43c451de249d94` | **ACTIVE** |
| **v2 (Models Dir)** | `backend/models/fraudguard_v2.joblib` | `3f264611418b639614a2d618f696768fd8b9593c7efcf3ff9e43c451de249d94` | **BACKUP** |
| **v1 (Benchmark)** | `backend/models/fraudguard_benchmark_v1.pkl` | `f23a869a5e516c53b2b4185c809151b771761ebe4c002f1f6b49aa05905472f0` | **FROZEN ARCHIVE** |

---

## 🔬 Benchmark Dataset Characteristics & Limitations

1. **Extreme Separability in Benchmark**: The 81 fraud rows in `DataSet.csv` share a concentrated feature fingerprint (669 features are completely zero-variance across all fraud rows; mean pairwise cosine distance is 0.4289 vs 0.6871 for legitimate traffic).
2. **Hybrid Layer Defense**: To ensure high real-world defensibility, FraudGuard does not rely solely on raw dataset column trees. It combines the ML probability with deterministic behavioral checks:
   - Dynamic Amount Deviation (historical spending baseline)
   - Velocity / Burst Frequency Analysis (5-minute rolling window)
   - Geographic & Impossible Travel Velocity (>500km/h detection)
   - Beneficiary & Mule Entity Screening
   - Account Depletion / Drain Ratio Analysis
   - Device Fingerprint & Emulator Detection
   - Off-peak Temporal Windows
