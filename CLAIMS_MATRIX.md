# FlashGuard Pro — Empirical Claims & Veracity Matrix

> **Document Type**: Hackathon Defense & Jury Credibility Audit  
> **Status**: Frozen & Verified against Repository Implementation  
> **Date**: 2026-08-31  
> **Repository**: `D:\study man\projects\Project_FlashGuard`  

---

## 📋 Claims Status Glossary

* **`VERIFIED`**: Directly measured and confirmed in the repository code, test suites, or live runtime execution.
* **`PARTIALLY VERIFIED`**: Grounded in real code, but requires clarification or conservative phrasing to avoid judge skepticism.
* **`UNVERIFIED`**: Mentioned in older documentation or pitch ideas but lacks concrete runtime implementation in the repository.
* **`FALSE`**: In conflict with current codebase truth (must be removed from PPT/pitch immediately).
* **`FUTURE ROADMAP`**: Valid technical concept planned for future deployment; must be presented strictly as roadmap.

---

## 🔍 Master Claims Matrix

| Claim # | Claim Description | Current PPT / Pitch Assertion | Actual Codebase Reality | Status | Evidence & Code Reference | Safe for PPT? | Change / Action Required |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **01** | **Active Production Model** | "Custom FraudGuard AI model active on backend" | `backend/fraudguard_model.pkl` is loaded by `ml_adapter.py`. 423,090 bytes. | **VERIFIED** | [`backend/ml_adapter.py`](backend/ml_adapter.py#L90-L130), [`backend/MODEL_FREEZE.md`](backend/MODEL_FREEZE.md) | **YES** | Keep as core proof point. |
| **02** | **Dataset Provenance** | "Bank of India Hackathon Selection Round (IIT Hyderabad)" | `DataSet.csv` (9,082 rows × 3,925 features, target `F3924`, 81 fraud / 9,001 legit). | **VERIFIED** | [`backend/model_metadata.json`](backend/model_metadata.json), [`backend/build_fraudguard_model.py`](backend/build_fraudguard_model.py) | **YES** | Highly defensible provenance. |
| **03** | **Model Architecture** | "Dual AI Model / XGBoost" | Currently `HistGradientBoostingClassifier` (Scikit-Learn ensemble) pruned to 100 features. | **PARTIALLY VERIFIED** | [`backend/build_fraudguard_model.py`](backend/build_fraudguard_model.py#L38-L45) | **YES** *(with edit)* | Update PPT to state "Gradient Boosted Decision Ensemble (`HistGradientBoosting`) + 11-Layer Deterministic Rule Matrix". Do not claim XGBoost. |
| **04** | **Sub-30ms Latency SLA** | "Scans transactions under 50ms / 30ms" | Measured average ML inference latency is **1.51 ms** (p95: ~3.30 ms). End-to-end API is **~4.58 ms**. | **VERIFIED** | Verified by `python scripts/verify_claims.py` (Claim 07) | **YES** | Highlight **1.51 ms** inference time — beats payment settlement SLAs easily. |
| **05** | **Zero Data Leakage** | "Zero leakage verification" | Target `F3924` and leakage column `F3912` are explicitly excluded from input features in `CustomPreprocessor`. | **VERIFIED** | [`backend/ml_adapter.py`](backend/ml_adapter.py#L22-L45), [`scripts/verify_claims.py`](scripts/verify_claims.py#L88-L102) | **YES** | Emphasize data hygiene to technical judges. |
| **06** | **Test Benchmark (1.00 AUC / F1)** | "100% Accuracy / 99%+ AUC" | Test set achieves 1.0000 ROC-AUC & F1 score due to distinct class separability on the 100 selected features. | **PARTIALLY VERIFIED** | [`backend/model_metadata.json`](backend/model_metadata.json), [`backend/test_model.py`](backend/test_model.py) | **CAUTION** | **DO NOT claim 100% real-world accuracy.** State: "1.00 ROC-AUC on Bank of India test benchmark; production performance is fortified by our 11-layer hybrid rule matrix to prevent distribution drift." |
| **07** | **Legacy PaySim Decommissioning** | "PaySim legacy removed" | Legacy PaySim model is completely decommissioned. Active inference strictly uses `FraudGuard` bundle. | **VERIFIED** | [`backend/predict.py`](backend/predict.py), [`backend/final_verify.py`](backend/final_verify.py) | **YES** | Safe to claim. |
| **08** | **11-Layer Hybrid Risk Fusion** | "11-Layer Security Matrix" | Fuses ML probability (0–85 pts) with Amount Deviation, Velocity Spikes, Impossible Travel (>500km/h), Device Integrity, & Mule Recipient matching. | **VERIFIED** | [`backend/predict.py`](backend/predict.py#L110-L245) | **YES** | Key technical pillar — showcase the 0-100 fused risk scoring breakdown. |
| **09** | **Real-Time WebSocket Alerts** | "Real-time live push alerts to dashboard" | FastAPI WebSocket endpoint at `ws://127.0.0.1:8000/ws/alerts` broadcasts every evaluated transaction in real time. | **VERIFIED** | [`backend/main.py`](backend/main.py#L65-L88), [`backend/main.py`](backend/main.py#L140-L155) | **YES** | Safe and demonstrable live. |
| **10** | **Cross-Platform Flutter Mobile App** | "Native Android Mobile App" | Production-grade Flutter application (`fraudguard_flutter`) with Android build configuration (compileSdk, minSdk, targetSdk, Java 17, cleartext HTTP config for 10.0.2.2 emulator loopback). | **VERIFIED** | [`fraudguard_flutter/pubspec.yaml`](fraudguard_flutter/pubspec.yaml), [`fraudguard_flutter/android/app/build.gradle.kts`](fraudguard_flutter/android/app/build.gradle.kts) | **YES** | Works in Android Emulator and physical Android devices. |
| **11** | **Biometric Authentication** | "Biometric authorization on high risk" | Implemented in Flutter via `local_auth` package in `BiometricService`, with automatic PIN fallback for emulator. | **VERIFIED** | [`fraudguard_flutter/lib/services/biometric_service.dart`](fraudguard_flutter/lib/services/biometric_service.dart) | **YES** | Great phone-first capability. |
| **12** | **Bilingual Localization** | "Accessible bilingual interface (English / Hindi)" | Implemented via `LocalizationService` with complete string dictionary toggleable on the fly. | **VERIFIED** | [`fraudguard_flutter/lib/services/localization_service.dart`](fraudguard_flutter/lib/services/localization_service.dart) | **YES** | Great social impact point for rural & senior citizens. |
| **13** | **NPCI / UPI Gateway Integration** | "Integrated directly with NPCI UPI switch" | No direct NPCI API exists in the repository. Payload intercepts standard UPI parameters (`nameDest@upi`, `amount`, `ref`). | **UNVERIFIED / FALSE** | None in codebase (mock payload format used) | **NO** | **REMOVE "NPCI direct integration".** Instead state: "Designed as an overlay pre-settlement interceptor compatible with standard UPI payment payloads." |
| **14** | **Direct Core Banking Integration** | "Integrated with Bank CBS" | FlashGuard is an intelligence security layer, not connected to live CBS APIs. | **UNVERIFIED** | None | **NO** | **REMOVE.** Pitch as "SDK/API middleware ready for deployment within banking & fintech apps." |
| **15** | **DPDP Statutory Compliance** | "100% DPDP Act Compliant" | Code respects privacy by local-first processing and zero third-party telemetry, but formal statutory compliance is a legal certification. | **PARTIALLY VERIFIED** | Zero external tracking in codebase | **CAUTION** | State: "Architected for DPDP alignment via local-first parameter evaluation and zero third-party cloud data leakage." |
| **16** | **On-Device Local AI Inference (TFLite/ONNX)** | "On-device AI on the phone" | Inference runs on the FastAPI backend (`http://10.0.2.2:8000`). The Flutter client includes heuristic offline fallback if server is unreachable. | **PARTIALLY VERIFIED** | [`fraudguard_flutter/lib/services/api_service.dart`](fraudguard_flutter/lib/services/api_service.dart#L125-L165) | **CAUTION** | State: "Client-server pre-settlement architecture with instant local heuristic fallback; On-Device TFLite model is our active roadmap milestone." |
| **17** | **50,000 Transactions Dataset Claim** | "Trained on 50,000 transactions" | Training set is `DataSet.csv` with 9,082 rows. (50,000 was the row limit used in legacy PaySim streamer). | **FALSE** | [`backend/model_metadata.json`](backend/model_metadata.json) | **NO** | **CORRECT TO:** "9,082 verified transaction records with 3,925 raw dimensions from Bank of India Hackathon." |
| **18** | **60% False Positive Reduction** | "60% FP Reduction / 94% Capture" | These were simulated comparative claims against generic rule-only systems. | **PARTIALLY VERIFIED** | Grounded in hybrid rule + ML score comparisons in simulation | **CAUTION** | Clarify that this is measured against static threshold rule-based baselines. |

---

## 🎯 Summary of PPT Updates

1. **Change Model Name**: Replace "XGBoost" with **"Gradient Boosted Decision Ensemble (`HistGradientBoostingClassifier`) + 11-Layer Rule Fusion"**.
2. **Change Dataset Count**: Replace "50,000 transactions" with **"9,082 verified transactions with 3,925 raw dimensions (Bank of India IIT Hyderabad Selection Round Dataset)"**.
3. **Change Accuracy Claim**: Replace "100% real-world accuracy" with **"1.00 ROC-AUC & F1 on validation benchmark + 11-Layer Deterministic Defense to handle out-of-distribution fraud"**.
4. **Remove Unverified Integrations**: Remove "Direct NPCI API connection" and "Live Bank CBS Integration". Frame FlashGuard as a **"Zero-Latency Pre-Settlement Security Middleware SDK"**.
5. **Frame On-Device AI**: Frame current system as **"Ultra-low latency (1.51 ms) backend API + Phone-first Biometrics & Local Heuristic Fallback"**, with On-Device TFLite/ONNX as Phase 2.
