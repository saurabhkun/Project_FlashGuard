# 📜 FlashGuard Pro - Product Requirements Document (PRD)

---

## 1. Executive Overview

**FlashGuard Pro** is a real-time, high-performance financial surveillance and fraud prevention system engineered specifically for India's rapidly growing digital payments ecosystem (UPI, IMPS, RTGS, mobile wallets).

By pairing an advanced Machine Learning classifier (`FraudGuard` `HistGradientBoostingClassifier`) with an **11-Layer Heuristic Security Engine**, FlashGuard Pro evaluates payment requests in **sub-30ms latency**, blocking fraudulent fund transfers *before* transactions settle.

---

## 2. Problem Statement & Market Context

- **India Cyber Crime Loss**: Indian citizens lost **₹22,495+ Crore to digital fraud in 2025**, representing a 24% year-over-year escalation.
- **Prevalent Fraud Vectors**:
  1. **Digital Arrest & Extortion Scams**: Impersonation of law enforcement demanding urgent UPI transfers.
  2. **Account Draining**: Sudden, massive transfers exceeding 75%–90% of user balance.
  3. **High-Velocity Mule Accounts**: Newly created UPI handles receiving rapid bursts of small-amount transfers.
  4. **Impossible Geographic Travel**: Successive transactions initiated from distinct locations hundreds of kilometers apart within minutes.
- **The Core Flaw in Existing Solutions**: Traditional banking systems rely on asynchronous post-transaction batch analytics. Money leaves the victim's account instantly, making fund recovery nearly impossible.

---

## 3. Product Architecture & Requirements

### 3.1 Machine Learning Requirements
- **Model Classifier**: `sklearn.ensemble.HistGradientBoostingClassifier`
- **Training Dataset**: `DataSet.csv` (9,082 rows x 3,925 raw features).
- **Feature Selection**: Top 100 features selected via training fold importance.
- **Target Label**: `F3924` (Binary fraud indicator: 0 = Legit, 1 = Fraud).
- **Leakage Invariant**: Target column `F3912` explicitly excluded from predictor feature set.
- **Latency SLA**: $< 30.00\text{ ms}$ per transaction payload inference.

### 3.2 11-Layer Hybrid Risk Engine Scoring Matrix
Total Score Range: **0 to 100**

1. **FraudGuard ML Model Probabilistic Weight** (0–85 points):
   - $\text{Score} = f(\text{Prob}_{\text{ML}})$. Probability $\ge 80\%$ assigns 70–85 points.
2. **Amount Anomaly & Account Draining** (0–20 points):
   - Flags transfers $> 5\times$ historical average or $> 75\%$ balance drain.
3. **Velocity Anomaly** (0–15 points):
   - Flags $> 3$ high-value transactions within a 5-minute window.
4. **Geographic & Impossible Travel** (0–15 points):
   - Flags travel speed $> 500\text{ km/hr}$ between consecutive transactions or high-risk location tags.
5. **Device & Security Anomaly** (0–10 points):
   - Flags unrecognized device hardware IDs on high-value transfers.
6. **Recipient & Mule Account Risk** (0–15 points):
   - Checks recipient UPI handle against known anomaly registry (`M999`, `MULE`, `SUSPICIOUS`).

#### Risk Threshold Decisions:
- **0 - 30**: `SAFE` $\rightarrow$ `ACCEPT` (Automatic Instant Transfer)
- **31 - 70**: `SUSPICIOUS` $\rightarrow$ `REVIEW` (2FA Step-up / Step-Down Challenge)
- **71 - 100**: `FRAUD` $\rightarrow$ `BLOCK` (Transaction Immediately Terminated)

---

## 4. Software Stack Specification

- **Backend Framework**: FastAPI (Python 3.11+), Uvicorn ASGI Server
- **Machine Learning Stack**: Scikit-Learn, Joblib, Pandas, NumPy
- **Persistence Store**: SQLite (`backend/flashguard.db`)
- **Real-Time Messaging**: WebSockets (`ws://127.0.0.1:8000/ws/alerts`)
- **Mobile Frontends**: Flutter (`fraudguard_flutter`) & React Sandbox (`fraudguard`)

---

## 5. Security & Verification Strategy

- **Cryptographic Model Freeze**: Enforces SHA256 model hash validation at backend startup.
- **Automated Verification**: `scripts/verify_claims.py` programmatically verifies 14 key technical metrics.
- **Zero Internet Leakage**: Local-first processing ensures transaction parameters remain confidential.
