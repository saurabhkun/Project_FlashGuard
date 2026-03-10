/**
 * FraudGuard — Mock data
 * In a real app these would come from your API / backend.
 */

export const TXN_LIST = [
  { id: 'T001', receiver: 'Priya Sharma',  amount: 2500,  location: 'Mumbai, IN', fraudScore: 12, status: 'Safe',       time: '2 hours ago',  category: 'Food',     icon: '🍜' },
  { id: 'T002', receiver: 'Ravi Kumar',    amount: 12000, location: 'Russia',     fraudScore: 82, status: 'Fraud',      time: '5 hours ago',  category: 'Crypto',   icon: '₿'  },
  { id: 'T003', receiver: 'Anita Patel',   amount: 500,   location: 'Delhi, IN',  fraudScore: 8,  status: 'Safe',       time: 'Yesterday',    category: 'Transport',icon: '🚌' },
  { id: 'T004', receiver: 'ZenBet Casino', amount: 15000, location: 'Malta',      fraudScore: 74, status: 'Suspicious', time: 'Yesterday',    category: 'Gambling', icon: '🎰' },
  { id: 'T005', receiver: 'Meera Singh',   amount: 1200,  location: 'Bengaluru',  fraudScore: 18, status: 'Safe',       time: '2 days ago',   category: 'Shopping', icon: '🛍️'},
  { id: 'T006', receiver: 'Unknown #4422', amount: 50000, location: 'Nigeria',    fraudScore: 96, status: 'Fraud',      time: '3 days ago',   category: 'Unknown',  icon: '❓' },
]

export const WEEKLY_CHART = [
  { d: 'Mon', safe: 12, risky: 2, fraud: 1 },
  { d: 'Tue', safe: 18, risky: 3, fraud: 0 },
  { d: 'Wed', safe: 9,  risky: 5, fraud: 2 },
  { d: 'Thu', safe: 22, risky: 1, fraud: 1 },
  { d: 'Fri', safe: 14, risky: 4, fraud: 3 },
  { d: 'Sat', safe: 7,  risky: 6, fraud: 2 },
  { d: 'Sun', safe: 11, risky: 2, fraud: 1 },
]

export const PIE_DATA = [
  { name: 'Safe',   value: 68, color: '#0C9B6E' },
  { name: 'Review', value: 22, color: '#D97706'  },
  { name: 'Fraud',  value: 10, color: '#DC2626'  },
]

export const SPEND_CAT = [
  { cat: 'Food & Dining',  amt: 8200, pct: 28, color: '#1D6FEB', icon: '🍔' },
  { cat: 'Shopping',       amt: 6100, pct: 21, color: '#7C3AED', icon: '🛍️' },
  { cat: 'Transport',      amt: 3400, pct: 12, color: '#0891B2', icon: '🚌' },
  { cat: 'Entertainment',  amt: 4500, pct: 15, color: '#DB2777', icon: '🎬' },
  { cat: 'Utilities',      amt: 2800, pct: 10, color: '#0C9B6E', icon: '💡' },
  { cat: 'Others',         amt: 4200, pct: 14, color: '#8898AA', icon: '📦' },
]

export const CURRENCIES = [
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar',        rate: 0.012  },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro',              rate: 0.011  },
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound',     rate: 0.0095 },
  { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen',      rate: 1.82   },
  { code: 'AED', flag: '🇦🇪', name: 'UAE Dirham',        rate: 0.044  },
  { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar',  rate: 0.016  },
]

export const DEVICES = [
  { name: 'iPhone 15 Pro',   loc: 'Mumbai, IN', status: 'current', seen: 'Right now', ok: true  },
  { name: 'MacBook Pro M3',  loc: 'Mumbai, IN', status: 'active',  seen: '2 hrs ago', ok: true  },
  { name: 'Unknown Android', loc: 'Russia',     status: 'blocked', seen: '5 hrs ago', ok: false },
]
