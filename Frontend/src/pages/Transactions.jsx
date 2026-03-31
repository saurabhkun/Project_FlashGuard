import { useState, useEffect } from 'react';
import TransactionTable from '../components/TransactionTable';

export default function Transactions() {
  const [data, setData] = useState({ transactions: [], count: 0 });

  useEffect(() => {
    // 1. Initial snapshot fetch
    const fetchTxns = () => {
      fetch("http://127.0.0.1:8000/transactions?limit=50")
        .then(res => res.json())
        .then(json => setData(json));
    };
    fetchTxns();
    
    // 2. Real-time sub-second WebSocket pushes
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/alerts");
    ws.onmessage = (event) => {
      try {
        const newTxn = JSON.parse(event.data);
        
        setData(prev => {
            const mappedTxn = {
               ...newTxn,
               status: newTxn.level,
               timestamp: new Date().toISOString()
            };
            return {
                transactions: [mappedTxn, ...prev.transactions].slice(0, 100),
                count: prev.count + 1
            };
        });
      } catch (err) {
        console.error("WS error:", err);
      }
    };
    return () => ws.close();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Live Monitoring ({data.count} txns)</h2>
      <TransactionTable transactions={data.transactions} />
    </div>
  );
}