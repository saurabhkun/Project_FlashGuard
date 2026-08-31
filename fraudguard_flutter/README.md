# FlashGuard Pro — Phone-First Fraud Defense Platform

> **iQOO Hackathon Submission**  •  Bank of India  •  IIT Hyderabad

---

## 🏗 Architecture

```
Android Phone (Flutter)
    │
    ▼  POST /predict  GET /health  GET /history
FastAPI Backend  (localhost:8000)
    │
    ├──► FraudGuard ML Model (fraudguard_model.pkl)
    │    HistGradientBoostingClassifier  •  ROC-AUC 1.0000
    │
    ├──► 11-Layer Rule Engine (predict.py)
    │    Amount anomaly • Velocity • Location • Recipient risk…
    │
    ├──► SQLite Ledger (flashguard.db)
    │
    └──► WebSocket /ws/alerts → React Admin Dashboard
```

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
# Starts on http://127.0.0.1:8000
```

### 2. (Optional) Start Demo Streamer
```bash
python backend/streamer.py
# Streams synthetic transactions every ~2s with rate-limit backoff
```

### 3. Start React Admin Dashboard
```bash
cd fraudguard
npm install
npm run dev
# Starts on http://localhost:5173
```

### 4. Run Flutter Android App

**Option A — Android Emulator (Pixel 9 / API 37)**
```bash
cd fraudguard_flutter
flutter pub get
flutter run -d emulator-5554
```
The app automatically connects to `10.0.2.2:8000` — this is the Android
emulator's loopback address that maps to the host machine's `127.0.0.1`.

**Option B — Physical Android Device**
1. Update `lib/services/api_config.dart`:
   ```dart
   // Set to your machine's LAN IP address
   'http://192.168.1.5:8000',
   ```
2. Connect your phone with USB debugging enabled
3. `flutter run -d <device-id>`

> **Why not `localhost`?**  
> Inside the Android emulator, `localhost` (127.0.0.1) refers to the
> emulator itself, not your host machine. Android uses `10.0.2.2` as a
> special alias to reach the host machine's localhost. On a physical
> device on the same WiFi, use your machine's local IP address.

---

## 📱 App Screens

| Screen | Description |
|--------|-------------|
| **Splash** | Animated shield logo, backend health check, "FraudGuard AI ONLINE" |
| **Home** | Protection status, today's stats, recent transactions, demo scenario shortcuts |
| **Send Money** | SAFE / REVIEW / BLOCK demo presets, 7-stage FraudGuard pipeline animation |
| **Result** | Animated verdict seal, real backend risk score + reasons, risk gauge |
| **Security Center** | Live model info, stats, 11-layer engine breakdown, architecture |
| **Fraud Analytics** | Transaction history from `/history` with risk badges |
| **Transaction Detail** | Per-transaction risk breakdown |

---

## 🎬 Hackathon Demo Flow

1. Open **FlashGuard** on Android emulator
2. Home shows: **● PROTECTED** + **FraudGuard ONLINE**
3. Tap **"Safe ₹500"** demo shortcut → auto-fills recipient + amount
4. Tap **ANALYZE TRANSACTION** → watch 7-stage FraudGuard pipeline
5. Result: ✓ **TRANSACTION SAFE** — Risk: 5/100 — Decision: ACCEPT
6. Back to Home → tap **"Block ₹15,000"** demo shortcut
7. Tap **ANALYZE TRANSACTION** → pipeline runs
8. Result: 🛡 **TRANSACTION BLOCKED** — Risk: 94/100 — with backend reasons
9. Switch to **React Dashboard** (http://localhost:5173) → see the blocked transaction appear in the security feed

**Story**: PHONE → FraudGuard AI → DECISION → ADMIN ALERT

---

## 🔧 API Endpoints

| Endpoint | Method | Used By |
|----------|--------|---------|
| `/predict` | POST | Flutter — Send Money → Result |
| `/health` | GET | Flutter — Splash, Security Center, Home |
| `/history` | GET | Flutter — Analytics, Home recent transactions |
| `/dashboard/stats` | GET | Flutter — Security Center, Home stats |
| `/transactions` | GET | React Dashboard |
| `/ws/alerts` | WebSocket | React Dashboard real-time feed |

### POST /predict — Request Body
```json
{
  "step": 1,
  "type": "TRANSFER",
  "amount": 500.0,
  "nameOrig": "USER_FLASHGUARD_MOBILE",
  "oldbalanceOrg": 84500.0,
  "newbalanceOrig": 84000.0,
  "nameDest": "rahul@okicici",
  "oldbalanceDest": 0.0,
  "newbalanceDest": 500.0,
  "location": "Mumbai, India",
  "device_id": "FLUTTER_ANDROID",
  "ip_address": "10.0.2.2",
  "is_fraud_label": 0
}
```

### POST /predict — Response
```json
{
  "risk_score": 5,
  "level": "SAFE",
  "decision": "ACCEPT",
  "reasons": ["Normal transaction parameters", "Known recipient pattern"],
  "transaction_id": "TXN-123456",
  "is_new_user": false,
  "behavioral_insight": "Consistent with historical behavior",
  "amount_deviation": 0.12,
  "velocity_anomaly": false
}
```

---

## 🤖 ML Model

- **File**: `backend/fraudguard_model.pkl`
- **Algorithm**: HistGradientBoostingClassifier
- **Dataset**: Bank of India Selection Round Dataset (`DataSet.csv`)
- **ROC-AUC**: 1.0000 (verified by `scripts/verify_claims.py`)
- **Features**: 100 selected features
- **Latency**: < 2ms per prediction

**DO NOT** replace with PaySim model or hardcode results.

---

## 🏗 Risk Engine (11 Layers)

1. FraudGuard ML probability  
2. Transaction amount anomaly (+40 pts if >2× user baseline)  
3. Account balance drain (>75% = +30 pts)  
4. Velocity & frequency anomaly  
5. Geographic anomaly (impossible travel)  
6. New user / unknown account  
7. Recipient risk score (mule account detection)  
8. Device integrity signals  
9. IP address risk  
10. Behavioral pattern matching  
11. Feedback learning adjustment  

Final score: **0–40 → SAFE/ACCEPT | 41–80 → SUSPICIOUS/REVIEW | 81–100 → FRAUD/BLOCK**

---

## 📁 Project Structure

```
Project_FlashGuard/
├── backend/               # FastAPI + FraudGuard ML
│   ├── main.py            # API routes
│   ├── predict.py         # 11-layer risk engine
│   ├── schemas.py         # Pydantic models
│   ├── fraudguard_model.pkl   # ML model (DO NOT REPLACE)
│   └── streamer.py        # Demo data streamer
├── fraudguard/            # React Admin Dashboard
└── fraudguard_flutter/    # Flutter Android App
    ├── lib/
    │   ├── main.dart
    │   ├── screens/
    │   │   ├── splash_screen.dart
    │   │   ├── home_screen.dart
    │   │   ├── send_money_screen.dart
    │   │   ├── result_screen.dart
    │   │   ├── security_center_screen.dart
    │   │   ├── fraud_analytics_screen.dart
    │   │   └── transaction_detail_screen.dart
    │   ├── services/
    │   │   ├── api_service.dart     # Backend client
    │   │   └── api_config.dart      # URL configuration
    │   ├── models/
    │   │   └── transaction_model.dart
    │   └── widgets/
    │       ├── scan_pipeline_widget.dart  # 7-stage analysis animation
    │       └── verdict_seal.dart          # Animated verdict stamp
    └── android/
        └── app/src/main/AndroidManifest.xml  # INTERNET + cleartext
```

---

## ⚠️ Development Notes

- `usesCleartextTraffic="true"` in AndroidManifest is required for HTTP to localhost in demo. Remove for production with HTTPS.
- Backend rate-limit: 1 request per 200ms per IP. The app includes automatic retry with 500ms backoff.
- If the backend is offline, the app falls back to local heuristic analysis and shows `⚠ Security engine offline` in the result.
