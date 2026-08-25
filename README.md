# 🛡️ FlashGuard Pro: Real-Time Fraud Detection System
### *Advanced Behavioral Monitoring & FraudGuard AI Model Security*

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

FlashGuard Pro is an end-to-end financial surveillance stack that uses Machine Learning to identify fraudulent transactions in real-time. It features a high-performance FastAPI backend, a persistent SQLite data store, a dynamic React admin dashboard, and an interactive mobile payment simulator (`FraudGuard`).

---

## 🧠 ML Model Architecture & Audit

- **Active Production Model**: `FraudGuard` (`HistGradientBoostingClassifier`)
- **Dataset**: `DataSet.csv` (9,082 rows, 3,925 raw features)
- **Feature Selection**: Top 100 features selected via training fold pipeline
- **Benchmark Performance**:
  - Test ROC-AUC: 1.0000
  - Test PR-AUC: 1.0000
  - Test Precision: 1.0000
  - Test Recall: 1.0000
  - Test F1: 1.0000
- **Measured Inference Latency**: **26.47 ms** per transaction payload

> [!NOTE]
> **Accuracy Disclaimer**: 100% benchmark performance is achieved on the validated test split of `DataSet.csv`. The benchmark dataset exhibits high class separability; real-world deployment requires continuous drift monitoring, model retraining, and human oversight.

---

## 🚀 Key Features
* **Real-time FraudGuard ML Inference**: Evaluates transactions in 26.47ms and returns risk scores (0–100 scale).
* **Unified Hybrid Risk Engine**: Combines ML probability with 11-layer security checks (velocity, geo-anomalies, impossible travel, recipient risk).
* **Live Analytics Dashboard**: Visualizes transaction volume, spending patterns, system health, and real-time WebSocket alert feeds.
* **Persistent SQLite Storage**: Maintains transaction history across sessions (`flashguard.db`).
* **Automated Data Streamer**: Replays transaction feeds into the API for live demonstrations.

---

## 🛠️ Tech Stack
* **Frontend**: React.js, Vite, Tailwind CSS, Recharts
* **Mobile Simulator**: React 18, Vite 5, Custom Responsive Design System
* **Backend**: FastAPI (Python), Uvicorn, WebSockets
* **Database**: SQLite (`flashguard.db`)
* **ML Stack**: Scikit-Learn (`HistGradientBoostingClassifier`), Joblib, Pandas

---

| 📊 **Dashboard** | 🧠 **Mobile Application** |
|:---:|:---:|
| ![Dashboard](https://github.com/saurabhkun/CHK-1772903081690-6260/blob/32d6da856ed32f3e645f6beb076412d1fa87daf9/Screenshot%202026-03-11%20032812.png) | ![AI Categorization](https://github.com/saurabhkun/CHK-1772903081690-6260/blob/315c942658965b446b7315a5ce54c63dd45e3618/Screenshot%202026-03-11%20022230.png) |

---

## 🏁 Getting Started (Launch Sequence)

To see the live system in action, follow these steps in **separate terminals**:

### 1️⃣ Terminal: The Backend API
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*Initializes `flashguard.db` and listens on `http://127.0.0.1:8000`.*

### 2️⃣ Terminal: The Admin Analytics Dashboard
```bash
cd Frontend
npm install
npm run dev
```
*Visualizes real-time metrics and risk trends.*

### 3️⃣ Terminal: The Main FraudGuard App Simulator
```bash
cd fraudguard
npm install
npm run dev
```
*Launches the primary end-user payment interface.*

### 4️⃣ Terminal (Optional): Live Streamer
```bash
cd backend
python streamer.py
```
*Replays historical transaction data into the API to populate dashboard charts.*

---

## 🧪 Automated Verification Suite

Run the full end-to-end integration test suite:
```bash
python backend/test_pipeline.py
```
*Executes 12 verification tests covering model loading, dataset prediction, API endpoints, SQLite logging, and legacy model disabling.*
