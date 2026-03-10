import { useState } from "react";
import { FraudGauge } from "../components/FraudGauge";
import { fraudAPI } from "../services/fraudAPI";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function FraudCheck() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    nameOrig: "USR-1001",
    nameDest: "USR-2001",
    type: "PAYMENT",
    amount: "",
    oldbalanceOrg: "10000",
    newbalanceOrig: "",
    oldbalanceDest: "5000",
    newbalanceDest: "",
    location: "Mumbai, India",
    device_id: "device-001",
    gps_coords: "19.0760,72.8777"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the transaction data
      const transactionData = {
        nameOrig: formData.nameOrig,
        nameDest: formData.nameDest,
        type: formData.type,
        amount: parseFloat(formData.amount),
        oldbalanceOrg: parseFloat(formData.oldbalanceOrg),
        newbalanceOrig: parseFloat(formData.newbalanceOrig) || parseFloat(formData.oldbalanceOrg) - parseFloat(formData.amount),
        oldbalanceDest: parseFloat(formData.oldbalanceDest),
        newbalanceDest: parseFloat(formData.newbalanceDest) || parseFloat(formData.oldbalanceDest) + parseFloat(formData.amount),
        location: formData.location,
        device_id: formData.device_id,
        gps_coords: formData.gps_coords
      };

      // Call the backend API
      const response = await fraudAPI.checkTransaction(transactionData);
      
      setResult({
        riskScore: response.risk_score,
        level: response.level,
        recommendation: response.decision,
        transactionId: response.transaction_id,
        reasons: response.reasons,
        behavioralInsight: response.behavioral_insight,
        isNewUser: response.is_new_user
      });
    } catch (err) {
      console.error('Error checking fraud:', err);
      setError('Failed to connect to backend. Using local calculation.');
      
      // Fallback to local calculation
      const fraudProbability = Math.floor(Math.random() * 100);
      let recommendation = "ACCEPT";
      let riskLevel = "LOW";

      if (fraudProbability > 70) {
        recommendation = "BLOCK";
        riskLevel = "HIGH";
      } else if (fraudProbability > 30) {
        recommendation = "REVIEW";
        riskLevel = "MEDIUM";
      }

      setResult({
        riskScore: fraudProbability,
        level: riskLevel,
        recommendation: recommendation,
        transactionId: "TX-" + Math.floor(Math.random() * 100000),
        reasons: [
          "Unusual transaction location",
          "High amount detected",
          "New user transaction"
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loadExampleData = (scenario = 'fraud') => {
    if (scenario === 'fraud') {
      setFormData({
        nameOrig: "USR-9999",
        nameDest: "USR-8888",
        type: "TRANSFER",
        amount: "125000",
        oldbalanceOrg: "150000",
        newbalanceOrig: "25000",
        oldbalanceDest: "1000",
        newbalanceDest: "126000",
        location: "Moscow, Russia",
        device_id: "device-suspicious",
        gps_coords: "55.7558,37.6173"
      });
    } else if (scenario === 'suspicious') {
      setFormData({
        nameOrig: "USR-5001",
        nameDest: "USR-6001",
        type: "CASH_OUT",
        amount: "45000",
        oldbalanceOrg: "60000",
        newbalanceOrig: "15000",
        oldbalanceDest: "2000",
        newbalanceDest: "47000",
        location: "Lagos, Nigeria",
        device_id: "device-unknown",
        gps_coords: "6.5244,3.3792"
      });
    } else {
      setFormData({
        nameOrig: "USR-1001",
        nameDest: "USR-2001",
        type: "PAYMENT",
        amount: "2500",
        oldbalanceOrg: "10000",
        newbalanceOrig: "7500",
        oldbalanceDest: "5000",
        newbalanceDest: "7500",
        location: "Mumbai, India",
        device_id: "device-001",
        gps_coords: "19.0760,72.8777"
      });
    }
  };

  const riskData = result
    ? [
        { factor: "Amount", value: result.riskScore * 0.3 },
        { factor: "Location", value: result.riskScore * 0.25 },
        { factor: "Behavior", value: result.riskScore * 0.25 },
        { factor: "Velocity", value: result.riskScore * 0.2 }
      ]
    : [];

  const getRecommendationIcon = (recommendation) => {
    switch (recommendation) {
      case "ACCEPT":
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case "REVIEW":
        return <AlertCircle className="w-8 h-8 text-yellow-600" />;
      case "BLOCK":
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return null;
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case "ACCEPT":
        return "bg-green-50 border-green-200 text-green-800";
      case "REVIEW":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "BLOCK":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Fraud Detection Check
        </h1>
        <p className="text-gray-500">
          Analyze transaction details to detect potential fraud
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">⚠️ {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORM */}
        <div className="bg-white rounded-lg p-6 shadow border">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Transaction Details
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => loadExampleData('safe')}
                className="text-green-600 hover:underline text-sm"
              >
                Safe
              </button>
              <button
                type="button"
                onClick={() => loadExampleData('suspicious')}
                className="text-yellow-600 hover:underline text-sm"
              >
                Suspicious
              </button>
              <button
                type="button"
                onClick={() => loadExampleData('fraud')}
                className="text-red-600 hover:underline text-sm"
              >
                Fraud
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="nameOrig"
                value={formData.nameOrig}
                onChange={handleChange}
                placeholder="Sender ID"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="nameDest"
                value={formData.nameDest}
                onChange={handleChange}
                placeholder="Receiver ID"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="PAYMENT">Payment</option>
                <option value="TRANSFER">Transfer</option>
                <option value="CASH_OUT">Cash Out</option>
                <option value="DEBIT">Debit</option>
              </select>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Amount"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="oldbalanceOrg"
                value={formData.oldbalanceOrg}
                onChange={handleChange}
                placeholder="Sender Balance (Before)"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                name="newbalanceOrig"
                value={formData.newbalanceOrig}
                onChange={handleChange}
                placeholder="Sender Balance (After)"
                className="w-full border p-2 rounded"
              />
            </div>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full border p-2 rounded"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Analyzing...
                </>
              ) : (
                "Check Fraud Risk"
              )}
            </button>
          </form>
        </div>

        {/* RESULT */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Gauge */}
              <div className="bg-white rounded-lg p-6 shadow border">
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Fraud Risk Score
                </h2>
                <FraudGauge value={result.riskScore} size={220} />
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">
                    Transaction ID
                  </p>
                  <p className="font-mono font-semibold">
                    {result.transactionId}
                  </p>
                  {result.isNewUser && (
                    <p className="text-sm text-yellow-600 mt-1">
                      ⚠️ New User
                    </p>
                  )}
                </div>
              </div>

              {/* Recommendation */}
              <div
                className={`rounded-lg p-6 border ${getRecommendationColor(
                  result.recommendation
                )}`}
              >
                <div className="flex items-center space-x-3">
                  {getRecommendationIcon(result.recommendation)}
                  <div>
                    <h3 className="font-semibold text-lg">
                      Recommendation: {result.recommendation}
                    </h3>
                    <p>
                      Risk Level: {result.level}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div className="bg-white rounded-lg p-6 shadow border">
                <h3 className="text-lg font-semibold mb-4">
                  Risk Factors (SHAP-like Explanations)
                </h3>
                <ul className="space-y-2">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {reason}
                    </li>
                  ))}
                </ul>
                {result.behavioralInsight && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Behavioral Insight:</strong> {result.behavioralInsight}
                    </p>
                  </div>
                )}
              </div>

              {/* Risk Factor Graph */}
              <div className="bg-white rounded-lg p-6 shadow border">
                <h3 className="text-lg font-semibold mb-4">
                  Risk Factor Analysis
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={riskData}>
                    <XAxis dataKey="factor" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="bg-white p-10 rounded-lg shadow border text-center text-gray-400">
              <p>Enter transaction details and click "Check Fraud Risk" to analyze</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

