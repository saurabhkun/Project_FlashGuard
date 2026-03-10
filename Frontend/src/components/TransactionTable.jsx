export default function TransactionTable({ transactions }) {

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">

      <table className="min-w-full text-sm">

        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Transaction ID</th>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Amount</th>
            <th className="px-4 py-3 text-left">Location</th>
            <th className="px-4 py-3 text-left">Risk Score</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>

          {transactions.map((txn) => (

            <tr key={txn.id} className="border-t">

              <td className="px-4 py-3">{txn.id}</td>

              <td className="px-4 py-3">{txn.userId}</td>

              <td className="px-4 py-3">
                ₹{txn.amount.toLocaleString()}
              </td>

              <td className="px-4 py-3">{txn.location}</td>

              <td className="px-4 py-3">{txn.riskScore}%</td>

              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    txn.status === "Fraud"
                      ? "bg-red-600 text-white"
                      : txn.status === "Suspicious"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {txn.status}
                </span>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}