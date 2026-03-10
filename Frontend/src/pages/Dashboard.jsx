import { useState, useEffect } from 'react';
import { StatsCard } from '../components/StatsCard';
import { FraudGauge } from '../components/FraudGauge';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis 
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/dashboard/stats");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/dashboard/chart-data");
      const data = await response.json();
      setChartData(data);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchChartData();
    const interval = setInterval(() => {
      fetchStats();
      fetchChartData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) return <div className="p-10 text-center">Loading FlashGuard Engine...</div>;

  const pieData = [
    { name: 'Safe', value: stats.safe_count },
    { name: 'Suspicious', value: stats.suspicious_count },
    { name: 'Fraudulent', value: stats.fraudulent_count },
  ];
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  // Format transaction trends data for Area Chart
  const transactionTrends = chartData?.transaction_trends?.map(item => ({
    ...item,
    hour: item.hour ? item.hour.substring(11) : 'N/A'
  })) || [];

  // Format transactions by type for Bar Chart
  const transactionsByType = chartData?.transactions_by_type || [];

  // Format risk trend for Line Chart
  const riskTrend = chartData?.risk_trend?.map(item => ({
    ...item,
    hour: item.hour ? item.hour.substring(11) : 'N/A'
  })) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      {/* Stats Cards using your Python backend keys */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total Txns" value={stats.total_transactions} icon="activity" />
        <StatsCard title="Blocked Today" value={stats.blocked_today} icon="alert" />
        <StatsCard title="Avg Amount" value={`₹${Math.round(stats.average_transaction)}`} icon="trending" />
        <StatsCard title="Detection Rate" value={`${stats.fraud_detection_rate}%`} icon="shield" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Risk Gauge</h2>
          <FraudGauge value={stats.overall_risk_score} size={250} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
                {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Trends - Area Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Transaction Trends Over Time</h2>
        {transactionTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={transactionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
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
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No transaction data available yet
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transactions by Type - Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Transactions by Type</h2>
          {transactionsByType.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No transaction data available yet
            </div>
          )}
        </div>

        {/* Risk Score Trend - Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Risk Score Trend</h2>
          {riskTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avg_risk" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Avg Risk Score"
                  dot={{ fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No risk data available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
