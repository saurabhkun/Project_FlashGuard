# FlashGuard Pro: Hackathon ML Presentation Notes

**For Pitching to Judges, Evaluators, and Technical Reviewers**

---

## 🎯 1. The Core Story: How We Protect Users

> **"Don't sell a 100% accuracy model. Sell a defense-in-depth security architecture that doesn't break when fraud patterns change."**

### Elevator Pitch (30 Seconds)
"FlashGuard Pro is a real-time behavioral fraud prevention platform. Modern financial fraud isn't solved by a single black-box ML model because real-world fraud evolves constantly. Instead, FlashGuard combines a calibrated Machine Learning risk signal with a 7-layer behavioral heuristics engine—analyzing dynamic spending deviation, velocity bursts, impossible travel speeds, beneficiary mule screening, and account depletion. This delivers sub-5ms risk scores categorizing transactions into SAFE, REVIEW, or BLOCK with complete explainability."

---

## 🧠 2. Answering Technical Judge Questions

### Q: "What dataset did you train on, and what was your ML accuracy?"
**Answer:**
> "We trained on `DataSet.csv` containing 9,082 transactions across 3,925 high-dimensional telemetry features, with 81 fraud cases (0.89% prevalence). While standard tree models can score 1.0000 on this dataset due to high geometric separability among the 81 fraud rows, we knew claiming 100% real-world accuracy would be scientifically dishonest. We regularized our model into a Calibrated Random Forest (ROC-AUC 0.933, PR-AUC 0.583, F1 0.60 on untouched holdout data) and bounded its output to contribute up to 35 points within our multi-layer risk engine."

### Q: "How does the mobile app talk to the ML model if the model expects 25 or 100 dataset features?"
**Answer:**
> "That was one of our key architectural challenges. A mobile transaction only provides transactional fields like amount, location, device ID, and recipient. In FraudGuard v2, we compute a **Feature Coverage Ratio**. If a transaction comes with full device telemetry, the ML model contributes fully. If it's a standard mobile payload, the ML score is smoothly attenuated, and our behavioral risk engine evaluates the transaction based on historical user baselines, velocity bursts, and geographic travel velocity."

### Q: "How do you ensure normal everyday transactions aren't blocked?"
**Answer:**
> "We verified this extensively: a standard ₹500 grocery payment evaluates to a risk score of ~8/100 (well within the 0–40 SAFE tier). The system only elevates transactions to SUSPICIOUS / REVIEW (41–80) when significant anomalies occur (e.g. ₹8,500 transfer on a new device with 17x spending deviation), and triggers FRAUD / BLOCK (81–100) only when multiple critical red flags converge (e.g. ₹15,000 transfer to a blacklisted mule entity draining 94% of balance from a remote location)."

---

## 🛡️ 3. Decision Score Breakdown Summary

```
Total Risk Score (0 - 100):
├── 1. ML Anomaly Signal:        0 - 35 points (Coverage Attenuated)
├── 2. Amount Deviation:         0 - 25 points (Compared to user average)
├── 3. Velocity / Burst:         0 - 20 points (Rolling 5-minute window)
├── 4. Impossible Travel:        0 - 20 points (>500 km/h or high-risk region)
├── 5. Recipient Mule / Drain:   0 - 25 points (Blacklist entity + >75% drain)
├── 6. Device Security Anomaly:  0 - 15 points (Unrecognized / Emulator ID)
└── 7. Off-Peak Temporal Window: 0 - 5 points  (2 AM - 5 AM)

Decision Tiers:
  0 - 40:  SAFE / ACCEPT       (Auto-approved)
  41 - 80: SUSPICIOUS / REVIEW (Step-up 2FA / Biometric verification)
  81 - 100: FRAUD / BLOCK      (Immediate block + real-time alert)
```

---

## 🚀 4. Live Demo Walkthrough Steps

1. **Scenario 1: Normal Everyday Transaction (₹500)**
   - Destination: `MERCHANT_GROCERY`
   - Result: `Score: 8/100` → **SAFE / ACCEPT**
   - Explanation: "Normal amount, recognized device, domestic location."

2. **Scenario 2: Unusual Transaction (₹8,500)**
   - Destination: `NEW_RECIPIENT_XYZ` (17x average spending, location jump to Delhi)
   - Result: `Score: 75/100` → **SUSPICIOUS / REVIEW**
   - Explanation: "Flags spending spike and new device; held for user verification."

3. **Scenario 3: High-Risk Mule Fraud (₹15,000)**
   - Destination: `MULE_ACCOUNT_M999` (High velocity burst, high-risk location, 94% balance drain)
   - Result: `Score: 100/100` → **FRAUD / BLOCK**
   - Explanation: "Multiple critical threat vectors triggered simultaneously; blocked instantly."

4. **Scenario 4: Graceful Degradation / Offline Mode**
   - If backend is offline, Flutter app seamlessly falls back to local heuristic rules without crashing or blocking legitimate users.
