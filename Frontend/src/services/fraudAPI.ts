export interface FraudCheckRequest {
  amount: number;
  transactionTime: string;
  deviceScore: number;
  location: string;
  ipRiskScore: number;
  accountAge: number;
  transactionFrequency: number;
  merchantCategory: string;
  paymentMethod: string;
  failedLoginAttempts: number;
}

export interface FraudCheckResponse {
  fraudProbability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: 'ALLOW' | 'REVIEW' | 'BLOCK';
  reasons: string[];
  transactionId: string;
}

// Simulated fraud detection algorithm
export const checkFraud = (data: FraudCheckRequest): FraudCheckResponse => {
  let riskScore = 0;
  const reasons: string[] = [];

  // High-risk countries
  const highRiskCountries = ['Russia', 'Nigeria', 'China', 'Romania', 'Vietnam'];
  if (highRiskCountries.some(country => data.location.includes(country))) {
    riskScore += 25;
    reasons.push('Transaction from high-risk location');
  }

  // Transaction amount
  if (data.amount > 10000) {
    riskScore += 20;
    reasons.push('Unusually high transaction amount');
  }

  // Transaction time (late night)
  const hour = new Date(data.transactionTime).getHours();
  if (hour >= 0 && hour <= 5) {
    riskScore += 15;
    reasons.push('Transaction during unusual hours');
  }

  // Device score
  if (data.deviceScore < 60) {
    riskScore += 15;
    reasons.push('Low device trust score');
  }

  // IP Risk Score
  if (data.ipRiskScore > 60) {
    riskScore += 20;
    reasons.push('High IP risk score detected');
  }

  // Account age
  if (data.accountAge < 7) {
    riskScore += 10;
    reasons.push('New account (less than 7 days old)');
  }

  // Transaction frequency
  if (data.transactionFrequency > 8) {
    riskScore += 15;
    reasons.push('Multiple transactions in short time');
  }

  // Failed login attempts
  if (data.failedLoginAttempts > 2) {
    riskScore += 10;
    reasons.push('Multiple failed login attempts');
  }

  // Payment method risk
  if (data.paymentMethod === 'Credit Card') {
    riskScore += 5;
  }

  // High-risk merchant categories
  const highRiskCategories = ['Electronics', 'Jewelry', 'Gift Cards'];
  if (highRiskCategories.includes(data.merchantCategory)) {
    riskScore += 10;
    reasons.push('High-risk merchant category');
  }

  // Determine risk level and recommendation
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  let recommendation: 'ALLOW' | 'REVIEW' | 'BLOCK';

  if (riskScore >= 70) {
    riskLevel = 'HIGH';
    recommendation = 'BLOCK';
  } else if (riskScore >= 40) {
    riskLevel = 'MEDIUM';
    recommendation = 'REVIEW';
  } else {
    riskLevel = 'LOW';
    recommendation = 'ALLOW';
  }

  // If no risk factors found
  if (reasons.length === 0) {
    reasons.push('All parameters within normal range');
  }

  return {
    fraudProbability: Math.min(riskScore, 99),
    riskLevel,
    recommendation,
    reasons,
    transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  };
};

// Mock API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fraudAPI = {
  checkFraud: async (data: FraudCheckRequest): Promise<FraudCheckResponse> => {
    await delay(1500); // Simulate API call
    return checkFraud(data);
  },
};
