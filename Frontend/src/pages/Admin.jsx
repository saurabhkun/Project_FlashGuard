import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Save } from 'lucide-react';

export default function Admin() {
  const [fraudThreshold, setFraudThreshold] = useState(70);
  const [suspiciousThreshold, setSuspiciousThreshold] = useState(40);
  const [transactions, setTransactions] = useState([]);

  // 1. Fetch live transactions to populate the "Manual Review" section
  useEffect(() => {
    const fetchFlagged = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/history");
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error("Admin fetch failed:", err);
      }
    };
    fetchFlagged();
    const interval = setInterval(fetchFlagged, 3000);
    return () => clearInterval(interval);
  }, []);

  // 2. Filter transactions based on your UI sliders
  const flaggedTransactions = transactions.filter(t => {
    const score = t.fraud_probability * 100;
    return score >= suspiciousThreshold;
  }).reverse().slice(0, 5); // Show top 5 newest flagged items

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-2">Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage fraud detection settings and review flagged transactions</p>
      </div>

      {/* Threshold Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Fraud Detection Thresholds</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Auto-Block Threshold</label>
              <span className="text-2xl font-bold text-red-600">{fraudThreshold}%</span>
            </div>
            <input 
              type="range" min="50" max="100" value={fraudThreshold} 
              onChange={(e) => setFraudThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Manual Review Threshold</label>
              <span className="text-2xl font-bold text-yellow-600">{suspiciousThreshold}%</span>
            </div>
            <input 
              type="range" min="10" max="70" value={suspiciousThreshold} 
              onChange={(e) => setSuspiciousThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
            />
          </div>

          <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Live Flagged Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Flagged Transactions - Manual Review</h2>
        <div className="space-y-4">
          {flaggedTransactions.length === 0 ? (
            <p className="text-gray-500 italic">No transactions currently exceed thresholds.</p>
          ) : (
            flaggedTransactions.map((txn, idx) => {
              const score = (txn.fraud_probability * 100).toFixed(0);
              const isHighRisk = score >= fraudThreshold;

              return (
                <div key={idx} className={`p-4 rounded-lg border ${isHighRisk ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">Transaction {txn.id || 'N/A'}</h3>
                      <p className="text-sm text-gray-600">Type: {txn.type} • Amount: ₹{txn.amount}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isHighRisk ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'}`}>
                      Risk Score: {score}%
                    </span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm"><CheckCircle className="w-4 h-4"/> <span>Approve</span></button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"><XCircle className="w-4 h-4"/> <span>Block</span></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}