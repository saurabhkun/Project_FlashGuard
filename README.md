# FLASHGUARD PRO 🛡️

**Real-Time Antivirus Protection for Digital Payments & Financial Scams in India.**  
*Sub-50ms Real-Time Pre-Settlement Scanning · Calibrated ML Statistical Signal (0.933 Holdout ROC-AUC) · 7-Layer Behavioral Risk Engine · Low-Literacy Accessible Flutter UI · Full Stack Solution*

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)](https://github.com/saurabhkun/Project_FlashGuard)
[![Inference Latency](https://img.shields.io/badge/Measured_Latency-Sub--50ms_(SLA_%3C60ms)-blue?style=flat-square)](#-ml-model-benchmarks--audit)
[![Model Version](https://img.shields.io/badge/Model_Version-v2--Hybrid-purple?style=flat-square)](#-ml-model-benchmarks--audit)
[![Holdout ROC-AUC](https://img.shields.io/badge/Holdout_ROC_AUC-0.9330-orange?style=flat-square)](#-ml-model-benchmarks--audit)
[![Dataset Provenance](https://img.shields.io/badge/Dataset_Source-Bank_of_India_%7C_IIT_Hyderabad_Hackathon-teal?style=flat-square)](#-ml-model-benchmarks--audit)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=flat-square)](LICENSE)

---

## 🏛️ Official Dataset Provenance & Engineering Notice

> **The primary benchmark dataset (`DataSet.csv`) powering FlashGuard Pro was officially provided by the Bank of India during the selection round of their Hackathon hosted at IIT Hyderabad (IIT Hyd).**  
> It comprises **9,082 verified financial transaction records** with **3,925 raw feature dimensions** (81 fraud records, 9,001 legitimate records). In our v2 pipeline, we pruned these to the **Top 25 purely numeric, high-information features** strictly fitted on training splits, eliminating all target leakage (`F3912` and `F3924`).

---

## ✅ Verify Every Claim in this Repository — One Command

```bash
python scripts/verify_claims.py
```
*(On Linux/macOS: `./scripts/verify-claims.sh` | On Windows: `scripts\verify-claims.bat`)*

Automated test runner prints all 14 empirical claims with their **measured** runtime values: model SHA256 freeze hash, sub-50ms latency SLA, Bank of India dataset feature rules, 7-layer hybrid risk fusion, and test suite verification.

---

## 🎯 The Pitch in One Line

> **Think Norton or McAfee, but for your money instead of your files — FlashGuard Pro is an antivirus for digital payments that scans transactions in real time and stops financial scams before the money leaves your phone.**

---

## 📸 Application Screenshots

| 1. Phone + OTP Login | 2. Live Protection Dashboard |
| :---: | :---: |
| <img src="login.png" width="380" alt="Phone OTP Login Screen" /> | <img src="dashboard.png" width="380" alt="Protection Dashboard" /> |
| *Bilingual Phone & OTP Authentication* | *Real-Time Shield Status & Scan Stats* |

| 3. Payment Scanning Interface | 4. Security Engine Diagnostics |
| :---: | :---: |
| <img src="interface.png" width="380" alt="Payment Scanning Interface" /> | <img src="parameters.png" width="380" alt="Security Engine Diagnostics" /> |
| *Pre-Settlement Threat Interception* | *7-Layer Rule Matrix & ML Diagnostics* |

---

## ⚡ The Problem & The Solution

India lost over **₹22,495 Crore to digital payment fraud in 2025**. Existing bank security systems evaluate transactions asynchronously *after* the settlement has completed — running batch fraud analysis hours later when funds have already been laundered.

Coercive scams like **"Digital Arrest" extortion calls** specifically exploit instant settlement speeds: victims (especially first-time smartphone users, rural citizens, and elderly account holders) are pressured into transferring life savings during a single phone call, before any bank or family member can intervene.

### The Solution: Pre-Settlement Payment Antivirus
FlashGuard Pro introduces a familiar mental model: **payment antivirus software**. Just like antivirus software scans a file before you open it, FlashGuard Pro scans payment payloads in real-time before money settles:

1. **Pre-Settlement Interception**: Scans every transaction in **< 50 ms**, well within payment settlement windows.
2. **Accessible for Everyone**: Built specifically for low digital literacy — warm beige visual design, zero jargon, clear **ProtectionShield** indicators, and bilingual English/Hindi UI.
3. **Hybrid Security Engine**: Merges a calibrated machine learning anomaly signal (0–35 pts) with 7 deterministic behavioral security layers (spending deviation, velocity spikes, geographic impossibility, mule account matching, balance drain detection).

---

```
                                  FLASHGUARD PRO LIVE PROTECTION PIPELINE
┌───────────────────────────┐       ┌────────────────────────────┐       ┌───────────────────────────────────┐
│  Payment Transaction Feed │ ────► │ FastAPI Async API Server   │ ────► │  Top 25 Selected Numeric Features │
│ (Flutter Mobile App)      │       │ (CORS + Rate-Limiting)     │       │  (Bank of India IIT Hyd Dataset)  │
└───────────────────────────┘       └────────────────────────────┘       └─────────────────┬─────────────────┘
                                                                                           │
                                  ┌────────────────────────────────────────────────────────┴──────────────────┐
                                  │                                                                           │
                                  ▼                                                                           ▼
                   ┌──────────────────────────────┐                            ┌──────────────────────────────┐
                   │ Tier 1: FraudGuard v2 ML     │                            │ Tier 2: 7-Layer Behavioral   │
                   │ • Calibrated Random Forest   │                            │ • Dynamic Amount Deviation   │
                   │ • Coverage-Attenuated Score  │                            │ • Velocity Burst Detection   │
                   │ • 0.9330 Holdout ROC-AUC     │                            │ • Impossible Travel & Mule   │
                   │ • 0 - 35 points max          │                            │ • 0 - 65 points max          │
                   └──────────────┬───────────────┘                            └──────────────┬───────────────┘
                                  │                                                           │
                                  └───────────────────────────┬───────────────────────────────┘
                                                              │
                                                              ▼
                                               ┌──────────────────────────────┐
                                               │ Fused Hybrid Risk Engine     │
                                               │ Score: 0 ─── 40 ─── 80 ─── 100│
                                               └──────────────┬───────────────┘
                                                              │
                                                              ▼
                                               ┌──────────────────────────────┐
                                               │ Real-Time Verdict            │
                                               │ SAFE (0-40) ➔ REVIEW (41-80) │
                                               │ ➔ BLOCK (81-100)             │
                                               └──────────────┬───────────────┘
                                                              │
                                                              ▼
                                               ┌──────────────────────────────┐
                                               │ SQLite Ledger + WebSocket    │
                                               │ Live Stream Broadcast        │
                                               └──────────────────────────────┘
```

---

## 🚀 Key Innovations & Architecture

### 1. 🏛️ Trained on Bank of India (IIT Hyderabad) Dataset
* **Official Hackathon Corpus**: Built using the official selection round dataset (`DataSet.csv`) provided by **Bank of India** at **IIT Hyderabad**.
* **High-Dimensional Feature Mining**: Evaluates 3,925 raw features, pruned to 25 pure numeric, high-information features strictly on `X_train`.

### 2. 🔒 Cryptographic Model Freeze & Zero Data Leakage
* **SHA256 Model Verification**: The active production model `backend/fraudguard_model.pkl` is cryptographically frozen (`3f264611418b639614a2d618f696768fd8b9593c7efcf3ff9e43c451de249d94`). Any tampering causes immediate startup failure. Certified in [`backend/MODEL_FREEZE.md`](backend/MODEL_FREEZE.md).
* **Zero Data Leakage Verification**: Target label `F3924` and secondary leakage proxy `F3912` are explicitly purged from input predictor space.
* **Decommissioned Legacy Models**: Legacy PaySim models are 100% disabled.

### 3. ⚡ High-Throughput Sub-50ms Inference Engine
* **Real-Time Response**: Measured ML inference latency is **~3.8 ms** (API roundtrip $<5\text{ ms}$), well within the payment settlement threshold.
* **Coverage-Attenuated Scaling**: For mobile payloads lacking raw high-dimensional telemetry, the ML score is smoothly attenuated so normal ₹500 transactions are never falsely blocked.

### 4. 🧠 7-Layer Deterministic & Behavioral Security Matrix
Integrates coverage-attenuated ML probability (0–35 pts) with 7 core heuristic layers:
1. **Dynamic Amount Deviation (0–25 pts)**: Flags transfers $>4\times, >10\times, >20\times$ user average.
2. **Velocity Spike (0–20 pts)**: Flags $\ge 2$ or $\ge 4$ high-value transfers in 5 minutes.
3. **Geographic Anomaly (0–20 pts)**: Detects impossible travel speeds ($>500\text{ km/h}$) and high-risk regions.
4. **Recipient Mule & Account Drain (0–25 pts)**: Matches against known mule registries (`M999`, `MULE`) and balance drain $>75\%$.
5. **Device Integrity (0–15 pts)**: Flags unrecognized hardware IDs or emulator fingerprints.
6. **Temporal Window (0–5 pts)**: Flags abnormal late-night transactions (2 AM – 5 AM).
7. **Multi-Vector Threat Synergy (+15 pts)**: Accelerates risk score to BLOCK when $\ge 3$ critical vectors trigger.

### 5. 📱 Multi-Platform Frontends & Antivirus Redesign
* **Flutter Mobile App (`fraudguard_flutter`)**: Redesigned around the **Antivirus for Payments** mental model:
  * **Warm Beige Visual Theme**: Relaxed, calm palette (`warmBeige` `#EDE6D6`, `softIvory` `#F7F3EA`, `forestGreen` `#2F5233`, `amberOchre` `#C68A2E`, `deepCrimson` `#8C2F2F`, `inkText` `#2B2620`).
  * **Low-Literacy Accessibility**: Generous 48x48dp minimum tap targets, 16sp+ body text, 4-item bottom navigation, and icon + text label pairing on every control.
  * **ProtectionShield Status System**: Triple-signal status verification (Color + Icon Shape + Text Tag: **CLEAN & SAFE**, **UNDER REVIEW**, **QUARANTINED**).
  * **Bilingual Support**: Instant English & Hindi UI translation toggle powered by [`lib/services/localization_service.dart`](fraudguard_flutter/lib/services/localization_service.dart).
  * **Demo Phone + OTP Login**: UPI-style 6-digit OTP verification flow ([`lib/screens/demo_login_screen.dart`](fraudguard_flutter/lib/screens/demo_login_screen.dart)), clearly labeled for demonstration.
* **FastAPI Backend API & WebSocket Broadcast**: Real-time alert streamer pushing risk events live over WebSockets (`ws://127.0.0.1:8000/ws/alerts`).

---

## 📊 ML Model Benchmarks & Forensic Audit

| Metric | Measured Value | Benchmark Description | Audit Proof Command |
| :--- | :---: | :--- | :--- |
| **Model SHA256** | `3f264611...` | Active production freeze hash | `python backend/final_verify.py` |
| **Inference Latency** | **~3.8 ms** | ML predict_proba execution | `python scripts/verify_claims.py` |
| **Holdout Test ROC-AUC** | **0.9330** | Evaluated on untouched holdout test set ($N=1,363$) | `python backend/test_defensible_pipeline.py` |
| **Holdout Test PR-AUC** | **0.5834** | Precision-Recall AUC on 0.89% fraud prevalence | `python backend/test_defensible_pipeline.py` |
| **Holdout Test F1** | **0.6000** | Balanced harmonic mean on holdout | `python backend/test_defensible_pipeline.py` |
| **Holdout Precision** | **0.7500** | 6 True Positives, 2 False Positives | `python backend/test_defensible_pipeline.py` |
| **Holdout Confusion Matrix** | `[[1349, 2], [6, 6]]` | 1,351 legitimate, 12 fraud holdout cases | `python backend/test_defensible_pipeline.py` |
| **Data Leakage Check** | **PASSED** | Target `F3924` & `F3912` explicitly excluded | `python scripts/verify_claims.py` |

> **Scientific Transparency Note:** High-dimensional benchmark datasets with few fraud cases (81 instances) exhibit high geometric clustering in 3,900 dimensions. Rather than claiming unrealistic 100% production accuracy from a single dataset, FlashGuard Pro bounds the ML model output to 35% of the composite risk weight and combines it with 7 layers of real-time behavioral heuristics.

---

## 📂 Repository Structure

```
Project_FlashGuard/
├── backend/
│   ├── main.py                   # FastAPI ASGI server (CORS, REST, WebSockets)
│   ├── predict.py                # 7-Layer hybrid risk engine & decision fusion
│   ├── ml_adapter.py             # FraudGuard ML adapter & coverage attenuation
│   ├── fraudguard_model.pkl      # Active production model bundle (v2 Hybrid)
│   ├── model_metadata.json       # Provenance & benchmark metadata contract
│   ├── MODEL_FREEZE.md           # Version registry & cryptographic manifest
│   ├── models/                   # Frozen benchmark v1 and backup v2 bundles
│   ├── test_defensible_pipeline.py # 13-scenario automated verification suite
│   ├── final_verify.py           # 9-check system verification script
│   └── database.py               # Persistent SQLite ledger store
├── fraudguard_flutter/           # Antivirus for Payments Mobile App
│   ├── lib/
│   │   ├── main.dart
│   │   ├── theme/
│   │   │   └── antivirus_theme.dart  # Warm beige palette & Mukta font styles
│   │   ├── services/
│   │   │   ├── api_service.dart      # REST API client & local heuristic fallback
│   │   │   ├── api_config.dart       # Loopback IP & host resolution
│   │   │   └── localization_service.dart # English / Hindi translation manager
│   │   ├── widgets/
│   │   │   ├── protection_shield.dart    # Solid shield status widget
│   │   │   ├── flashguard_logo.dart      # Shield + Rupee sign logo painter
│   │   │   └── scan_pipeline_widget.dart # Antivirus scan visualization
│   │   └── screens/
│   │       ├── demo_login_screen.dart    # Phone + OTP demo login
│   │       ├── splash_screen.dart        # Splash & backend health check
│   │       ├── home_screen.dart          # Protection Status dashboard & log
│   │       ├── send_money_screen.dart    # Payment scanning & presets
│   │       ├── result_screen.dart        # Verdict screen & threat level
│   │       ├── settings_screen.dart      # Language toggle & settings
│   │       └── security_center_screen.dart # Developer engine details
│   └── android/
│       └── app/src/main/AndroidManifest.xml
├── docs/
│   ├── EVALUATION.md             # Hackathon evaluation & judging matrix
│   └── PRD.md                    # Product requirements & problem specification
├── FINAL_ML_STATUS.md            # Comprehensive ML architecture status report
├── MODEL_GENERALIZATION_AUDIT.md # Forensic dataset audit & stress test report
├── HACKATHON_ML_NOTES.md         # Judge presentation & pitch talking points
├── CLAIMS_MATRIX.md              # Empirical claims veracity matrix
├── PROJECT_HANDOFF.md            # Master project architecture & handoff report
└── scripts/
    └── verify_claims.py          # 14-Claim automated verification test suite
```

---

## ⚡ Quick Start & Execution

### 1. Start the Backend API
```bash
cd backend
pip install -r requirements.txt
python main.py
```
> Server runs on `http://127.0.0.1:8000` with active FraudGuard v2 ML inference.

### 2. Run Automated Verification Test Suites
```bash
# Verify all 14 empirical claims
python scripts/verify_claims.py

# Run comprehensive 13-test defensible pipeline suite
python backend/test_defensible_pipeline.py

# Run final 9-check verification
python backend/final_verify.py
```

### 3. Run the Flutter Mobile App (Android Emulator)
```bash
cd fraudguard_flutter
flutter pub get
flutter run
```

---

## 📜 License & Provenance

* **License**: Apache 2.0 License.
* **Dataset Provenance**: Official **Bank of India Hackathon Selection Round Dataset (IIT Hyderabad)**.
