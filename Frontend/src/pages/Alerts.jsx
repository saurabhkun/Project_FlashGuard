import { AlertPanel } from '../components/AlertPanel';
import { mockAlerts } from '../data/mockTransactions';
import { Shield, TrendingDown, Clock } from 'lucide-react';

export default function Alerts() {
  const highAlerts = mockAlerts.filter((a) => a.severity === 'high').length;
  const mediumAlerts = mockAlerts.filter((a) => a.severity === 'medium').length;
  const lowAlerts = mockAlerts.filter((a) => a.severity === 'low').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-700 mb-2">

          Fraud Alerts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and manage suspicious activities in real-time
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-800 dark:text-red-400">
              HIGH
            </span>
          </div>
          <p className="text-3xl font-bold text-red-900 dark:text-red-300 mb-1">
            {highAlerts}
          </p>
          <p className="text-sm text-red-700 dark:text-red-400">
            Critical Alerts
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
              MEDIUM
            </span>
          </div>
          <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-300 mb-1">
            {mediumAlerts}
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Warning Alerts
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-400">
              LOW
            </span>
          </div>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-1">
            {lowAlerts}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Info Alerts
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Recent Alerts
        </h2>
        <AlertPanel alerts={mockAlerts} />
      </div>

      {/* Alert Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Alert Configuration
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Multiple Transactions Alert
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Trigger alert when more than 8 transactions in 1 hour
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                High-Risk Location Alert
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Alert for transactions from blacklisted countries
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Device Fingerprint Alert
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Alert when device score is below 50
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Failed Login Attempts Alert
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Alert after 3 or more failed login attempts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
