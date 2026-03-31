export default function TransactionTable({ transactions }) {
  
  // Helper to normalize transaction data from different sources
  const normalizeTransaction = (txn) => {
    return {
      id: txn.transaction_id || txn.id || 'N/A',
      userId: txn.nameOrig || txn.userId || 'Unknown',
      amount: txn.amount || 0,
      location: txn.location || 'Unknown',
      riskScore: txn.risk_score || txn.riskScore || 0,
      status: txn.status || 'Unknown',
      type: txn.type || 'N/A',
      timestamp: txn.timestamp || null,
      ipAddress: txn.ip_address || 'N/A',
      deviceId: txn.device_id || 'Unknown',
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Transaction ID</th>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">IP Address</th>
            <th className="px-4 py-3 text-left">Device ID</th>
            <th className="px-4 py-3 text-left">Location</th>
            <th className="px-4 py-3 text-left">Risk Score</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions && transactions.length > 0 ? (
            transactions.map((txn) => {
              const normalized = normalizeTransaction(txn);
              return (
                <tr key={normalized.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{normalized.id}</td>
                  <td className="px-4 py-3">{normalized.userId}</td>
                  <td className="px-4 py-3">{normalized.type}</td>
                  <td className="px-4 py-3">₹{normalized.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{normalized.ipAddress}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 truncate max-w-[100px]">{normalized.deviceId}</td>
                  <td className="px-4 py-3">{normalized.location}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${
                      normalized.riskScore > 70 ? 'text-red-600' : 
                      normalized.riskScore > 30 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {normalized.riskScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        normalized.status === "Fraud" || normalized.status === "FRAUD"
                          ? "bg-red-600 text-white"
                          : normalized.status === "Suspicious" || normalized.status === "SUSPICIOUS"
                          ? "bg-yellow-500 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {normalized.status}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

