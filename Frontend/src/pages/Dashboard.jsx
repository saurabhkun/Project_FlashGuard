import { StatsCard } from '../components/StatsCard';
import { FraudGauge } from '../components/FraudGauge';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  fraudTrendData,
  fraudByLocation,
  mockTransactions,
} from '../data/mockTransactions';

export default function Dashboard() {
  // Calculate stats
  const totalTransactions = mockTransactions.length;
  const fraudulentCount = mockTransactions.filter((t) => t.status === 'Fraud').length;
  const suspiciousCount = mockTransactions.filter((t) => t.status === 'Suspicious').length;
  const fraudDetectionRate = ((fraudulentCount / totalTransactions) * 100).toFixed(1);

  // Pie chart data
  const pieData = [
    { name: 'Safe', value: mockTransactions.filter((t) => t.status === 'Safe').length },
    { name: 'Suspicious', value: suspiciousCount },
    { name: 'Fraudulent', value: fraudulentCount },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
       <h1 className="text-3xl font-bold text-blue-700 mb-2">
  Dashboard Overview
</h1>
         
        <p className="text-gray-600 dark:text-gray-400">
          Real-time fraud detection analytics and monitoring
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          change="+12.5%"
          icon="activity"
          trend="up"
        />
        <StatsCard
          title="Fraudulent Transactions"
          value={fraudulentCount}
          change="-8.3%"
          icon="alert"
          trend="down"
        />
        <StatsCard
          title="Suspicious Transactions"
          value={suspiciousCount}
          change="+3.2%"
          icon="shield"
          trend="up"
        />
        <StatsCard
          title="Fraud Detection Rate"
          value={`${fraudDetectionRate}%`}
          change="+0.5%"
          icon="trending"
          trend="up"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fraud Gauge */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Overall Fraud Risk Score
          </h2>
          <div className="flex justify-center">
            <FraudGauge value={24} size={250} />
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Current system-wide fraud risk level
          </p>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Transaction Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        {/* Line Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Fraud Detection Trend Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fraudTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(55, 65, 81)',
                  borderRadius: '0.5rem',
                  color: 'white',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="fraudulent"
                stroke="#ef4444"
                strokeWidth={2}
                name="Fraudulent"
              />
              <Line
                type="monotone"
                dataKey="legitimate"
                stroke="#10b981"
                strokeWidth={2}
                name="Legitimate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Fraud by Location
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fraudByLocation}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis dataKey="country" className="text-gray-600 dark:text-gray-400" />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(55, 65, 81)',
                  borderRadius: '0.5rem',
                  color: 'white',
                }}
              />
              <Legend />
              <Bar dataKey="safe" fill="#10b981" name="Safe" />
              <Bar dataKey="suspicious" fill="#f59e0b" name="Suspicious" />
              <Bar dataKey="fraud" fill="#ef4444" name="Fraud" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent High-Risk Transactions
        </h2>
        <div className="space-y-3">
          {mockTransactions
            .filter((t) => t.status === 'Fraud')
            .slice(0, 3)
            .map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {txn.id} - {txn.location}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ₹{txn.amount.toLocaleString()} • Risk Score: {txn.riskScore}
                  </p>
                </div>
                <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                  {txn.actionTaken}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
