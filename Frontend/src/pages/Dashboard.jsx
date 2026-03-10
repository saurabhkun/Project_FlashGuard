import { useState, useEffect } from 'react';
import { StatsCard } from '../components/StatsCard';
import { FraudGauge } from '../components/FraudGauge';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
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

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) return <div className="p-10 text-center">Loading FlashGuard Engine...</div>;

  const pieData = [
    { name: 'Safe', value: stats.safe_count },
    { name: 'Suspicious', value: stats.suspicious_count },
    { name: 'Fraudulent', value: stats.fraudulent_count },
  ];
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

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
    </div>
  );
}