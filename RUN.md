# Running FlashGuard - Backend + Flutter Mobile App (Android Emulator)

## Quick Start

### 1. Start the Backend Server (FastAPI)

Open a terminal in Antigravity or PowerShell:
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start the FastAPI server
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

> ⚠️ Keep this terminal running in the background!

---

### 2. Start the Flutter App on Android Emulator

Open a **new terminal tab** (or open in Android Studio):

#### Method A: Terminal (Antigravity / PowerShell)
```bash
# 1. Navigate to the flutter app folder
cd fraudguard_flutter

# 2. Download Flutter packages
flutter pub get

# 3. View connected devices / emulators
flutter devices

# 4. Launch the app on your running emulator
flutter run
```

#### Method B: Android Studio
1. Open the project folder `fraudguard_flutter` in Android Studio.
2. Launch your Android Virtual Device (AVD) from **Device Manager**.
3. Select the emulator from the device target dropdown at the top.
4. Click the green **Run (▶)** button (or press `Shift + F10`).

---

## 🌐 Emulator Connection & How It Works

- The Android emulator accesses the host machine's FastAPI backend using **`http://10.0.2.2:8000`** (pre-configured in `lib/services/api_config.dart`).
- When running backend with `--host 0.0.0.0`, it accepts incoming connections from both `127.0.0.1` and the emulator's `10.0.2.2` loopback.

---

## 🔍 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/predict` | POST | Scan & evaluate transaction for fraud |
| `/dashboard/stats` | GET | Get real-time engine statistics |
| `/history` | GET | Get transaction log history |
| `/health` | GET | Health check status |

---

## 🛠️ Troubleshooting

- **Backend Connection Failed on Emulator**: Verify backend was started with `--host 0.0.0.0` on port 8000.
- **No Devices Found**: Start your emulator from Android Studio's **Device Manager** first, then re-run `flutter devices`.
- **Package Errors**: Run `flutter clean` followed by `flutter pub get`.

