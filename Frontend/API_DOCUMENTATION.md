# API & Integration Guide

## Mock Fraud Detection API

This document describes the fraud detection API implementation and how to integrate with a real backend.

---

## Current Implementation (Mock)

### Location: `/src/services/fraudAPI.ts`

### Function: `fraudAPI.checkFraud()`

**Type Signature:**
```typescript
fraudAPI.checkFraud(data: FraudCheckRequest): Promise<FraudCheckResponse>
```

**Request Interface:**
```typescript
interface FraudCheckRequest {
  amount: number;              // Transaction amount in currency
  transactionTime: string;     // ISO datetime string
  deviceScore: number;         // 0-100, higher = more trusted
  location: string;            // Country or city name
  ipRiskScore: number;         // 0-100, higher = more risky
  accountAge: number;          // Days since account creation
  transactionFrequency: number; // Number of transactions in last 24h
  merchantCategory: string;    // Category of merchant
  paymentMethod: string;       // Payment method used
  failedLoginAttempts: number; // Recent failed login count
}
```

**Response Interface:**
```typescript
interface FraudCheckResponse {
  fraudProbability: number;        // 0-99, risk percentage
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: 'ALLOW' | 'REVIEW' | 'BLOCK';
  reasons: string[];               // Array of risk factors
  transactionId: string;          // Generated transaction ID
}
```

### Example Usage

```typescript
import { fraudAPI } from '../services/fraudAPI';

const checkTransaction = async () => {
  const request = {
    amount: 12000,
    transactionTime: '2026-03-09T02:13:00',
    deviceScore: 82,
    location: 'Russia',
    ipRiskScore: 75,
    accountAge: 3,
    transactionFrequency: 12,
    merchantCategory: 'Electronics',
    paymentMethod: 'Credit Card',
    failedLoginAttempts: 4,
  };

  try {
    const result = await fraudAPI.checkFraud(request);
    console.log(result);
    // {
    //   fraudProbability: 91,
    //   riskLevel: 'HIGH',
    //   recommendation: 'BLOCK',
    //   reasons: [
    //     'Transaction from high-risk location',
    //     'Unusually high transaction amount',
    //     'Transaction during unusual hours',
    //     ...
    //   ],
    //   transactionId: 'TXN-ABC123XYZ'
    // }
  } catch (error) {
    console.error('Error checking fraud:', error);
  }
};
```

---

## Fraud Detection Algorithm

### Scoring System

The algorithm assigns risk points based on various factors:

| Factor | Condition | Points | Description |
|--------|-----------|--------|-------------|
| **Location** | High-risk country | +25 | Russia, Nigeria, China, Romania, Vietnam |
| **Amount** | > ₹10,000 | +20 | Large transaction amount |
| **Time** | 12am - 5am | +15 | Late night transactions |
| **Device Score** | < 60 | +15 | Untrusted device |
| **IP Risk** | > 60 | +20 | High-risk IP address |
| **Account Age** | < 7 days | +10 | New account |
| **Frequency** | > 8 in 24h | +15 | Multiple transactions |
| **Failed Logins** | > 2 | +10 | Failed authentication attempts |
| **Payment Method** | Credit Card | +5 | Higher risk payment type |
| **Merchant Category** | High-risk | +10 | Electronics, Jewelry, Gift Cards |

### Risk Level Determination

```
Total Score >= 70  → HIGH RISK    → BLOCK
Total Score 40-69  → MEDIUM RISK  → REVIEW
Total Score < 40   → LOW RISK     → ALLOW
```

### Code Implementation

```typescript
export const checkFraud = (data: FraudCheckRequest): FraudCheckResponse => {
  let riskScore = 0;
  const reasons: string[] = [];

  // Location risk
  const highRiskCountries = ['Russia', 'Nigeria', 'China', 'Romania', 'Vietnam'];
  if (highRiskCountries.some(country => data.location.includes(country))) {
    riskScore += 25;
    reasons.push('Transaction from high-risk location');
  }

  // ... more checks ...

  // Determine final risk level
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

  return {
    fraudProbability: Math.min(riskScore, 99),
    riskLevel,
    recommendation,
    reasons,
    transactionId: `TXN-${generateId()}`,
  };
};
```

---

## Integrating with Real Backend

### Option 1: REST API

Replace the mock implementation with actual API calls:

```typescript
// services/fraudAPI.ts

const API_BASE_URL = process.env.VITE_API_URL || 'https://api.yourservice.com';

export const fraudAPI = {
  checkFraud: async (data: FraudCheckRequest): Promise<FraudCheckResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/fraud/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to check fraud');
    }

    return response.json();
  },

  getTransactions: async (filters?: TransactionFilters) => {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(
      `${API_BASE_URL}/api/transactions?${queryParams}`
    );
    return response.json();
  },

  getAlerts: async () => {
    const response = await fetch(`${API_BASE_URL}/api/alerts`);
    return response.json();
  },
};
```

### Option 2: GraphQL

```typescript
import { gql, useQuery, useMutation } from '@apollo/client';

const CHECK_FRAUD = gql`
  mutation CheckFraud($input: FraudCheckInput!) {
    checkFraud(input: $input) {
      fraudProbability
      riskLevel
      recommendation
      reasons
      transactionId
    }
  }
`;

// In component:
const [checkFraud, { data, loading, error }] = useMutation(CHECK_FRAUD);

const handleSubmit = async (formData) => {
  const result = await checkFraud({
    variables: { input: formData }
  });
  // Handle result
};
```

### Option 3: WebSocket (Real-time)

```typescript
import { io } from 'socket.io-client';

const socket = io(process.env.VITE_WS_URL);

// Subscribe to real-time transaction alerts
socket.on('transaction:fraud', (data) => {
  console.log('Fraud detected:', data);
  // Update UI
});

// Send transaction for analysis
socket.emit('transaction:check', transactionData, (response) => {
  console.log('Result:', response);
});
```

---

## Backend Integration Checklist

### 1. Environment Variables

Create `.env` file:
```env
VITE_API_URL=https://api.yourservice.com
VITE_API_KEY=your_api_key_here
VITE_WS_URL=wss://ws.yourservice.com
```

### 2. Authentication

Add authentication service:
```typescript
// services/auth.ts
export const getAuthToken = (): string => {
  return localStorage.getItem('authToken') || '';
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};
```

### 3. Error Handling

```typescript
try {
  const result = await fraudAPI.checkFraud(data);
  setResult(result);
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  } else if (error.response?.status === 429) {
    // Rate limit exceeded
  } else {
    // Generic error
    toast.error('Failed to check fraud. Please try again.');
  }
}
```

### 4. Loading States

```typescript
const [loading, setLoading] = useState(false);

const checkFraud = async (data) => {
  setLoading(true);
  try {
    const result = await fraudAPI.checkFraud(data);
    return result;
  } finally {
    setLoading(false);
  }
};
```

---

## Machine Learning Integration

### Option 1: Python Backend (Flask/FastAPI)

```python
# backend/app.py
from flask import Flask, request, jsonify
from fraud_model import FraudDetector

app = Flask(__name__)
detector = FraudDetector()

@app.route('/api/fraud/check', methods=['POST'])
def check_fraud():
    data = request.json
    
    # Preprocess features
    features = preprocess(data)
    
    # Get prediction from ML model
    prediction = detector.predict(features)
    
    return jsonify({
        'fraudProbability': float(prediction['probability']),
        'riskLevel': prediction['risk_level'],
        'recommendation': prediction['recommendation'],
        'reasons': prediction['reasons'],
        'transactionId': generate_id()
    })
```

### Option 2: TensorFlow.js (Client-side)

```typescript
import * as tf from '@tensorflow/tfjs';

let model: tf.LayersModel;

// Load model
const loadModel = async () => {
  model = await tf.loadLayersModel('/models/fraud-detector/model.json');
};

// Predict
const predictFraud = async (data: FraudCheckRequest) => {
  const features = preprocessFeatures(data);
  const tensor = tf.tensor2d([features]);
  const prediction = model.predict(tensor) as tf.Tensor;
  const probability = await prediction.data();
  return probability[0];
};
```

### Option 3: Cloud ML (AWS SageMaker, GCP AI)

```typescript
import AWS from 'aws-sdk';

const sagemaker = new AWS.SageMakerRuntime();

const invokeFraudModel = async (data: FraudCheckRequest) => {
  const params = {
    EndpointName: 'fraud-detection-endpoint',
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  };

  const response = await sagemaker.invokeEndpoint(params).promise();
  return JSON.parse(response.Body.toString());
};
```

---

## Data Pipeline

### Real-time Transaction Processing

```typescript
// services/transactionStream.ts

class TransactionStream {
  private ws: WebSocket;

  connect() {
    this.ws = new WebSocket(process.env.VITE_WS_URL);
    
    this.ws.onmessage = (event) => {
      const transaction = JSON.parse(event.data);
      this.processTransaction(transaction);
    };
  }

  async processTransaction(txn: Transaction) {
    // Check fraud
    const result = await fraudAPI.checkFraud(txn);
    
    // Update UI
    if (result.riskLevel === 'HIGH') {
      this.emitAlert(txn, result);
    }
    
    // Store in database
    await this.saveTransaction(txn, result);
  }
}
```

---

## API Endpoints Documentation

### Recommended Backend Endpoints

```
POST   /api/fraud/check           - Check fraud for transaction
GET    /api/transactions          - Get all transactions (with filters)
GET    /api/transactions/:id      - Get transaction by ID
GET    /api/alerts                - Get fraud alerts
POST   /api/alerts/:id/resolve    - Resolve an alert
GET    /api/analytics/dashboard   - Get dashboard statistics
GET    /api/analytics/trends      - Get fraud trends
POST   /api/admin/threshold       - Update fraud threshold
GET    /api/admin/blacklist       - Get IP blacklist
POST   /api/admin/blacklist       - Add IP to blacklist
DELETE /api/admin/blacklist/:ip   - Remove IP from blacklist
POST   /api/admin/approve/:id     - Approve flagged transaction
POST   /api/admin/block/:id       - Block flagged transaction
```

### Request/Response Examples

**Check Fraud:**
```bash
POST /api/fraud/check
Content-Type: application/json

{
  "amount": 12000,
  "transactionTime": "2026-03-09T02:13:00",
  "deviceScore": 82,
  "location": "Russia",
  "ipRiskScore": 75,
  "accountAge": 3,
  "transactionFrequency": 12,
  "merchantCategory": "Electronics",
  "paymentMethod": "Credit Card",
  "failedLoginAttempts": 4
}

Response:
{
  "fraudProbability": 91,
  "riskLevel": "HIGH",
  "recommendation": "BLOCK",
  "reasons": [
    "Transaction from high-risk location",
    "Unusually high transaction amount",
    "Transaction during unusual hours"
  ],
  "transactionId": "TXN-ABC123XYZ"
}
```

---

## Rate Limiting

```typescript
// Implement rate limiting on client side
class RateLimiter {
  private requests: number[] = [];
  private limit = 10; // requests
  private window = 60000; // per minute

  async checkLimit(): Promise<boolean> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.window);
    
    if (this.requests.length >= this.limit) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    this.requests.push(now);
    return true;
  }
}
```

---

## Monitoring & Logging

```typescript
// services/analytics.ts
export const logFraudCheck = (request: FraudCheckRequest, response: FraudCheckResponse) => {
  // Send to analytics service
  analytics.track('Fraud Check', {
    transactionId: response.transactionId,
    riskLevel: response.riskLevel,
    recommendation: response.recommendation,
    amount: request.amount,
    location: request.location,
  });
};

// Error tracking
export const logError = (error: Error, context: any) => {
  // Send to error tracking service (e.g., Sentry)
  Sentry.captureException(error, { extra: context });
};
```

---

## Security Best Practices

1. **Never expose API keys in frontend code**
2. **Use HTTPS for all API calls**
3. **Implement authentication tokens (JWT)**
4. **Validate all inputs on backend**
5. **Use rate limiting to prevent abuse**
6. **Encrypt sensitive data in transit and at rest**
7. **Implement CORS properly**
8. **Use environment variables for configuration**
9. **Log all fraud checks for audit trail**
10. **Implement proper error handling**

---

## Testing the API

### Unit Tests

```typescript
import { checkFraud } from '../services/fraudAPI';

describe('Fraud Detection', () => {
  it('should detect high-risk transaction', () => {
    const request = {
      amount: 12000,
      transactionTime: '2026-03-09T02:13:00',
      deviceScore: 45,
      location: 'Russia',
      ipRiskScore: 85,
      accountAge: 2,
      transactionFrequency: 15,
      merchantCategory: 'Electronics',
      paymentMethod: 'Credit Card',
      failedLoginAttempts: 5,
    };

    const result = checkFraud(request);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.recommendation).toBe('BLOCK');
  });

  it('should allow low-risk transaction', () => {
    const request = {
      amount: 450,
      transactionTime: '2026-03-09T14:30:00',
      deviceScore: 95,
      location: 'India',
      ipRiskScore: 10,
      accountAge: 365,
      transactionFrequency: 2,
      merchantCategory: 'Groceries',
      paymentMethod: 'UPI',
      failedLoginAttempts: 0,
    };

    const result = checkFraud(request);
    expect(result.riskLevel).toBe('LOW');
    expect(result.recommendation).toBe('ALLOW');
  });
});
```

---

## Performance Optimization

```typescript
// Implement caching
const cache = new Map<string, FraudCheckResponse>();

export const checkFraudWithCache = async (
  data: FraudCheckRequest
): Promise<FraudCheckResponse> => {
  const cacheKey = JSON.stringify(data);
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  
  const result = await fraudAPI.checkFraud(data);
  cache.set(cacheKey, result);
  
  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(cacheKey), 300000);
  
  return result;
};
```

---

**Ready for production deployment with real ML backend!**
