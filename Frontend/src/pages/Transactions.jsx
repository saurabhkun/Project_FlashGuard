import { useState, useEffect } from 'react';

export default function Transactions() {
  const [data, setData] = useState({ transactions: [], count: 0 });

  useEffect(() => {
    const fetchTxns = () => {
      fetch("http://127.0.0.1:8000/transactions?limit=50")
        .then(res => res.json())
        .then(json => setData(json));
    };
    fetchTxns();
    const interval = setInterval(fetchTxns, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Live Monitoring ({data.count} txns)</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-gray-400 text-sm">
            <th className="py-3">User</th>
            <th className="py-3">Amount</th>
            <th className="py-3">Status</th>
            <th className="py-3">Risk</th>
          </tr>
        </thead>
        <tbody>
          {data.transactions.map((t, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="py-3 font-medium">{t.nameOrig}</td>
              <td className="py-3">₹{t.amount}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  t.status === 'FRAUD' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {t.status}
                </span>
              </td>
              <td className="py-3 font-bold">{t.risk_score}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}