// FlashGuard Pro API Service
// Connects frontend to backend fraud detection system

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types
export interface TransactionRequest {
  nameOrig: string;
  nameDest: string;
  type: string;
  amount: number;
  oldbalanceOrg: number;
  newbalanceOrig: number;
  oldbalanceDest: number;
  newbalanceDest: number;
  location: string;
  device_id: string;
  gps_coords: string;
}

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

export interface RiskScoreResponse {
  risk_score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  decision: 'ACCEPT' | 'REVIEW' | 'BLOCK';
  reasons: string[];
  transaction_id: string;
  is_new_user: boolean;
  behavioral_insight?: string;
  amount_deviation?: number;
  velocity_anomaly?: boolean;
}

export interface DashboardStats {
  total_transactions: number;
  fraudulent_count: number;
  suspicious_count: number;
  safe_count: number;
  fraud_detection_rate: number;
  blocked_today: number;
  total_volume: number;
  average_transaction: number;
  overall_risk_score: number;
  recent_high_risk: Array<{
    id: string;
    amount: number;
    location: string;
    risk_score: number;
    timestamp: string;
    nameOrig: string;
  }>;
}

export interface TransactionData {
  id: string;
  transaction_id: string;
  nameOrig: string;
  nameDest: string;
  type: string;
  amount: number;
  timestamp: string;
  location: string;
  status: string;
  riskScore: number;
  actionTaken: string;
  level?: string;
  reasons?: string[];
}

export interface Alert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  related_user?: string;
  acknowledged?: boolean;
  metadata?: Record<string, unknown>;
}

export interface FeedbackRequest {
  transaction_id: string;
  user_feedback: 'GENUINE' | 'FRAUD';
  feedback_type: 'false_positive' | 'false_negative';
  comments?: string;
}

// API Service
const api = {
  // ==================== PREDICTION ====================
  
  /**
   * Check if a transaction is fraudulent
   */
  async checkTransaction(data: TransactionRequest): Promise<RiskScoreResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error checking transaction:', error);
      throw error;
    }
  },

  // ==================== DASHBOARD ====================
  
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // ==================== TRANSACTIONS ====================
  
  /**
   * Get all transactions with optional filters
   */
  async getTransactions(limit?: number, status?: string): Promise<{ transactions: TransactionData[]; count: number }> {
    try {
      let url = `${API_BASE_URL}/transactions?`;
      if (limit) url += `limit=${limit}&`;
      if (status) url += `status=${status}&`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  /**
   * Get a specific transaction by ID
   */
  async getTransaction(transactionId: string): Promise<TransactionData> {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  // ==================== ALERTS ====================
  
  /**
   * Get all alerts with optional filters
   */
  async getAlerts(limit?: number, severity?: string): Promise<{ alerts: Alert[]; count: number }> {
    try {
      let url = `${API_BASE_URL}/alerts?`;
      if (limit) url += `limit=${limit}&`;
      if (severity) url += `severity=${severity}&`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },

  // ==================== FEEDBACK ====================
  
  /**
   * Submit feedback for a transaction
   */
  async submitFeedback(data: FeedbackRequest): Promise<{ success: boolean; message: string; feedback_id: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  /**
   * Get feedback history
   */
  async getFeedbackHistory(userId?: string, limit?: number): Promise<{ feedback: unknown[]; count: number }> {
    try {
      let url = `${API_BASE_URL}/feedback?`;
      if (userId) url += `user_id=${userId}&`;
      if (limit) url += `limit=${limit}&`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching feedback history:', error);
      throw error;
    }
  },

  /**
   * Get feedback statistics
   */
  async getFeedbackStats(): Promise<{
    total_feedback: number;
    false_positives: number;
    false_negatives: number;
    adjustment_factor: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/stats`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      throw error;
    }
  },

  // ==================== USER BEHAVIOR ====================
  
  /**
   * Get user behavior profile
   */
  async getUserBehavior(userId: string): Promise<{
    user_id: string;
    is_new: boolean;
    avg_amount: number;
    max_amount: number;
    transaction_count: number;
    trust_score: number;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/behavior`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user behavior:', error);
      throw error;
    }
  },

  // ==================== HEALTH CHECK ====================
  
  /**
   * Check if API is available
   */
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
};

export default api;

// Export for direct usage
export const fraudAPI = api;

