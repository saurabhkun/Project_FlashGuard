import { useState } from "react";
import { FraudGauge } from "../components/FraudGauge";
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
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    transactionTime: "",
    deviceScore: "",
    location: "",
    ipRiskScore: "",
    accountAge: "",
    transactionFrequency: "",
    merchantCategory: "",
    paymentMethod: "",
    failedLoginAttempts: "",
  });

  const handleSubmit = (e) => {

    e.preventDefault();

    setLoading(true);

    setTimeout(() => {

      const fraudProbability = Math.floor(Math.random() * 100);

      let recommendation = "ALLOW";
      let riskLevel = "Low";

      if (fraudProbability > 70) {
        recommendation = "BLOCK";
        riskLevel = "High";
      } else if (fraudProbability > 40) {
        recommendation = "REVIEW";
        riskLevel = "Medium";
      }

      setResult({
        fraudProbability,
        recommendation,
        riskLevel,
        transactionId: "TX-" + Math.floor(Math.random() * 100000),
        reasons: [
          "Unusual transaction location",
          "High IP risk score",
          "Multiple login attempts"
        ]
      });

      setLoading(false);

    }, 1500);
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const loadExampleData = () => {

    setFormData({
      amount: "12000",
      transactionTime: "2026-03-09T02:13",
      deviceScore: "82",
      location: "Russia",
      ipRiskScore: "75",
      accountAge: "3",
      transactionFrequency: "12",
      merchantCategory: "Electronics",
      paymentMethod: "Credit Card",
      failedLoginAttempts: "4",
    });

  };

  const riskData = result
    ? [
        { factor: "Device Score", value: Number(formData.deviceScore) },
        { factor: "IP Risk", value: Number(formData.ipRiskScore) },
        { factor: "Account Age", value: Number(formData.accountAge) },
        { factor: "Login Attempts", value: Number(formData.failedLoginAttempts) }
      ]
    : [];

  const getRecommendationIcon = (recommendation) => {

    switch (recommendation) {

      case "ALLOW":
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

      case "ALLOW":
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* FORM */}

        <div className="bg-white rounded-lg p-6 shadow border">

          <div className="flex justify-between mb-6">

            <h2 className="text-xl font-semibold">
              Transaction Details
            </h2>

            <button
              type="button"
              onClick={loadExampleData}
              className="text-blue-600 hover:underline text-sm"
            >
              Load Example Data
            </button>

          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Transaction Amount"
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="datetime-local"
              name="transactionTime"
              value={formData.transactionTime}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="number"
              name="deviceScore"
              value={formData.deviceScore}
              onChange={handleChange}
              placeholder="Device Score"
              className="w-full border p-2 rounded"
            />

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full border p-2 rounded"
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

                <FraudGauge value={result.fraudProbability} size={220} />

                <div className="text-center mt-4">

                  <p className="text-sm text-gray-500">
                    Transaction ID
                  </p>

                  <p className="font-mono font-semibold">
                    {result.transactionId}
                  </p>

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
                      Risk Level: {result.riskLevel}
                    </p>

                  </div>

                </div>

              </div>

              {/* Risk Factor Graph */}

              <div className="bg-white rounded-lg p-6 shadow border">

                <h3 className="text-lg font-semibold mb-4">
                  Risk Factor Analysis
                </h3>

                <ResponsiveContainer width="100%" height={250}>

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
              No analysis yet
            </div>

          )}

        </div>

      </div>

    </div>
  );
}