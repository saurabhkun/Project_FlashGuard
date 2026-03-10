import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  transactionFrequencyData,
  spendingPatternData,
} from '../data/mockTransactions';

export default function Analytics() {
  const userBehaviorData = [
    { metric: 'Trust Score', value: 85 },
    { metric: 'Activity Level', value: 75 },
    { metric: 'Payment Diversity', value: 60 },
    { metric: 'Location Consistency', value: 90 },
    { metric: 'Device Trust', value: 78 },
    { metric: 'Transaction Pattern', value: 82 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
       <h1 className="text-3xl font-bold text-blue-700 mb-2">
  
          User Behavior Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Advanced analytics and user behavior patterns
        </p>
      </div>

      {/* Transaction Frequency Heatmap */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Transaction Frequency Heatmap
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={transactionFrequencyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
            <XAxis dataKey="hour" className="text-gray-600 dark:text-gray-400" />
            <YAxis className="text-gray-600 dark:text-gray-400" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(31, 41, 55)',
                border: '1px solid rgb(55, 65, 81)',
                borderRadius: '0.5rem',
                color: 'white',
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name="Transactions"
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Peak transaction hours: 12:00 PM - 2:00 PM
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Pattern */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Spending Pattern by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingPatternData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis type="number" className="text-gray-600 dark:text-gray-400" />
              <YAxis dataKey="category" type="category" className="text-gray-600 dark:text-gray-400" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(55, 65, 81)',
                  borderRadius: '0.5rem',
                  color: 'white',
                }}
              />
              <Bar dataKey="amount" fill="#8b5cf6" name="Total Amount (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Behavior Radar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            User Behavior Profile
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={userBehaviorData}>
              <PolarGrid className="stroke-gray-300 dark:stroke-gray-600" />
              <PolarAngleAxis dataKey="metric" className="text-gray-600 dark:text-gray-400" />
              <PolarRadiusAxis className="text-gray-600 dark:text-gray-400" />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(31, 41, 55)',
                  border: '1px solid rgb(55, 65, 81)',
                  borderRadius: '0.5rem',
                  color: 'white',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Location Change Tracking
        </h2>
        <div className="space-y-4">
          {[
            {
              user: 'USR-8901',
              locations: ['Mumbai, India', 'Moscow, Russia', 'Beijing, China'],
              timespan: '2 hours',
              risk: 'High',
            },
            {
              user: 'USR-4523',
              locations: ['Delhi, India', 'Mumbai, India'],
              timespan: '5 days',
              risk: 'Low',
            },
            {
              user: 'USR-7821',
              locations: ['Lagos, Nigeria', 'London, UK', 'New York, USA'],
              timespan: '12 hours',
              risk: 'Medium',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.user}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.risk === 'High'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : item.risk === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}
                >
                  {item.risk} Risk
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Locations:</span>
                <div className="flex items-center space-x-1">
                  {item.locations.map((loc, i) => (
                    <span key={i}>
                      {loc}
                      {i < item.locations.length - 1 && ' → '}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Timespan: {item.timespan}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Average Transaction Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Average Transaction Size
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            ₹4,856
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            ↓ 12% from last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Most Active Hour
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            12:00 PM
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            890 transactions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Top Category
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Travel
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ₹56,789 total
          </p>
        </div>
      </div>
    </div>
  );
}
