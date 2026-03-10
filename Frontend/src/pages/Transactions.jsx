import TransactionTable from "../components/TransactionTable";
import { mockTransactions } from '../data/mockTransactions';
import { Download, RefreshCw } from 'lucide-react';

export default function Transactions() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-2">
            Transaction Monitoring
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring of all transactions
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Refresh
            </span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today's Transactions</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockTransactions.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Volume</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{mockTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Transaction</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{Math.round(mockTransactions.reduce((sum, t) => sum + t.amount, 0) / mockTransactions.length).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Blocked Today</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {mockTransactions.filter((t) => t.status === 'Fraud').length}
          </p>
        </div>
      </div>

      {/* Transaction Table */}
      <TransactionTable transactions={mockTransactions} />
    </div>
  );
}
