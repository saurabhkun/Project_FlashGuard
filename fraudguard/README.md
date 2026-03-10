# 🛡️ FraudGuard — AI-Powered Payment Protection

A production-style mobile fintech app with real-time AI fraud detection, built with **React + Vite**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server (opens at http://localhost:3000)
npm run dev

# 3. Build for production
npm run build
```

---

## 📁 Project Structure

```
fraudguard/
├── index.html                  # Entry HTML (viewport-fit=cover for notch support)
├── vite.config.js              # Vite config
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Root app — routing + alert overlay
    │
    ├── styles/
    │   ├── globals.css         # Animations, responsive breakpoints, safe-area
    │   └── tokens.js           # Design tokens (colours, risk helpers)
    │
    ├── data/
    │   └── mockData.js         # Mock transactions, charts, currencies, devices
    │
    ├── services/
    │   ├── fraudEngine.js      # 11-layer AI fraud detection logic
    │   └── transactionAPI.js   # API wrapper (swap mock → real fetch())
    │
    ├── hooks/
    │   └── useClock.js         # Live clock for status bar
    │
    ├── components/
    │   ├── PhoneShell.jsx      # Desktop phone frame (hidden on real mobile)
    │   ├── StatusBar.jsx       # iOS-style status bar with live time
    │   ├── BottomNav.jsx       # Tab bar navigation
    │   └── ui.jsx              # Shared atoms: Btn, Card, Inp, Chip, Gauge…
    │
    └── screens/
        ├── LoginScreen.jsx         # Login with biometrics
        ├── HomeScreen.jsx          # Wallet dashboard
        ├── SendMoneyScreen.jsx     # Send money + real-time fraud warning
        ├── FraudAnalysisScreen.jsx # Animated 11-stage fraud pipeline
        ├── HistoryScreen.jsx       # Transaction history with filters
        ├── InsightsScreen.jsx      # Charts: bar, pie, area
        ├── ScannerScreen.jsx       # QR code scanner
        ├── CardManagementScreen.jsx# Virtual card + freeze + limits
        ├── InternationalScreen.jsx # FX currency converter
        ├── SpendingScreen.jsx      # AI spending analytics
        ├── SecurityCenterScreen.jsx# Threat feed + device manager
        ├── SplitBillScreen.jsx     # Bill splitting
        ├── TxnDetailScreen.jsx     # Transaction detail + fraud breakdown
        └── ProfileScreen.jsx       # User profile + settings hub
```

---

## 📱 Responsive Layout

| Screen width | Behaviour |
|---|---|
| **< 520px** (real phone) | Full-screen native feel — no frame, no chrome. Respects `safe-area-inset` for notch / home indicator. |
| **520–880px** (tablet) | Centered phone frame, no desktop header/chips. |
| **> 880px** (desktop) | Full phone mockup with brand header, side buttons, and feature chips. |

---

## 🔒 Fraud Detection Layers

The engine in `src/services/fraudEngine.js` runs 11 checks per transaction:

1. High Amount Spike
2. Late Night Activity
3. Velocity Spike
4. Location Anomaly
5. Round Amount Detection
6. Merchant Risk Score
7. Device Mismatch
8. IP Risk (VPN / Proxy)
9. Low Trust Score
10. Failed Login History
11. Behavioral Anomaly

**Output:** `fraudProbability (0–98%)` · `recommendation (ALLOW / REVIEW / BLOCK)` · `riskLevel (Low / Medium / High)` · `reasons[]`

---

## 🎯 Hackathon Demo Flow

1. Login → app loads
2. **4 seconds later** → live alert fires: `User #7821 · ₹12,000 · Russia · Risk 82%`
3. Navigate to **Send Money** → enter `₹12,000` + set location to `Russia` + category `crypto`
4. Tap Send → fraud analysis runs → **BLOCK** recommendation
5. All 11 detection stages animate live → judges love it 🏆

---

## 🔌 Connecting a Real Backend

Replace the mock in `src/services/transactionAPI.js`:

```js
export async function checkTransaction(txnPayload) {
  const res = await fetch('/api/check-transaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(txnPayload),
  })
  return res.json()
}
```

---

## 🛠 Tech Stack

- **React 18** + **Vite 5**
- **Recharts** — bar, pie, area charts
- **CSS custom properties** — design tokens
- **CSS media queries** — responsive breakpoints
- **CSS env()** — safe-area-inset for notch support
- No external UI library — 100% custom components
