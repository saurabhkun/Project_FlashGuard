/**
 * FraudGuard — Transaction API Service
 *
 * Now connected to backend API for real fraud detection.
 */

import { fraudEngine } from './fraudEngine'

// API Base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Analyse a transaction through the fraud engine.
 * @param {Object} txnPayload
 * @returns {Promise<{fraudProbability, recommendation, riskLevel, reasons}>}
 */
export async function checkTransaction(txnPayload) {
  try {
    // Call the backend API for real fraud detection
    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step: 1,
        type: txnPayload.type || 'TRANSFER',
        amount: txnPayload.amount,
        nameOrig: txnPayload.nameOrig || 'USER001',
        oldbalanceOrg: txnPayload.oldbalanceOrg || 50000,
        newbalanceOrig: txnPayload.newbalanceOrig || (50000 - txnPayload.amount),
        nameDest: txnPayload.nameDest || 'MERCHANT001',
        oldbalanceDest: txnPayload.oldbalanceDest || 10000,
        newbalanceDest: txnPayload.newbalanceDest || (10000 + txnPayload.amount),
        location: txnPayload.location || 'India',
        device_id: txnPayload.device_id || 'device_001',
        gps_coords: txnPayload.gps_coords || '19.0760,72.8777'
      }),
    });
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Convert backend response to FraudGuard format
    return {
      fraudProbability: data.risk_score,
      recommendation: data.decision, // ACCEPT, REVIEW, BLOCK
      riskLevel: data.level, // SAFE, SUSPICIOUS, FRAUD
      reasons: data.reasons || [],
      transactionId: data.transaction_id,
      behavioralInsight: data.behavioral_insight,
      amountDeviation: data.amount_deviation,
      velocityAnomaly: data.velocity_anomaly
    };
  } catch (error) {
    console.error('Backend API error, falling back to client-side engine:', error);
    
    // Fallback to client-side fraud engine if backend is unavailable
    return fraudEngine(txnPayload);
  }
}

/**
 * Fetch transaction history for the current user.
 * @returns {Promise<Array>}
 */
export async function getTransactions() {
  try {
    // Call the backend API
    const res = await fetch(`${API_BASE_URL}/transactions?limit=100`);
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Convert backend format to FraudGuard format
    return data.transactions.map(txn => ({
      id: txn.transaction_id || txn.id,
      receiver: txn.nameDest || 'Unknown',
      amount: txn.amount,
      location: txn.location || 'Unknown',
      fraudScore: txn.risk_score || 0,
      status: txn.status || 'Safe',
      time: txn.timestamp ? new Date(txn.timestamp).toLocaleDateString() : 'Just now',
      category: txn.type || 'Transfer',
      icon: getCategoryIcon(txn.type)
    }));
  } catch (error) {
    console.error('Error fetching transactions from backend:', error);
    
    // Fallback to mock data if backend is unavailable
    const { TXN_LIST } = await import('../data/mockData');
    return TXN_LIST;
  }
}

/**
 * Get dashboard statistics from backend
 * @returns {Promise<Object>}
 */
export async function getDashboardStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

/**
 * Check API health/connection
 * @returns {Promise<boolean>}
 */
export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

// Helper function to get icon based on transaction type
function getCategoryIcon(type) {
  const icons = {
    'TRANSFER': '💸',
    'PAYMENT': '💳',
    'CASH_OUT': '💵',
    'DEBIT': '📤',
    'CREDIT': '📥'
  };
  return icons[type] || '💰';
}
