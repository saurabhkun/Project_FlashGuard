import { useState } from 'react';
import { mockTransactions } from '../data/mockTransactions';
import { CheckCircle, XCircle, Save } from 'lucide-react';

export default function Admin() {
  const [fraudThreshold, setFraudThreshold] = useState(70);
  const [suspiciousThreshold, setSuspiciousThreshold] = useState(40);

  const flaggedTransactions = mockTransactions.filter(
    (t) => t.status === 'Fraud' || t.status === 'Suspicious'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-2">
          Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage fraud detection settings and review flagged transactions
        </p>
      </div>

      {/* Fraud Threshold Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Fraud Detection Threshold Settings
        </h2>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Fraud Threshold (Block automatically)
              </label>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {fraudThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={fraudThreshold}
              onChange={(e) => setFraudThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-red-600"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Transactions with risk score ≥ {fraudThreshold}% will be automatically
              blocked
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Suspicious Threshold (Manual review)
              </label>
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {suspiciousThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="70"
              value={suspiciousThreshold}
              onChange={(e) => setSuspiciousThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-yellow-600"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Transactions with risk score ≥ {suspiciousThreshold}% will be flagged for
              manual review
            </p>
          </div>

          <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Flagged Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Flagged Transactions - Manual Review
        </h2>
        <div className="space-y-4">
          {flaggedTransactions.map((txn) => (
            <div
              key={txn.id}
              className={`p-4 rounded-lg border ${
                txn.status === 'Fraud'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Transaction {txn.id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    User: {txn.userId} • Location: {txn.location}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    txn.status === 'Fraud'
                      ? 'bg-red-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}
                >
                  Risk: {txn.riskScore}%
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Amount</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ₹{txn.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Payment Method</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {txn.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {txn.merchantCategory}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Device Score</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {txn.deviceScore}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Approve</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Block</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Blocked Today
          </h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
            {mockTransactions.filter((t) => t.status === 'Fraud').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ₹{mockTransactions
              .filter((t) => t.status === 'Fraud')
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}{' '}
            saved
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Pending Review
          </h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
            {mockTransactions.filter((t) => t.status === 'Suspicious').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Requires manual action
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            False Positives
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            2.3%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Model accuracy: 97.7%
          </p>
        </div>
      </div>

      {/* Blacklist Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Blacklist Management
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add IP Address to Blacklist
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="192.168.1.1"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Blacklist (3 entries)
            </h3>
            <div className="space-y-2">
              {['195.22.146.78', '119.78.45.23', '86.105.23.78'].map((ip, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {ip}
                  </span>
                  <button className="text-sm text-red-600 dark:text-red-400 hover:underline">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
