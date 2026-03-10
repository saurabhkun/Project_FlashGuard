/**
 * FraudGuard — AI Fraud Detection Engine
 *
 * Runs a transaction through 11 detection layers and returns:
 *   { fraudProbability, recommendation, riskLevel, reasons }
 *
 * In production this logic lives server-side (Node / Python).
 * Replace the body of `fraudEngine` with a real API call:
 *
 *   export async function fraudEngine(txn) {
 *     const res = await fetch('/api/check-transaction', {
 *       method: 'POST',
 *       body: JSON.stringify(txn),
 *     })
 *     return res.json()
 *   }
 */

const HIGH_RISK_LOCATIONS = ['Russia', 'Nigeria', 'North Korea', 'Iran', 'Belarus']
const HIGH_RISK_MERCHANTS  = ['crypto', 'gambling', 'adult', 'weapons']

export function fraudEngine(txn) {
  const reasons = []
  let score = 0

  const check = (name, fn) => { if (fn()) reasons.push(name) }

  // ── Layer 1: High amount spike ──────────────────────────
  check('High Amount Spike', () => {
    if (txn.amount > 10000) { score += 25; return true }
    if (txn.amount > 5000)  { score += 12; return true }
    return false
  })

  // ── Layer 2: Late-night transaction ─────────────────────
  check('Late Night Activity', () => {
    const h = new Date().getHours()
    if (h >= 0 && h < 5) { score += 20; return true }
    return false
  })

  // ── Layer 3: Transaction velocity spike ─────────────────
  check('Velocity Spike', () => {
    if (txn.txnCount > 5) { score += 18; return true }
    return false
  })

  // ── Layer 4: Geographic location anomaly ────────────────
  check('Location Anomaly', () => {
    if (HIGH_RISK_LOCATIONS.some(c => txn.location?.includes(c))) {
      score += 30; return true
    }
    return false
  })

  // ── Layer 5: Suspicious round amount ────────────────────
  check('Round Amount', () => {
    if (txn.amount % 10000 === 0 || txn.amount % 5000 === 0) {
      score += 10; return true
    }
    return false
  })

  // ── Layer 6: High-risk merchant category ────────────────
  check('Merchant Risk', () => {
    if (HIGH_RISK_MERCHANTS.includes(txn.merchantCategory?.toLowerCase())) {
      score += 22; return true
    }
    return false
  })

  // ── Layer 7: Device fingerprint mismatch ────────────────
  check('Device Mismatch', () => {
    if (txn.deviceScore < 40) { score += 15; return true }
    return false
  })

  // ── Layer 8: IP risk (VPN / proxy / blacklisted) ────────
  check('IP Risk Detected', () => {
    if (txn.ipRiskScore > 60) { score += 18; return true }
    return false
  })

  // ── Layer 9: Low account trust score ────────────────────
  check('Low Trust Score', () => {
    if (txn.accountTrust < 30) { score += 12; return true }
    return false
  })

  // ── Layer 10: Failed login history ──────────────────────
  check('Failed Login History', () => {
    if (txn.failedLoginAttempts > 2) { score += 20; return true }
    return false
  })

  // ── Layer 11: Behavioural anomaly ───────────────────────
  check('Behavioral Anomaly', () => {
    if (txn.behaviorScore < 35) { score += 14; return true }
    return false
  })

  const fraudProbability = Math.min(score, 98)
  const recommendation   = fraudProbability < 35 ? 'ALLOW' : fraudProbability < 65 ? 'REVIEW' : 'BLOCK'
  const riskLevel        = fraudProbability < 35 ? 'Low'   : fraudProbability < 65 ? 'Medium'  : 'High'

  return { fraudProbability, recommendation, riskLevel, reasons }
}
