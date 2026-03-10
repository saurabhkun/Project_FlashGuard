import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);

  // 1. Fetch live data from your FastAPI Backend (Port 8000)
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/history");
        if (!response.ok) throw new Error("Backend not responding");
        const result = await response.json();
        setTransactions(result);
      } catch (err) {
        console.error("Connection to FlashGuard API failed:", err);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 2000); // Polling every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // 2. Process data for Spending Pattern (Bar Chart)
  const spendingPatternData = transactions.reduce((acc, curr) => {
    const category = curr.type || "Other";
    const existing = acc.find(item => item.category === category);
    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ category, amount: curr.amount });
    }
    return acc;
  }, []);

  // 3. Process data for Transaction Frequency (Area Chart)
  const transactionFrequencyData = transactions.slice(-10).map((t, i) => ({
    hour: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    count: i + 1
  }));

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
        <h1 className="text-3xl font-bold text-blue-700 mb-2">User Behavior Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time fraud detection and behavioral patterns</p>
      </div>

      {/* Live Transaction Frequency */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Transaction Frequency Heatmap</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={transactionFrequencyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
            <XAxis dataKey="hour" className="text-gray-600 dark:text-gray-400" />
            <YAxis className="text-gray-600 dark:text-gray-400" />
            <Tooltip contentStyle={{ backgroundColor: 'rgb(31, 41, 55)', color: 'white' }} />
            <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Transactions" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Pattern by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Spending Pattern by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingPatternData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" className="text-gray-600 dark:text-gray-400" />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip />
              <Bar dataKey="amount" fill="#8b5cf6" name="Total Amount (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Behavior Radar Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">User Behavior Profile</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={userBehaviorData}>
              <PolarGrid className="stroke-gray-300 dark:stroke-gray-600" />
              <PolarAngleAxis dataKey="metric" className="text-gray-600 dark:text-gray-400" />
              <Radar name="Score" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Tracking Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Location Change Tracking</h2>
        <div className="space-y-4">
          {[
            { user: 'USR-8901', locations: ['Mumbai', 'Moscow', 'Beijing'], risk: 'High' },
            { user: 'USR-4523', locations: ['Delhi', 'Mumbai'], risk: 'Low' }
          ].map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-white">{item.user}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {item.risk} Risk
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Route: {item.locations.join(' → ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}