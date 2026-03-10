// Mock Data for FlashGuard Fraud Detection Dashboard
// Used for development and as fallback when backend is unavailable

export const mockTransactions = [
  {
    id: "TXN-001",
    transaction_id: "TXN-A1B2C3D4",
    nameOrig: "USR-1001",
    nameDest: "USR-2001",
    type: "PAYMENT",
    amount: 2500,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    location: "Mumbai, India",
    status: "Safe",
    riskScore: 12,
    actionTaken: "Accepted"
  },
  {
    id: "TXN-002",
    transaction_id: "TXN-E5F6G7H8",
    nameOrig: "USR-1002",
    nameDest: "USR-2002",
    type: "TRANSFER",
    amount: 45000,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    location: "Delhi, India",
    status: "Suspicious",
    riskScore: 58,
    actionTaken: "Review"
  },
  {
    id: "TXN-003",
    transaction_id: "TXN-I9J0K1L2",
    nameOrig: "USR-1003",
    nameDest: "USR-2003",
    type: "CASH_OUT",
    amount: 125000,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    location: "Moscow, Russia",
    status: "Fraud",
    riskScore: 92,
    actionTaken: "Blocked"
  },
  {
    id: "TXN-004",
    transaction_id: "TXN-M3N4O5P6",
    nameOrig: "USR-1004",
    nameDest: "USR-2004",
    type: "PAYMENT",
    amount: 890,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    location: "Bangalore, India",
    status: "Safe",
    riskScore: 8,
    actionTaken: "Accepted"
  },
  {
    id: "TXN-005",
    transaction_id: "TXN-Q7R8S9T0",
    nameOrig: "USR-1005",
    nameDest: "USR-2005",
    type: "TRANSFER",
    amount: 78000,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    location: "Lagos, Nigeria",
    status: "Fraud",
    riskScore: 85,
    actionTaken: "Blocked"
  },
  {
    id: "TXN-006",
    transaction_id: "TXN-U1V2W3X4",
    nameOrig: "USR-1006",
    nameDest: "USR-2006",
    type: "PAYMENT",
    amount: 1500,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    location: "Chennai, India",
    status: "Safe",
    riskScore: 15,
    actionTaken: "Accepted"
  },
  {
    id: "TXN-007",
    transaction_id: "TXN-Y5Z6A7B8",
    nameOrig: "USR-1007",
    nameDest: "USR-2007",
    type: "DEBIT",
    amount: 32000,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    location: "Beijing, China",
    status: "Suspicious",
    riskScore: 65,
    actionTaken: "Review"
  },
  {
    id: "TXN-008",
    transaction_id: "TXN-C9D0E1F2",
    nameOrig: "USR-1008",
    nameDest: "USR-2008",
    type: "CASH_OUT",
    amount: 250000,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    location: "Romania",
    status: "Fraud",
    riskScore: 98,
    actionTaken: "Blocked"
  }
];

export const mockAlerts = [
  {
    id: "ALT-001",
    type: "HIGH_RISK_TXN",
    severity: "high",
    message: "High-risk transaction blocked: ₹125000 from USR-1003",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    related_user: "USR-1003",
    acknowledged: false
  },
  {
    id: "ALT-002",
    type: "UNUSUAL_LOCATION",
    severity: "medium",
    message: "Unusual location detected: moved from Mumbai to Moscow in 2 hours",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    related_user: "USR-1003",
    acknowledged: false
  },
  {
    id: "ALT-003",
    type: "LOGIN_ATTEMPT",
    severity: "low",
    message: "Login successful from new device: USR-1001",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    related_user: "USR-1001",
    acknowledged: true
  },
  {
    id: "ALT-004",
    type: "VELOCITY_ANOMALY",
    severity: "high",
    message: "High velocity: 12 transactions in 1 hour from USR-1009",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    related_user: "USR-1009",
    acknowledged: false
  },
  {
    id: "ALT-005",
    type: "HIGH_RISK_TXN",
    severity: "high",
    message: "High-risk transaction blocked: ₹78000 from USR-1005",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    related_user: "USR-1005",
    acknowledged: false
  },
  {
    id: "ALT-006",
    type: "BLOCKED_TXN",
    severity: "high",
    message: "Transaction blocked due to suspicious pattern: USR-1008",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    related_user: "USR-1008",
    acknowledged: true
  }
];

export const fraudTrendData = [
  { month: "Jan", fraudulent: 45, legitimate: 1200 },
  { month: "Feb", fraudulent: 52, legitimate: 1350 },
  { month: "Mar", fraudulent: 38, legitimate: 1100 },
  { month: "Apr", fraudulent: 65, legitimate: 1400 },
  { month: "May", fraudulent: 48, legitimate: 1550 },
  { month: "Jun", fraudulent: 72, legitimate: 1600 },
  { month: "Jul", fraudulent: 55, legitimate: 1450 },
  { month: "Aug", fraudulent: 42, legitimate: 1700 },
  { month: "Sep", fraudulent: 68, legitimate: 1650 },
  { month: "Oct", fraudulent: 75, legitimate: 1800 },
  { month: "Nov", fraudulent: 58, legitimate: 1750 },
  { month: "Dec", fraudulent: 62, legitimate: 1900 }
];

export const fraudByLocation = [
  { country: "India", safe: 850, suspicious: 120, fraud: 30 },
  { country: "Russia", safe: 45, suspicious: 25, fraud: 40 },
  { country: "Nigeria", safe: 30, suspicious: 35, fraud: 55 },
  { country: "China", safe: 65, suspicious: 20, fraud: 15 },
  { country: "USA", safe: 320, suspicious: 45, fraud: 12 },
  { country: "UK", safe: 210, suspicious: 30, fraud: 8 },
  { country: "Romania", safe: 15, suspicious: 18, fraud: 28 }
];

export const transactionFrequencyData = [
  { hour: "00:00", count: 45 },
  { hour: "01:00", count: 28 },
  { hour: "02:00", count: 15 },
  { hour: "03:00", count: 8 },
  { hour: "04:00", count: 5 },
  { hour: "05:00", count: 12 },
  { hour: "06:00", count: 35 },
  { hour: "07:00", count: 85 },
  { hour: "08:00", count: 150 },
  { hour: "09:00", count: 220 },
  { hour: "10:00", count: 280 },
  { hour: "11:00", count: 320 },
  { hour: "12:00", count: 350 },
  { hour: "13:00", count: 310 },
  { hour: "14:00", count: 290 },
  { hour: "15:00", count: 265 },
  { hour: "16:00", count: 240 },
  { hour: "17:00", count: 210 },
  { hour: "18:00", count: 185 },
  { hour: "19:00", count: 160 },
  { hour: "20:00", count: 135 },
  { hour: "21:00", count: 110 },
  { hour: "22:00", count: 85 },
  { hour: "23:00", count: 60 }
];

export const spendingPatternData = [
  { category: "Shopping", amount: 156000 },
  { category: "Travel", amount: 234000 },
  { category: "Food", amount: 89000 },
  { category: "Utilities", amount: 67000 },
  { category: "Entertainment", amount: 45000 },
  { category: "Healthcare", amount: 34000 },
  { category: "Education", amount: 28000 }
];

export const dashboardStats = {
  total_transactions: 8750,
  fraudulent_count: 125,
  suspicious_count: 285,
  safe_count: 8340,
  fraud_detection_rate: 1.43,
  blocked_today: 8,
  total_volume: 45678900,
  average_transaction: 5220,
  overall_risk_score: 24,
  recent_high_risk: [
    {
      id: "TXN-I9J0K1L2",
      amount: 125000,
      location: "Moscow, Russia",
      riskScore: 92,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    },
    {
      id: "TXN-Q7R8S9T0",
      amount: 78000,
      location: "Lagos, Nigeria",
      riskScore: 85,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
    }
  ]
};

// Helper function to calculate dashboard stats from transactions
export const calculateStats = (transactions) => {
  const total = transactions.length;
  const fraudulent = transactions.filter(t => t.status === 'Fraud').length;
  const suspicious = transactions.filter(t => t.status === 'Suspicious').length;
  const safe = transactions.filter(t => t.status === 'Safe').length;
  
  return {
    total_transactions: total,
    fraudulent_count: fraudulent,
    suspicious_count: suspicious,
    safe_count: safe,
    fraud_detection_rate: ((fraudulent / total) * 100).toFixed(1),
    blocked_today: fraudulent,
    total_volume: transactions.reduce((sum, t) => sum + t.amount, 0),
    average_transaction: Math.round(transactions.reduce((sum, t) => sum + t.amount, 0) / total)
  };
};

